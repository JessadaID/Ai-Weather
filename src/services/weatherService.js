// OpenWeather API service for fetching weather data

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetch current weather for given coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<object>} Weather data
 */
export async function fetchCurrentWeather(lat, lon) {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=th`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
    return res.json();
}

/**
 * Fetch 5-day / 3-hour forecast (free tier)
 * Returns data grouped by day for 7-day-like display
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<object>} Forecast data
 */
export async function fetchForecast(lat, lon) {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=th`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Forecast API error: ${res.status}`);
    const data = await res.json();
    return groupForecastByDay(data);
}

/**
 * Fetch raw 3-hour forecast list
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Array>} Raw forecast list
 */
export async function fetchRawForecast(lat, lon) {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=th`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Forecast API error: ${res.status}`);
    const data = await res.json();
    return data.list;
}

/**
 * Fetch weather for a specific province by name
 * @param {string} provinceName - Province name in English
 * @returns {Promise<object>} Weather data
 */
export async function fetchWeatherByProvince(provinceName) {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(provinceName)},TH&appid=${API_KEY}&units=metric&lang=th`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Province weather error: ${res.status}`);
    return res.json();
}

/**
 * Group 3-hour forecast data by day
 * @param {object} data - Raw forecast API response
 * @returns {Array} Daily grouped forecast
 */
function groupForecastByDay(data) {
    const days = {};

    data.list.forEach((item) => {
        const date = item.dt_txt.split(' ')[0];
        if (!days[date]) {
            days[date] = {
                date,
                temps: [],
                icons: [],
                descriptions: [],
                humidity: [],
                wind: [],
                items: [],
            };
        }
        days[date].temps.push(item.main.temp);
        days[date].icons.push(item.weather[0].icon);
        days[date].descriptions.push(item.weather[0].description);
        days[date].humidity.push(item.main.humidity);
        days[date].wind.push(item.wind.speed);
        days[date].items.push(item);
    });

    return Object.values(days).map((day) => {
        // Pick the most common icon for the day
        const iconCounts = {};
        day.icons.forEach((icon) => {
            const dayIcon = icon.replace('n', 'd');
            iconCounts[dayIcon] = (iconCounts[dayIcon] || 0) + 1;
        });
        const mainIcon = Object.entries(iconCounts).sort((a, b) => b[1] - a[1])[0][0];

        // Pick the most common description
        const descCounts = {};
        day.descriptions.forEach((desc) => {
            descCounts[desc] = (descCounts[desc] || 0) + 1;
        });
        const mainDesc = Object.entries(descCounts).sort((a, b) => b[1] - a[1])[0][0];

        return {
            date: day.date,
            temp_max: Math.round(Math.max(...day.temps)),
            temp_min: Math.round(Math.min(...day.temps)),
            icon: mainIcon,
            description: mainDesc,
            humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
            wind: (day.wind.reduce((a, b) => a + b, 0) / day.wind.length).toFixed(1),
            items: day.items,
        };
    });
}

/**
 * Get weather icon URL from OpenWeather
 * @param {string} iconCode - Icon code from API
 * @returns {string} Icon URL
 */
export function getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

const API_KEY_AQ = import.meta.env.VITE_AIR_QUALITY_API_KEY;

/**
 * Fetch air quality (AQI) for given coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<object>} Air quality data
 */
export async function fetchAirQuality(lat, lon) {
    const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${API_KEY_AQ}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Air Quality API error: ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error(`Air Quality API error: ${data.data}`);
    return data.data;
}



/**
 * Format weather data as text for AI context
 * @param {object} current - Current weather data
 * @param {Array} forecast - Forecast data
 * @param {object} aqi - Air quality data (optional)
 * @returns {string} Formatted weather context
 */
export function formatWeatherForAI(current, forecast, aqi) {
    let text = `สภาพอากาศปัจจุบัน (${current.name}):\n`;
    text += `- อุณหภูมิ: ${Math.round(current.main.temp)}°C (รู้สึกเหมือน ${Math.round(current.main.feels_like)}°C)\n`;
    text += `- สภาพ: ${current.weather[0].description}\n`;
    text += `- ความชื้น: ${current.main.humidity}%\n`;
    text += `- ลม: ${current.wind.speed} m/s\n`;
    text += `- ความกดอากาศ: ${current.main.pressure} hPa\n`;
    text += `- ทัศนวิสัย: ${current.visibility / 1000} km\n`;

    if (aqi) {
        text += `- คุณภาพอากาศ (AQI): ${aqi.aqi} (PM2.5: ${aqi.iaqi.pm25?.v || '-'}) ซึ่งอยู่ในระดับ ${getAQIDescription(aqi.aqi)}\n`;
    }
    text += `\n`;

    text += `พยากรณ์อากาศ:\n`;
    forecast.forEach((day) => {
        const d = new Date(day.date);
        const dayName = d.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'short' });
        text += `- ${dayName}: ${day.description}, สูงสุด ${day.temp_max}°C, ต่ำสุด ${day.temp_min}°C, ความชื้น ${day.humidity}%, ลม ${day.wind} m/s\n`;
    });

    return text;
}

function getAQIDescription(aqi) {
    if (aqi <= 50) return 'ดี';
    if (aqi <= 100) return 'ปานกลาง';
    if (aqi <= 150) return 'มีผลกระทบต่อสุขภาพ';
    if (aqi <= 200) return 'มีผลกระทบต่อสุขภาพมาก';
    if (aqi <= 300) return 'อันตราย';
    return 'อันตรายมาก';
}
