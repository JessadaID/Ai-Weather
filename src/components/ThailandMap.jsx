import { useState, useCallback, useRef } from 'react';
import PROVINCE_MAP, { REGION_FILL, REGION_FILL_HOVER, REGION_NAMES } from '../data/thailandProvinces';
import thMapData from '../data/th_map';
import { fetchWeatherByProvince } from '../services/weatherService';
import { Map } from 'lucide-react';

/**
 * ThailandMap - Interactive SVG map using data from th_map.js
 * Hover over province paths to see weather tooltips
 */
export default function ThailandMap({ provinceWeather = {}, onProvinceWeatherLoaded }) {
    const [tooltip, setTooltip] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);
    const [loadingProvince, setLoadingProvince] = useState(null);
    const failedRef = useRef(new Set());
    const fetchTimeoutRef = useRef(null);

    // Extract map data
    const { initial_view, paths } = thMapData;
    const viewBox = `${initial_view.x} ${initial_view.y} ${initial_view.x2} ${initial_view.y2}`;

    // Lazy-fetch weather data when hovering a province
    const fetchOnHover = useCallback(async (nameEn) => {
        // Skip if already loaded or already failed
        if (provinceWeather[nameEn] || failedRef.current.has(nameEn)) return;

        setLoadingProvince(nameEn);
        try {
            const data = await fetchWeatherByProvince(nameEn);
            onProvinceWeatherLoaded?.(nameEn, data);
        } catch {
            failedRef.current.add(nameEn);
        } finally {
            setLoadingProvince(null);
        }
    }, [provinceWeather, onProvinceWeatherLoaded]);

    const handleMouseMove = useCallback((e) => {
        // We can get the ID directly from the target if it's a path
        const target = e.target;
        const id = target.id;

        // Check if we are over a known province path
        if (target.tagName === 'path' && id && PROVINCE_MAP[id]) {
            const province = PROVINCE_MAP[id];

            if (hoveredId !== id) {
                setHoveredId(id);
                // Clear any pending fetch
                if (fetchTimeoutRef.current) {
                    clearTimeout(fetchTimeoutRef.current);
                }
                // Delay fetch by 700ms to avoid fetching while scrolling quickly
                fetchTimeoutRef.current = setTimeout(() => {
                    fetchOnHover(province.nameEn);
                }, 700);
            }

            setTooltip({
                x: e.clientX + 16,
                y: e.clientY - 12,
                province,
                provinceId: id,
                weather: provinceWeather[province.nameEn],
            });
        } else {
            if (hoveredId) {
                if (fetchTimeoutRef.current) {
                    clearTimeout(fetchTimeoutRef.current);
                }
                setHoveredId(null);
                setTooltip(null);
            }
        }
    }, [hoveredId, provinceWeather, fetchOnHover]);

    const handleMouseLeave = useCallback(() => {
        if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
        }
        setHoveredId(null);
        setTooltip(null);
    }, []);

    // Get current tooltip weather from the cache
    const currentTooltipWeather = tooltip && provinceWeather[tooltip.province.nameEn]
        ? provinceWeather[tooltip.province.nameEn]
        : null;

    return (
        <div className="bg-surface border border-border-default rounded-[var(--radius-lg)] p-6 shadow-sm transition-shadow duration-200 hover:shadow-md relative overflow-hidden">
            <div className="text-[13px] font-medium text-text-secondary uppercase tracking-wider mb-4">
                <Map size={20} className="inline-block mr-2 align-middle" />
                แผนที่ประเทศไทย
            </div>

            {/* Region Legend */}
            <div className="flex flex-wrap gap-x-5 gap-y-3 mb-4 px-1">
                {Object.entries(REGION_NAMES).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-1.5 text-xs text-text-secondary font-medium">
                        <span
                            className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
                            style={{ background: REGION_FILL[key] }}
                        />
                        {label}
                    </div>
                ))}
            </div>

            <div
                className="flex justify-center px-5 pt-2 pb-5"
                style={{ background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)' }}
            >
                <svg
                    viewBox={viewBox}
                    className="w-full h-auto max-h-[600px]"
                    fill="#e0e0e0"
                    stroke="#ffffff"
                    style={{ pointerEvents: 'fill' }} // Ensure events only trigger on filled paths
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    {Object.entries(paths).map(([id, d]) => {
                        const province = PROVINCE_MAP[id];
                        if (!province) return null; // Should not happen if data is consistent

                        const isHovered = hoveredId === id;
                        const fillColor = isHovered
                            ? REGION_FILL_HOVER[province.region] || '#bbb'
                            : REGION_FILL[province.region] || '#e0e0e0';

                        return (
                            <path
                                key={id}
                                id={id}
                                d={d}
                                strokeWidth="1px"
                                style={{
                                    fill: fillColor,
                                    transition: 'fill 0.2s ease, filter 0.2s ease',
                                    cursor: 'pointer',
                                    filter: isHovered ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.25))' : 'none',
                                    outline: 'none'
                                }}
                            />
                        );
                    })}
                </svg>
            </div>

            {tooltip && (
                <div
                    className="fixed pointer-events-none bg-white/95 backdrop-blur-xl border border-white/50 rounded-[var(--radius-md)] py-3.5 px-4.5 shadow-lg z-[1000] min-w-[180px]"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y,
                        opacity: 1,
                        animation: 'fadeIn 0.15s ease-out',
                    }}
                >
                    <div className="text-base font-bold text-text-primary mb-0.5">
                        {tooltip.province.name}
                    </div>
                    <div className="text-[11px] text-text-secondary mb-1">
                        {tooltip.province.nameEn}
                        <span className="ml-2 opacity-60">
                            {REGION_NAMES[tooltip.province.region]}
                        </span>
                    </div>
                    {currentTooltipWeather ? (
                        <>
                            <div className="text-[28px] font-bold text-text-primary my-1 tracking-tight">
                                {Math.round(currentTooltipWeather.main.temp)}°C
                            </div>
                            <div className="text-[13px] text-text-secondary capitalize">
                                {currentTooltipWeather.weather[0].description}
                            </div>
                            <div className="text-[11px] text-text-secondary mt-1">
                                ความชื้น {currentTooltipWeather.main.humidity}%
                            </div>
                        </>
                    ) : loadingProvince === tooltip.province.nameEn ? (
                        <div className="text-xs text-text-secondary">
                            กำลังโหลด...
                        </div>
                    ) : (
                        <div className="text-xs text-text-muted">
                            เลื่อนเมาส์มาเพื่อดูข้อมูล
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
