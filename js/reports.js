// Reports page logic

let reportChart;
let reportInterval;

// Calculate average CO2 from history
function calculateAverageCO2() {
    if (co2History.length === 0) return 425;
    const sum = co2History.reduce((a, b) => a + b, 0);
    return Math.round(sum / co2History.length);
}

// Calculate max PM2.5 from history
function calculateMaxPM25() {
    if (pm25History.length === 0) return 85;
    return Math.max(...pm25History);
}

// Update summary cards
function updateSummary() {
    const avgCo2 = calculateAverageCO2();
    const maxPm25 = calculateMaxPM25();
    
    document.getElementById('avgCo2').textContent = `${avgCo2} ppm`;
    document.getElementById('maxPm25').textContent = `${maxPm25} µg/m³`;
    
    // Update system status
    const criticalAlerts = alerts.filter(a => a.type === 'critical').length;
    const status = criticalAlerts > 0 ? 'Critical' : 
                   alerts.filter(a => a.type === 'warning').length > 0 ? 'Warning' : 'Normal';
    document.getElementById('sysStatusReport').textContent = status;
    
    // Update zone stats
    document.getElementById('zoneACo2').textContent = `${zones.zoneA.co2} ppm`;
    document.getElementById('factoryCo2').textContent = `${zones.factory.co2} ppm`;
    document.getElementById('outdoorCo2').textContent = `${zones.outdoor.co2} ppm`;
    document.getElementById('alertCount').textContent = alerts.length;
}

// Initialize report chart
function initReportChart() {
    const ctx = document.getElementById('reportChart').getContext('2d');
    
    reportChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Zone A', 'Factory', 'Outdoor'],
            datasets: [
                {
                    label: 'CO₂ Level (ppm)',
                    data: [zones.zoneA.co2, zones.factory.co2, zones.outdoor.co2],
                    backgroundColor: '#6366F1',
                    borderRadius: 8
                },
                {
                    label: 'PM2.5 Level (µg/m³)',
                    data: [zones.zoneA.pm25, zones.factory.pm25, zones.outdoor.pm25],
                    backgroundColor: '#F59E0B',
                    borderRadius: 8
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
                        color: '#94A3B8'
                    }
                }
            }
        }
    });
}

// Update report chart
function updateReportChart() {
    if (!reportChart) {
        initReportChart();
        return;
    }
    
    reportChart.data.datasets[0].data = [zones.zoneA.co2, zones.factory.co2, zones.outdoor.co2];
    reportChart.data.datasets[1].data = [zones.zoneA.pm25, zones.factory.pm25, zones.outdoor.pm25];
    reportChart.update();
}

// Initialize reports page
function initReports() {
    loadAlertsFromStorage();
    updateSummary();
    initReportChart();
    
    // Update system status
    const criticalAlerts = alerts.filter(a => a.type === 'critical').length;
    const warningAlerts = alerts.filter(a => a.type === 'warning').length;
    const statusDiv = document.getElementById('systemStatus');
    
    if (statusDiv) {
        const statusDot = statusDiv.querySelector('.status-dot');
        const statusText = statusDiv.querySelector('span:last-child');
        
        if (criticalAlerts > 0) {
            statusDot.className = 'status-dot critical';
            statusText.textContent = 'System Critical';
        } else if (warningAlerts > 0) {
            statusDot.className = 'status-dot warning';
            statusText.textContent = 'System Warning';
        } else {
            statusDot.className = 'status-dot normal';
            statusText.textContent = 'System Normal';
        }
    }
    
    // Start periodic updates
    if (reportInterval) clearInterval(reportInterval);
    reportInterval = setInterval(() => {
        updateZoneData();
        updateSummary();
        updateReportChart();
    }, 5000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initReports();
});