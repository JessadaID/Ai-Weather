import { useState, useCallback } from 'react';
import { PROVINCES, REGION_COLORS, REGION_HOVER_COLORS } from '../data/thailandMapData';

/**
 * ThailandMap - Interactive SVG map of Thailand with province hover tooltips
 * Uses approximate province positions to render circles on an outline map
 */
export default function ThailandMap({ provinceWeather = {} }) {
    const [tooltip, setTooltip] = useState(null);
    const [hoveredProvince, setHoveredProvince] = useState(null);

    // Map coordinate transform: lat/lon to SVG x/y
    // Thailand bounds: lat 5.5-20.5, lon 97-106
    const lonMin = 96.5;
    const lonMax = 106.5;
    const latMin = 5.0;
    const latMax = 21.0;
    const svgWidth = 400;
    const svgHeight = 620;

    const toSvgX = (lon) => ((lon - lonMin) / (lonMax - lonMin)) * svgWidth;
    const toSvgY = (lat) => svgHeight - ((lat - latMin) / (latMax - latMin)) * svgHeight;

    // Thailand outline path (simplified)
    const thailandOutline = `
    M ${toSvgX(100.1)},${toSvgY(20.4)}
    C ${toSvgX(100.5)},${toSvgY(20.5)} ${toSvgX(101.0)},${toSvgY(20.0)} ${toSvgX(100.8)},${toSvgY(19.5)}
    C ${toSvgX(100.5)},${toSvgY(19.0)} ${toSvgX(100.1)},${toSvgY(19.5)} ${toSvgX(99.9)},${toSvgY(19.8)}
    C ${toSvgX(99.5)},${toSvgY(20.2)} ${toSvgX(99.0)},${toSvgY(20.4)} ${toSvgX(98.5)},${toSvgY(19.8)}
    C ${toSvgX(98.0)},${toSvgY(19.3)} ${toSvgX(97.5)},${toSvgY(19.5)} ${toSvgX(97.5)},${toSvgY(18.5)}
    C ${toSvgX(97.8)},${toSvgY(17.5)} ${toSvgX(98.5)},${toSvgY(17.0)} ${toSvgX(98.5)},${toSvgY(16.0)}
    C ${toSvgX(98.5)},${toSvgY(15.5)} ${toSvgX(98.8)},${toSvgY(15.0)} ${toSvgX(99.0)},${toSvgY(14.5)}
    C ${toSvgX(99.0)},${toSvgY(14.0)} ${toSvgX(98.8)},${toSvgY(13.5)} ${toSvgX(99.0)},${toSvgY(13.0)}
    C ${toSvgX(99.2)},${toSvgY(12.5)} ${toSvgX(99.5)},${toSvgY(12.0)} ${toSvgX(99.5)},${toSvgY(11.5)}
    C ${toSvgX(99.5)},${toSvgY(11.0)} ${toSvgX(99.2)},${toSvgY(10.5)} ${toSvgX(99.0)},${toSvgY(10.0)}
    C ${toSvgX(98.7)},${toSvgY(9.5)} ${toSvgX(98.3)},${toSvgY(9.8)} ${toSvgX(98.3)},${toSvgY(9.0)}
    C ${toSvgX(98.3)},${toSvgY(8.5)} ${toSvgX(98.2)},${toSvgY(8.0)} ${toSvgX(98.3)},${toSvgY(7.8)}
    C ${toSvgX(98.5)},${toSvgY(7.5)} ${toSvgX(98.7)},${toSvgY(7.8)} ${toSvgX(98.8)},${toSvgY(8.0)}
    C ${toSvgX(99.0)},${toSvgY(7.5)} ${toSvgX(99.5)},${toSvgY(7.0)} ${toSvgX(99.5)},${toSvgY(6.8)}
    C ${toSvgX(99.8)},${toSvgY(6.5)} ${toSvgX(100.2)},${toSvgY(6.2)} ${toSvgX(100.5)},${toSvgY(6.3)}
    C ${toSvgX(101.0)},${toSvgY(6.5)} ${toSvgX(101.5)},${toSvgY(6.2)} ${toSvgX(101.8)},${toSvgY(6.3)}
    C ${toSvgX(102.1)},${toSvgY(6.5)} ${toSvgX(101.8)},${toSvgY(7.0)} ${toSvgX(101.0)},${toSvgY(7.3)}
    C ${toSvgX(100.8)},${toSvgY(7.5)} ${toSvgX(100.5)},${toSvgY(7.8)} ${toSvgX(100.5)},${toSvgY(8.2)}
    C ${toSvgX(100.2)},${toSvgY(8.5)} ${toSvgX(100.0)},${toSvgY(9.0)} ${toSvgX(99.8)},${toSvgY(9.5)}
    C ${toSvgX(99.5)},${toSvgY(10.0)} ${toSvgX(99.5)},${toSvgY(10.5)} ${toSvgX(100.0)},${toSvgY(11.0)}
    C ${toSvgX(100.5)},${toSvgY(11.5)} ${toSvgX(100.8)},${toSvgY(12.0)} ${toSvgX(101.0)},${toSvgY(12.5)}
    C ${toSvgX(101.5)},${toSvgY(12.0)} ${toSvgX(102.0)},${toSvgY(11.8)} ${toSvgX(102.5)},${toSvgY(12.0)}
    C ${toSvgX(103.0)},${toSvgY(12.3)} ${toSvgX(102.5)},${toSvgY(13.0)} ${toSvgX(102.3)},${toSvgY(13.5)}
    C ${toSvgX(102.8)},${toSvgY(14.0)} ${toSvgX(103.2)},${toSvgY(14.5)} ${toSvgX(103.5)},${toSvgY(14.3)}
    C ${toSvgX(104.0)},${toSvgY(14.5)} ${toSvgX(104.8)},${toSvgY(14.8)} ${toSvgX(105.0)},${toSvgY(15.0)}
    C ${toSvgX(105.3)},${toSvgY(15.5)} ${toSvgX(105.5)},${toSvgY(16.0)} ${toSvgX(105.0)},${toSvgY(16.5)}
    C ${toSvgX(104.8)},${toSvgY(17.0)} ${toSvgX(104.5)},${toSvgY(17.5)} ${toSvgX(104.8)},${toSvgY(17.8)}
    C ${toSvgX(104.5)},${toSvgY(18.0)} ${toSvgX(104.0)},${toSvgY(17.8)} ${toSvgX(103.5)},${toSvgY(18.3)}
    C ${toSvgX(103.0)},${toSvgY(18.5)} ${toSvgX(102.5)},${toSvgY(18.0)} ${toSvgX(102.0)},${toSvgY(17.8)}
    C ${toSvgX(101.5)},${toSvgY(18.0)} ${toSvgX(101.0)},${toSvgY(18.5)} ${toSvgX(101.0)},${toSvgY(19.0)}
    C ${toSvgX(100.5)},${toSvgY(19.5)} ${toSvgX(100.8)},${toSvgY(20.0)} ${toSvgX(100.3)},${toSvgY(20.2)}
    Z
  `;

    const handleMouseEnter = useCallback((e, province) => {
        setHoveredProvince(province.nameEn);
        const weather = provinceWeather[province.nameEn];
        setTooltip({
            x: e.clientX + 12,
            y: e.clientY - 10,
            province,
            weather,
        });
    }, [provinceWeather]);

    const handleMouseMove = useCallback((e) => {
        setTooltip((prev) =>
            prev ? { ...prev, x: e.clientX + 12, y: e.clientY - 10 } : null
        );
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoveredProvince(null);
        setTooltip(null);
    }, []);

    // Province dot radius
    const getRadius = (province) => {
        if (province.nameEn === 'Bangkok') return 6;
        return 4.5;
    };

    return (
        <div className="card map-section">
            <div className="card-title">🗺️ แผนที่ประเทศไทย</div>
            <div className="map-container">
                <svg
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    width="100%"
                    style={{ maxHeight: '520px' }}
                >
                    {/* Thailand outline */}
                    <path
                        d={thailandOutline}
                        fill="#f8f9fa"
                        stroke="#dee2e6"
                        strokeWidth="1.5"
                    />

                    {/* Province dots */}
                    {PROVINCES.map((province) => {
                        const x = toSvgX(province.lon);
                        const y = toSvgY(province.lat);
                        const isHovered = hoveredProvince === province.nameEn;
                        const weather = provinceWeather[province.nameEn];
                        const hasWeather = !!weather;

                        // Color based on region
                        const fillColor = isHovered
                            ? REGION_HOVER_COLORS[province.region]
                            : hasWeather
                                ? REGION_COLORS[province.region]
                                : '#e9ecef';

                        const strokeColor = isHovered ? '#495057' : hasWeather ? '#adb5bd' : '#ced4da';

                        return (
                            <g key={province.nameEn}>
                                <circle
                                    cx={x}
                                    cy={y}
                                    r={isHovered ? getRadius(province) + 2 : getRadius(province)}
                                    fill={fillColor}
                                    stroke={strokeColor}
                                    strokeWidth={isHovered ? 1.5 : 0.8}
                                    style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                                    onMouseEnter={(e) => handleMouseEnter(e, province)}
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={handleMouseLeave}
                                />
                                {/* Show temperature label for hovered */}
                                {isHovered && weather && (
                                    <text
                                        x={x}
                                        y={y - getRadius(province) - 6}
                                        textAnchor="middle"
                                        fontSize="10"
                                        fontWeight="600"
                                        fill="#495057"
                                    >
                                        {Math.round(weather.main.temp)}°C
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="map-tooltip"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y,
                        opacity: 1,
                    }}
                >
                    <div className="map-tooltip-name">{tooltip.province.name}</div>
                    <div style={{ fontSize: '11px', color: '#868e96', marginBottom: '4px' }}>
                        {tooltip.province.nameEn}
                    </div>
                    {tooltip.weather ? (
                        <>
                            <div className="map-tooltip-temp">
                                {Math.round(tooltip.weather.main.temp)}°C
                            </div>
                            <div className="map-tooltip-desc">
                                {tooltip.weather.weather[0].description}
                            </div>
                            <div style={{ fontSize: '11px', color: '#868e96', marginTop: '4px' }}>
                                ความชื้น {tooltip.weather.main.humidity}%
                            </div>
                        </>
                    ) : (
                        <div style={{ fontSize: '12px', color: '#adb5bd' }}>
                            ไม่มีข้อมูล
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
