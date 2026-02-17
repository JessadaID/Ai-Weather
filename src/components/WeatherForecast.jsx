import { getWeatherIconUrl } from '../services/weatherService';

/**
 * WeatherForecast - horizontal scrollable 5-day forecast
 */
export default function WeatherForecast({ forecast, loading, error }) {
    if (loading) {
        return (
            <div className="forecast-section">
                <div className="section-title">พยากรณ์อากาศ</div>
                <div className="loading-state">กำลังโหลดพยากรณ์...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="forecast-section">
                <div className="section-title">พยากรณ์อากาศ</div>
                <div className="error-state">
                    <span>⚠️</span>
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
        <div className="forecast-section">
            <div className="section-title">พยากรณ์อากาศ</div>
            <div className="forecast-scroll">
                {forecast.map((day) => (
                    <div
                        key={day.date}
                        className={`forecast-day ${day.date === today ? 'today' : ''}`}
                    >
                        <div className="forecast-day-name">
                            {day.date === today ? 'วันนี้' : getDayName(day.date)}
                        </div>
                        <div className="forecast-day-date">{getDateStr(day.date)}</div>
                        <img
                            className="forecast-icon"
                            src={getWeatherIconUrl(day.icon)}
                            alt={day.description}
                        />
                        <div className="forecast-temps">
                            <span className="forecast-temp-high">{day.temp_max}°</span>
                            <span className="forecast-temp-low">{day.temp_min}°</span>
                        </div>
                        <div className="forecast-desc">{day.description}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
