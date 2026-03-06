import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
    '#6366f1', '#22d3ee', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4'
];

export default function PortfolioChart({ holdings }) {
    if (!holdings || holdings.length === 0) return null;

    const data = {
        labels: holdings.map(h => h.symbol),
        datasets: [
            {
                data: holdings.map(h => h.marketValue),
                backgroundColor: COLORS.slice(0, holdings.length),
                borderColor: 'rgba(10, 14, 23, 0.8)',
                borderWidth: 3,
                hoverOffset: 8
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#94a3b8',
                    padding: 16,
                    usePointStyle: true,
                    pointStyleWidth: 10,
                    font: { size: 12 }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#f1f5f9',
                bodyColor: '#94a3b8',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
                callbacks: {
                    label: (ctx) => `₹${ctx.parsed.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                }
            }
        },
        cutout: '65%'
    };

    return (
        <div style={{ height: '300px' }}>
            <Doughnut data={data} options={options} />
        </div>
    );
}
