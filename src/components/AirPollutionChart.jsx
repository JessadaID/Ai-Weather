import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchAirPollutionForecast } from '../services/weatherService';
import { Loader2, AlertTriangle } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function AirPollutionChart({ lat, lon }) {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!lat || !lon) return;

        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const now = Math.floor(Date.now() / 1000);

                // Fetch forecast only
                const forecastRes = await fetchAirPollutionForecast(lat, lon);

                // Process data
                let forecastList = forecastRes.list || [];

                // Filter for next 16 hours
                const sixteenHoursAhead = now + 16 * 3600;

                const filteredData = forecastList.filter(
                    (item) => item.dt >= now && item.dt <= sixteenHoursAhead
                );

                // Sort by time
                filteredData.sort((a, b) => a.dt - b.dt);

                // Prepare chart data
                const labels = filteredData.map((item) => {
                    const date = new Date(item.dt * 1000);
                    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
                });

                // Helper to calculate US EPA AQI from PM2.5
                const calculateAQI = (pm25) => {
                    const c = pm25;
                    const calc = (ih, il, bph, bpl, c) => {
                        return Math.round(((ih - il) / (bph - bpl)) * (c - bpl) + il);
                    };
                    if (c <= 12.0) return calc(50, 0, 12.0, 0, c);
                    if (c <= 35.4) return calc(100, 51, 35.4, 12.1, c);
                    if (c <= 55.4) return calc(150, 101, 55.4, 35.5, c);
                    if (c <= 150.4) return calc(200, 151, 150.4, 55.5, c);
                    if (c <= 250.4) return calc(300, 201, 250.4, 150.5, c);
                    if (c <= 350.4) return calc(400, 301, 350.4, 250.5, c);
                    if (c <= 500.4) return calc(500, 401, 500.4, 350.5, c);
                    return 500;
                };

                const pm25Data = filteredData.map((item) => item.components.pm2_5);
                const aqiData = filteredData.map((item) => calculateAQI(item.components.pm2_5));


                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'PM2.5 (µg/m³)',
                            data: pm25Data,
                            fill: true,
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            tension: 0.4,
                            pointRadius: 3,
                            yAxisID: 'y',
                        },
                        {
                            label: 'AQI',
                            data: aqiData,
                            fill: false,
                            borderColor: 'rgb(53, 162, 235)',
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                            tension: 0.4,
                            pointRadius: 3,
                            yAxisID: 'y1',
                            borderDash: [5, 5],
                        },
                    ],
                });
            } catch (err) {
                console.error('Failed to load air pollution data:', err);
                setError('ไม่สามารถโหลดข้อมูลกราฟค่าฝุ่นได้');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [lat, lon]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 text-text-secondary">
                <Loader2 className="animate-spin mr-2" size={20} />
                กำลังโหลดข้อมูลกราฟ...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8 text-text-secondary gap-2">
                <AlertTriangle size={20} />
                {error}
            </div>
        );
    }

    if (!chartData) return null;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#64748b',
                    font: { family: "'Inter', sans-serif" }
                }
            },
            title: {
                display: true,
                text: 'พยากรณ์ค่าฝุ่น PM2.5 และ AQI ล่วงหน้า 16 ชม.',
                color: '#334155',
                font: { size: 14, family: "'Inter', sans-serif", weight: 'normal' }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: { color: '#f1f5f9' },
                ticks: { color: '#64748b' },
                title: { display: true, text: 'PM2.5 (µg/m³)', color: '#94a3b8' }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { display: false },
                ticks: { color: '#64748b' },
                title: { display: true, text: 'AQI', color: '#94a3b8' }
            },
            x: {
                grid: { display: false },
                ticks: { maxTicksLimit: 8, color: '#64748b' }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    return (
        <div className="w-full bg-surface border border-border-default rounded-[var(--radius-md)] p-4 mb-6 shadow-sm">
            <div className="h-[300px] w-full">
                <Line options={options} data={chartData} />
            </div>
        </div>
    );
}
