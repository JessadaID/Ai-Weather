import { getWeatherIconUrl } from '../services/weatherService';
import { AlertTriangle, RefreshCw, ArrowLeft, Wind, Activity } from 'lucide-react';
import { useState } from 'react';

/**
 * CurrentWeather card - displays current weather info
 */
export default function WeatherCard({ weather, airQuality, loading, error, onRefresh }) {
    const [showDetailedAQI, setShowDetailedAQI] = useState(false);

    // Helper for AQI color/text
    const getAQIStatus = (val) => {
        if (val <= 50) return { text: 'ดี', color: 'text-green-600', bg: 'bg-green-50' };
        if (val <= 100) return { text: 'ปานกลาง', color: 'text-yellow-600', bg: 'bg-yellow-50' };
        if (val <= 150) return { text: 'มีผลต่อสุขภาพ', color: 'text-orange-600', bg: 'bg-orange-50' };
        if (val <= 200) return { text: 'มีผลต่อสุขภาพมาก', color: 'text-red-600', bg: 'bg-red-50' };
        return { text: 'อันตราย', color: 'text-purple-600', bg: 'bg-purple-50' };
    };

    if (loading) {
        return (
            <div className="bg-surface border border-border-default rounded-[var(--radius-lg)] p-6 shadow-sm transition-shadow duration-200 hover:shadow-md flex flex-col h-full min-h-[350px]">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-[13px] font-medium text-text-secondary uppercase tracking-wider">
                        สภาพอากาศปัจจุบัน
                    </div>
                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className={`text-text-secondary hover:text-text-primary transition-colors p-1 -mr-1 rounded-full hover:bg-black/5 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="อัปเดตข้อมูล"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
                <div className="flex items-center justify-center flex-1 text-text-secondary text-sm">
                    กำลังโหลดข้อมูล...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-surface border border-border-default rounded-[var(--radius-lg)] p-6 shadow-sm transition-shadow duration-200 hover:shadow-md flex flex-col h-full min-h-[350px]">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-[13px] font-medium text-text-secondary uppercase tracking-wider">
                        สภาพอากาศปัจจุบัน
                    </div>
                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className={`text-text-secondary hover:text-text-primary transition-colors p-1 -mr-1 rounded-full hover:bg-black/5 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="อัปเดตข้อมูล"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center flex-1 px-5 text-text-secondary text-sm text-center gap-2">
                    <AlertTriangle size={24} />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    // Detailed AQI View
    if (showDetailedAQI && airQuality) {
        const iaqi = airQuality.iaqi || {};
        const status = getAQIStatus(airQuality.aqi);

        return (
            <div className="bg-surface border border-border-default rounded-[var(--radius-lg)] p-6 shadow-sm transition-shadow duration-200 hover:shadow-md flex flex-col h-full min-h-[350px] animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        <button
                            onClick={() => setShowDetailedAQI(false)}
                            className="p-1 -ml-1 mr-2 hover:bg-black/5 rounded-full transition-colors text-text-secondary hover:text-text-primary"
                            title="กลับ"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div className="text-[13px] font-medium text-text-secondary uppercase tracking-wider">
                            คุณภาพอากาศ
                        </div>
                    </div>
                    {airQuality.city && (
                        <div className="text-[10px] text-text-muted max-w-[120px] truncate text-right">
                            {airQuality.city.name}
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center justify-center flex-1 py-2">
                    <div className={`text-6xl font-bold mb-2 tracking-tighter ${status.color}`}>
                        {airQuality.aqi}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium mb-8 ${status.bg} ${status.color}`}>
                        {status.text}
                    </div>

                    <div className="grid grid-cols-3 gap-3 w-full">
                        {[
                            { label: 'PM2.5', value: iaqi.pm25?.v },
                            { label: 'PM10', value: iaqi.pm10?.v },
                            { label: 'O3', value: iaqi.o3?.v },
                            { label: 'NO2', value: iaqi.no2?.v },
                            { label: 'SO2', value: iaqi.so2?.v },
                            { label: 'CO', value: iaqi.co?.v },
                        ].map((item, i) => (
                            item.value !== undefined && (
                                <div key={i} className="flex flex-col items-center justify-center p-2.5 bg-bg/50 rounded-lg border border-border-default/50">
                                    <div className="text-[10px] text-text-muted mb-0.5">{item.label}</div>
                                    <div className="text-sm font-medium text-text-primary">{item.value}</div>
                                </div>
                            )
                        ))}
                    </div>

                    <div className="mt-6 text-[10px] text-text-muted text-center">
                        ข้อมูลจาก WAQI.info
                    </div>
                </div>
            </div>
        );
    }

    if (!weather) return null;

    const temp = Math.round(weather.main.temp);
    const feelsLike = Math.round(weather.main.feels_like);
    const icon = weather.weather[0].icon;
    const desc = weather.weather[0].description;
    const humidity = weather.main.humidity;
    const wind = weather.wind.speed;
    const visibility = (weather.visibility / 1000).toFixed(1);
    const aqi = airQuality?.aqi || '-';

    return (
        <div className="bg-surface border border-border-default rounded-[var(--radius-lg)] p-6 shadow-sm transition-shadow duration-200 hover:shadow-md flex flex-col h-full min-h-[350px]">
            <div className="flex justify-between items-center mb-4">
                <div className="text-[13px] font-medium text-text-secondary uppercase tracking-wider">
                    สภาพอากาศปัจจุบัน
                </div>
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className={`text-text-secondary hover:text-text-primary transition-colors p-1 -mr-1 rounded-full hover:bg-black/5 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="อัปเดตข้อมูล"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>
            <div className="flex items-center gap-4 mb-5 flex-1 items-start">
                <img
                    className="w-[72px] h-[72px]"
                    src={getWeatherIconUrl(icon)}
                    alt={desc}
                />
                <div>
                    <div className="text-[52px] font-light leading-none text-text-primary tracking-[-2px] max-md:text-[42px]">
                        {temp}
                        <span className="text-2xl font-normal text-text-secondary align-top ml-0.5">
                            °C
                        </span>
                    </div>
                </div>
            </div>
            <div className="text-base text-text-secondary mb-5 capitalize">
                {desc} · รู้สึกเหมือน {feelsLike}°C
            </div>
            <div className="grid grid-cols-4 gap-3 pt-4 border-t border-border-light mt-auto">
                <div className="text-center bg-transparent">
                    <div className="text-[11px] text-text-muted uppercase tracking-wider mb-1">
                        ความชื้น
                    </div>
                    <div className="text-base font-medium text-text-primary">
                        {humidity}%
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-[11px] text-text-muted uppercase tracking-wider mb-1">
                        ลม
                    </div>
                    <div className="text-base font-medium text-text-primary">
                        {wind} m/s
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-[11px] text-text-muted uppercase tracking-wider mb-1">
                        ทัศนวิสัย
                    </div>
                    <div className="text-base font-medium text-text-primary">
                        {visibility} km
                    </div>
                </div>
                <div
                    className={`text-center rounded-lg p-1 -my-1 -mx-1 transition-all ${airQuality ? 'hover:bg-black/5 cursor-pointer active:scale-95' : 'cursor-default'}`}
                    onClick={() => airQuality && setShowDetailedAQI(true)}
                    title={airQuality ? "ดูรายละเอียดคุณภาพอากาศ" : "ไม่มีข้อมูล AQI"}
                >
                    <div className="text-[11px] text-text-muted uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                        AQI {airQuality && <Activity size={10} />}
                    </div>
                    <div className={`text-base font-medium ${airQuality ? 'text-accent-hover' : 'text-text-primary'}`}>
                        {aqi}
                    </div>
                </div>
            </div>
        </div>
    );
}
