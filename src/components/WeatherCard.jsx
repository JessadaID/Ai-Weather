import { getWeatherIconUrl } from '../services/weatherService';

/**
 * CurrentWeather card - displays current weather info
 */
export default function WeatherCard({ weather, loading, error }) {
    if (loading) {
        return (
            <div className="card current-weather">
                <div className="card-title">สภาพอากาศปัจจุบัน</div>
                <div className="loading-state">กำลังโหลดข้อมูล...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card current-weather">
                <div className="card-title">สภาพอากาศปัจจุบัน</div>
                <div className="error-state">
                    <span>⚠️</span>
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
        <div className="card current-weather">
            <div className="card-title">สภาพอากาศปัจจุบัน</div>
            <div className="weather-main">
                <img
                    className="weather-icon"
                    src={getWeatherIconUrl(icon)}
                    alt={desc}
                />
                <div>
                    <div className="weather-temp">
                        {temp}<span>°C</span>
                    </div>
                </div>
            </div>
            <div className="weather-desc">
                {desc} · รู้สึกเหมือน {feelsLike}°C
            </div>
            <div className="weather-details">
                <div className="weather-detail">
                    <div className="weather-detail-label">ความชื้น</div>
                    <div className="weather-detail-value">{humidity}%</div>
                </div>
                <div className="weather-detail">
                    <div className="weather-detail-label">ลม</div>
                    <div className="weather-detail-value">{wind} m/s</div>
                </div>
                <div className="weather-detail">
                    <div className="weather-detail-label">ทัศนวิสัย</div>
                    <div className="weather-detail-value">{visibility} km</div>
                </div>
            </div>
        </div>
    );
}
