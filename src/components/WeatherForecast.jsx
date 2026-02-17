import { getWeatherIconUrl } from '../services/weatherService';
import { AlertTriangle } from 'lucide-react';

/**
 * WeatherForecast - horizontal scrollable 5-day forecast
 */
export default function WeatherForecast({ forecast, loading, error }) {
    if (loading) {
        return (
            <div className="mb-6">
                <div className="text-[13px] font-medium text-text-secondary uppercase tracking-wider mb-4">
                    พยากรณ์อากาศ
                </div>
                <div className="flex items-center justify-center py-15 text-text-secondary text-sm">
                    กำลังโหลดพยากรณ์...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mb-6">
                <div className="text-[13px] font-medium text-text-secondary uppercase tracking-wider mb-4">
                    พยากรณ์อากาศ
                </div>
                <div className="flex flex-col items-center justify-center py-10 px-5 text-text-secondary text-sm text-center gap-2">
                    <AlertTriangle size={24} />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    if (!forecast || forecast.length === 0) return null;

    const today = new Date().toISOString().split('T')[0];

    // Day name mapping for Thai
    const getDayName = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('th-TH', { weekday: 'short' });
    };

    const getDateStr = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="mb-6">
            <div className="text-[13px] font-medium text-text-secondary uppercase tracking-wider mb-4">
                พยากรณ์อากาศ
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
                {forecast.map((day) => (
                    <div
                        key={day.date}
                        className={`flex-shrink-0 min-w-[120px] bg-surface border rounded-[var(--radius-md)] p-4 text-center shadow-sm transition-all duration-200 cursor-default hover:shadow-md hover:-translate-y-0.5 max-md:min-w-[100px] ${day.date === today
                                ? 'border-accent bg-accent-light'
                                : 'border-border-default'
                            }`}
                    >
                        <div className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
                            {day.date === today ? 'วันนี้' : getDayName(day.date)}
                        </div>
                        <div className="text-[11px] text-text-muted mb-2">
                            {getDateStr(day.date)}
                        </div>
                        <img
                            className="w-10 h-10 mx-auto my-1"
                            src={getWeatherIconUrl(day.icon)}
                            alt={day.description}
                        />
                        <div className="flex justify-center gap-2 mt-2">
                            <span className="text-[15px] font-semibold text-text-primary">
                                {day.temp_max}°
                            </span>
                            <span className="text-[15px] font-normal text-text-muted">
                                {day.temp_min}°
                            </span>
                        </div>
                        <div className="text-[11px] text-text-secondary mt-1.5 capitalize">
                            {day.description}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
