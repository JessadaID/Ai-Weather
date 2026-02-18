import { CloudSun, MapPin, LocateFixed, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import './App.css';
import WeatherCard from './components/WeatherCard';
import WeatherForecast from './components/WeatherForecast';
import AIChatBox from './components/AIChatBox';
import ThailandMap from './components/ThailandMap';
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchAirQuality,
  formatWeatherForAI,
} from './services/weatherService';

// Fallback location: Bangkok
const DEFAULT_LAT = 13.7563;
const DEFAULT_LON = 100.5018;

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [airQuality, setAirQuality] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [weatherContext, setWeatherContext] = useState('');
  const [provinceWeather, setProvinceWeather] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [locationName, setLocationName] = useState('กำลังหาตำแหน่ง...');
  const [locationLoading, setLocationLoading] = useState(false);

  // Get user's current location, then fetch weather
  useEffect(() => {
    handleMyLocation();
  }, []);

  const handleMyLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          loadWeatherData(pos.coords.latitude, pos.coords.longitude).finally(() => setLocationLoading(false));
        },
        () => {
          // Fallback to Bangkok if geolocation denied/failed
          loadWeatherData(DEFAULT_LAT, DEFAULT_LON).finally(() => setLocationLoading(false));
        },
        { timeout: 8000 }
      );
    } else {
      loadWeatherData(DEFAULT_LAT, DEFAULT_LON).finally(() => setLocationLoading(false));
    }
  };

  const loadWeatherData = async (lat, lon) => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const [current, forecastData, aqi] = await Promise.all([
        fetchCurrentWeather(lat, lon),
        fetchForecast(lat, lon),
        fetchAirQuality(lat, lon).catch(() => null), // If AQ fails, just return null
      ]);
      setCurrentWeather(current);
      setForecast(forecastData);
      setAirQuality(aqi);
      setWeatherContext(formatWeatherForAI(current, forecastData, aqi));
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

  const handleRefresh = () => {
    if (currentWeather?.coord) {
      loadWeatherData(currentWeather.coord.lat, currentWeather.coord.lon);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadWeatherData(pos.coords.latitude, pos.coords.longitude),
        () => loadWeatherData(DEFAULT_LAT, DEFAULT_LON)
      );
    } else {
      loadWeatherData(DEFAULT_LAT, DEFAULT_LON);
    }
  };

  const handleProvinceSelect = (data) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (data?.weather?.coord) {
      loadWeatherData(data.weather.coord.lat, data.weather.coord.lon);
    } else if (data?.coord) {
      loadWeatherData(data.coord.lat, data.coord.lon);
    }
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
          <button
            onClick={handleMyLocation}
            disabled={locationLoading} // Disable while loading
            title="ตำแหน่งปัจจุบัน"
            className={`hover:text-text-primary transition-colors flex items-center justify-center p-1 -ml-1 rounded-full hover:bg-black/5 ${locationLoading ? 'cursor-not-allowed opacity-70' : ''}`}
          >
            {locationLoading ? <Loader2 size={14} className="animate-spin" /> : <LocateFixed size={14} />}
          </button>
          <div className="w-px h-3 bg-border-default mx-1"></div>
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
          airQuality={airQuality}
          loading={weatherLoading}
          error={weatherError}
          onRefresh={handleRefresh}
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
        onSelect={handleProvinceSelect}
      />
    </div>
  );
}

export default App;
