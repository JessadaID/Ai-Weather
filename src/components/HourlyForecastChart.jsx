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
import { fetchRawForecast } from '../services/weatherService';
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

export default function HourlyForecastChart({ lat, lon }) {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!lat || !lon) return;

        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const rawList = await fetchRawForecast(lat, lon);
                // Round now to the start of the current hour
                const currentTime = Math.floor(Date.now() / 1000);
                const currentHourDate = new Date(currentTime * 1000);
                currentHourDate.setMinutes(0, 0, 0);
                const startOfHour = Math.floor(currentHourDate.getTime() / 1000);

                // Helper for linear interpolation
                const interpolate = (start, end, progress) => {
                    return start + (end - start) * progress;
                };

                // Generate hourly points for next 8 hours
                const hourlyData = [];
                // Sort raw data by time
                const sortedList = rawList.sort((a, b) => a.dt - b.dt);

                for (let i = 0; i <= 8; i++) {
                    const targetTime = startOfHour + i * 3600;

                    // Find surrounding data points
                    let prev = sortedList.filter((item) => item.dt <= targetTime).pop();
                    let next = sortedList.find((item) => item.dt > targetTime);

                    // fallback if out of range
                    if (!prev && next) prev = next;
                    if (!next && prev) next = prev;

                    if (prev && next) {
                        let temp;

                        if (prev.dt === next.dt) {
                            temp = prev.main.temp;
                        } else {
                            const progress = (targetTime - prev.dt) / (next.dt - prev.dt);
                            temp = interpolate(prev.main.temp, next.main.temp, progress);
                        }

                        hourlyData.push({
                            dt: targetTime,
                            temp: temp
                        });
                    }
                }

                // Prepare chart data
                const labels = hourlyData.map((item) => {
                    const date = new Date(item.dt * 1000);
                    return date.getHours().toString().padStart(2, '0') + '.00';
                });

                const tempData = hourlyData.map((item) => item.temp.toFixed(1));

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'อุณหภูมิ (°C)',
                            data: tempData,
                            fill: true,
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            tension: 0.4,
                            pointRadius: 4,
                            yAxisID: 'y',
                        },
                    ],
                });
            } catch (err) {
                console.error('Failed to load forecast data:', err);
                setError('ไม่สามารถโหลดข้อมูลพยากรณ์ได้');
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
                text: 'แนวโน้มสภาพอากาศ 8 ชม. ข้างหน้า',
                color: '#334155',
                font: { size: 14, family: "'Inter', sans-serif", weight: 'normal' }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y + '°C';
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: { color: '#f1f5f9' },
                ticks: { color: '#64748b' },
                title: { display: true, text: 'อุณหภูมิ (°C)', color: '#94a3b8' }
            },

            x: {
                grid: { display: false },
                ticks: { color: '#64748b' }
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
