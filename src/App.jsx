import { useState, useEffect } from 'react';
import './App.css';
import WeatherCard from './components/WeatherCard';
import WeatherForecast from './components/WeatherForecast';
import AIChatBox from './components/AIChatBox';
import ThailandMap from './components/ThailandMap';
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchWeatherByProvince,
  formatWeatherForAI,
} from './services/weatherService';
import { KEY_PROVINCES } from './data/thailandMapData';

// Default location: Bangkok
const DEFAULT_LAT = 13.7563;
const DEFAULT_LON = 100.5018;

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [weatherContext, setWeatherContext] = useState('');
  const [provinceWeather, setProvinceWeather] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch weather data on mount
  useEffect(() => {
    loadWeatherData();
    loadProvinceWeather();
  }, []);

  const loadWeatherData = async () => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const [current, forecastData] = await Promise.all([
        fetchCurrentWeather(DEFAULT_LAT, DEFAULT_LON),
        fetchForecast(DEFAULT_LAT, DEFAULT_LON),
      ]);
      setCurrentWeather(current);
      setForecast(forecastData);
      setWeatherContext(formatWeatherForAI(current, forecastData));
      setLastUpdated(new Date());
    } catch (err) {
      setWeatherError(err.message);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Load weather for key provinces (for map display)
  const loadProvinceWeather = async () => {
    const results = {};
    // Fetch in batches to avoid rate limiting
    for (let i = 0; i < KEY_PROVINCES.length; i += 5) {
      const batch = KEY_PROVINCES.slice(i, i + 5);
      const promises = batch.map(async (name) => {
        try {
          const data = await fetchWeatherByProvince(name);
          results[name] = data;
        } catch {
          // Skip failed provinces silently
        }
      });
      await Promise.all(promises);
    }
    setProvinceWeather(results);
  };

  const formatUpdateTime = () => {
    if (!lastUpdated) return '';
    return lastUpdated.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <span className="header-icon">☁️</span>
          <div>
            <h1>AI Weather Thailand</h1>
            <div className="header-subtitle">สภาพอากาศ · พยากรณ์ · AI วิเคราะห์</div>
          </div>
        </div>
        <div className="header-location">
          📍 กรุงเทพมหานคร
          {lastUpdated && (
            <span style={{ color: '#adb5bd', marginLeft: '8px' }}>
              อัปเดต {formatUpdateTime()}
            </span>
          )}
        </div>
      </header>

      {/* Main Content: Weather + AI Chat */}
      <div className="main-grid">
        <WeatherCard
          weather={currentWeather}
          loading={weatherLoading}
          error={weatherError}
        />
        <AIChatBox weatherContext={weatherContext} />
      </div>

      {/* Forecast */}
      <WeatherForecast
        forecast={forecast}
        loading={weatherLoading}
        error={weatherError}
      />

      {/* Thailand Map */}
      <ThailandMap provinceWeather={provinceWeather} />
    </div>
  );
}

export default App;
