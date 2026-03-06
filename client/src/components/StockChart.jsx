import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function StockChart({ historicalData, symbol }) {
    if (!historicalData || historicalData.length === 0) {
        return <div className="empty-state"><p>No historical data available</p></div>;
    }

    const labels = historicalData.map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    });

    const prices = historicalData.map(d => d.close);
    const isUp = prices[prices.length - 1] >= prices[0];

    const data = {
        labels,
        datasets: [
            {
                label: `${symbol} Price`,
                data: prices,
                borderColor: isUp ? '#10b981' : '#ef4444',
                backgroundColor: isUp
                    ? 'rgba(16, 185, 129, 0.08)'
                    : 'rgba(239, 68, 68, 0.08)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: isUp ? '#10b981' : '#ef4444',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#f1f5f9',
                bodyColor: '#94a3b8',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: (ctx) => `₹${ctx.parsed.y.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { size: 11 }, maxTicksLimit: 8 },
                border: { display: false }
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.03)' },
                ticks: {
                    color: '#64748b',
                    font: { size: 11 },
                    callback: (value) => `₹${value.toLocaleString('en-IN')}`
                },
                border: { display: false }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    return (
        <div style={{ height: '350px' }}>
            <Line data={data} options={options} />
        </div>
    );
}
