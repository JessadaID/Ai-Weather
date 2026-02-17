import { getWeatherIconUrl } from '../services/weatherService';
import { AlertTriangle } from 'lucide-react';

/**
 * CurrentWeather card - displays current weather info
 */
export default function WeatherCard({ weather, loading, error }) {
    if (loading) {
        return (
            <div className="bg-surface border border-border-default rounded-[var(--radius-lg)] p-6 shadow-sm transition-shadow duration-200 hover:shadow-md flex flex-col">
                <div className="text-[13px] font-medium text-text-secondary uppercase tracking-wider mb-4">
                    สภาพอากาศปัจจุบัน
                </div>
                <div className="flex items-center justify-center py-15 text-text-secondary text-sm">
                    กำลังโหลดข้อมูล...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-surface border border-border-default rounded-[var(--radius-lg)] p-6 shadow-sm transition-shadow duration-200 hover:shadow-md flex flex-col">
                <div className="text-[13px] font-medium text-text-secondary uppercase tracking-wider mb-4">
                    สภาพอากาศปัจจุบัน
                </div>
                <div className="flex flex-col items-center justify-center py-10 px-5 text-text-secondary text-sm text-center gap-2">
                    <AlertTriangle size={24} />
                    <span>{error}</span>
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

    return (
        <div className="bg-surface border border-border-default rounded-[var(--radius-lg)] p-6 shadow-sm transition-shadow duration-200 hover:shadow-md flex flex-col">
            <div className="text-[13px] font-medium text-text-secondary uppercase tracking-wider mb-4">
                สภาพอากาศปัจจุบัน
            </div>
            <div className="flex items-center gap-4 mb-5">
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
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border-light">
                <div className="text-center">
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
            </div>
        </div>
    );
}
