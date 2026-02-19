import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { AlertTriangle } from 'lucide-react';

// ChartJS is registered globally in main.jsx

/**
 * HourlyForecastChart - displays temperature trend for next 8 hours
 * Accepts rawForecast passed from App (no extra API call)
 * Uses linear interpolation between 3-hour API data points
 */
export default function HourlyForecastChart({ rawForecast }) {
    const chartData = useMemo(() => {
        if (!rawForecast || rawForecast.length === 0) return null;

        // Round now to the start of the current hour
        const currentHourDate = new Date();
        currentHourDate.setMinutes(0, 0, 0);
        const startOfHour = Math.floor(currentHourDate.getTime() / 1000);

        // Linear interpolation helper
        const interpolate = (start, end, progress) => start + (end - start) * progress;

        // Sort raw data by time
        const sortedList = [...rawForecast].sort((a, b) => a.dt - b.dt);

        // Generate hourly points for next 8 hours
        const hourlyData = [];
        for (let i = 0; i <= 8; i++) {
            const targetTime = startOfHour + i * 3600;

            // Find surrounding data points for interpolation
            let prev = sortedList.filter((item) => item.dt <= targetTime).pop();
            let next = sortedList.find((item) => item.dt > targetTime);

            // Fallback if out of range
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
                hourlyData.push({ dt: targetTime, temp });
            }
        }

        const labels = hourlyData.map((item) => {
            const date = new Date(item.dt * 1000);
            return date.getHours().toString().padStart(2, '0') + '.00';
        });

        const temps = hourlyData.map((item) => item.temp);
        const minTemp = Math.floor(Math.min(...temps)) - 10;
        const maxTemp = Math.ceil(Math.max(...temps)) + 10;

        return {
            labels,
            datasets: [
                {
                    label: 'อุณหภูมิ (°C)',
                    data: hourlyData.map((item) => item.temp.toFixed(1)),
                    fill: true,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.4,
                    pointRadius: 4,
                    yAxisID: 'y',
                },
            ],
            // Pass min/max through so options can use them
            _yMin: minTemp,
            _yMax: maxTemp,
        };
    }, [rawForecast]);

    if (!chartData) {
        return (
            <div className="flex items-center justify-center p-8 text-text-secondary gap-2">
                <AlertTriangle size={20} />
                ไม่มีข้อมูลกราฟ
            </div>
        );
    }

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
                        if (label) label += ': ';
                        if (context.parsed.y !== null) label += context.parsed.y + '°C';
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
                min: chartData._yMin,
                max: chartData._yMax,
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
