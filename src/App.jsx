import { CloudSun, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import './App.css';
import WeatherCard from './components/WeatherCard';
import WeatherForecast from './components/WeatherForecast';
import AIChatBox from './components/AIChatBox';
import ThailandMap from './components/ThailandMap';
import {
  fetchCurrentWeather,
  fetchForecast,
  formatWeatherForAI,
} from './services/weatherService';

// Fallback location: Bangkok
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
  const [locationName, setLocationName] = useState('กำลังหาตำแหน่ง...');

  // Get user's current location, then fetch weather
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          loadWeatherData(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Fallback to Bangkok if geolocation denied/failed
          loadWeatherData(DEFAULT_LAT, DEFAULT_LON);
        },
        { timeout: 8000 }
      );
    } else {
      loadWeatherData(DEFAULT_LAT, DEFAULT_LON);
    }
  }, []);

  const loadWeatherData = async (lat, lon) => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const [current, forecastData] = await Promise.all([
        fetchCurrentWeather(lat, lon),
        fetchForecast(lat, lon),
      ]);
      setCurrentWeather(current);
      setForecast(forecastData);
      setWeatherContext(formatWeatherForAI(current, forecastData));
      setLocationName(current.name || 'ไม่ทราบตำแหน่ง');
      setLastUpdated(new Date());
    } catch (err) {
      setWeatherError(err.message);
      setLocationName('เกิดข้อผิดพลาด');
    } finally {
      setWeatherLoading(false);
    }
  };

  // Callback for ThailandMap to update provinceWeather cache
  const handleProvinceWeatherLoaded = (nameEn, data) => {
    setProvinceWeather((prev) => ({ ...prev, [nameEn]: data }));
  };

  const formatUpdateTime = () => {
    if (!lastUpdated) return '';
    return lastUpdated.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-5 pt-6 pb-12">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 pb-5 border-b border-border-default max-md:flex-col max-md:items-start max-md:gap-3">
        <div className="flex items-center gap-3">
          <CloudSun className="text-[28px]" size={28} />
          <div>
            <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">
              AI Weather Thailand
            </h1>
            <div className="text-[13px] text-text-secondary font-normal">
              สภาพอากาศ · พยากรณ์ · AI วิเคราะห์
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[13px] text-text-secondary bg-surface px-3.5 py-1.5 rounded-[var(--radius-sm)] border border-border-default">
          <MapPin size={14} /> {locationName}
          {lastUpdated && (
            <span className="text-text-muted ml-2">
              อัปเดต {formatUpdateTime()}
            </span>
          )}
        </div>
      </header>

      {/* Main Content: Weather + AI Chat */}
      <div className="grid grid-cols-2 gap-6 mb-6 max-md:grid-cols-1">
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
      <ThailandMap
        provinceWeather={provinceWeather}
        onProvinceWeatherLoaded={handleProvinceWeatherLoaded}
      />
    </div>
  );
}

export default App;
