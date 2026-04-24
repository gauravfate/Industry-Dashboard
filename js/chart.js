// Chart.js configuration and management

let pollutionChart;

// Initialize chart
function initChart() {
    const ctx = document.getElementById('pollutionChart').getContext('2d');
    
    pollutionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 20}, (_, i) => `${i+1}h ago`),
            datasets: [
                {
                    label: 'CO₂ Level (ppm)',
                    data: Array(20).fill(0),
                    borderColor: '#22C55E',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'PM2.5 Level (µg/m³)',
                    data: Array(20).fill(0),
                    borderColor: '#F59E0B',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#FFFFFF'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    grid: {
                        color: '#334155'
                    },
                    ticks: {
                        color: '#94A3B8'
                    }
                },
                x: {
                    grid: {
                        color: '#334155'
                    },
                    ticks: {
                        color: '#94A3B8',
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

// Update chart with new data
function updateChart(co2Data, pm25Data) {
    if (!pollutionChart) {
        initChart();
    }
    
    const labels = Array.from({length: co2Data.length}, (_, i) => {
        const hoursAgo = co2Data.length - i;
        return `${hoursAgo}h ago`;
    });
    
    pollutionChart.data.labels = labels;
    pollutionChart.data.datasets[0].data = co2Data;
    pollutionChart.data.datasets[1].data = pm25Data;
    pollutionChart.update();
}

// Export functions
window.initChart = initChart;
window.updateChart = updateChart;

// Initialize chart when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('pollutionChart')) {
        initChart();
    }
});