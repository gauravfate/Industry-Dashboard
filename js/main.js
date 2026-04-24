// Main dashboard logic

let updateInterval;

// Initialize dashboard
function initDashboard() {
    loadAlertsFromStorage();
    updateDisplay();
    startUpdates();
    setupEventListeners();
}

// Update all displays
function updateDisplay() {
    const data = getCurrentZoneData();
    
    // Update cards
    document.getElementById('co2Value').textContent = data.co2;
    document.getElementById('pm25Value').textContent = data.pm25;
    document.getElementById('noxValue').textContent = data.nox;
    document.getElementById('tempValue').textContent = data.temperature;
    
    // Update statuses
    const co2Status = getStatus(data.co2, 'co2');
    const pm25Status = getStatus(data.pm25, 'pm25');
    const noxStatus = getStatus(data.nox, 'nox');
    const tempStatus = getStatus(data.temperature, 'temp');
    
    updateStatusDisplay('co2Status', co2Status);
    updateStatusDisplay('pm25Status', pm25Status);
    updateStatusDisplay('noxStatus', noxStatus);
    updateStatusDisplay('tempStatus', tempStatus);
    
    // Update system status based on alerts
    updateSystemStatus();
    
    // Update history and chart
    updateHistory(data);
    if (window.updateChart) {
        window.updateChart(co2History, pm25History);
    }
    
    // Generate and add alert
    const zoneName = currentZone === 'zoneA' ? 'Zone A' : 
                     currentZone === 'factory' ? 'Factory' : 'Outdoor';
    const alert = generateAlert(data, zoneName);
    addAlert(alert);
    
    // Update alerts preview
    updateAlertsPreview();
}

// Update status display with color
function updateStatusDisplay(elementId, status) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = status.text;
        element.style.backgroundColor = status.color;
        element.setAttribute('data-status', status.text.toLowerCase());
    }
}

// Update system status in header
function updateSystemStatus() {
    const criticalAlerts = alerts.filter(a => a.type === 'critical').length;
    const warningAlerts = alerts.filter(a => a.type === 'warning').length;
    
    const statusDiv = document.getElementById('systemStatus');
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

// Update alerts preview on dashboard
function updateAlertsPreview() {
    const previewContainer = document.getElementById('alertsPreview');
    if (!previewContainer) return;
    
    const latestAlerts = alerts.slice(0, 3);
    previewContainer.innerHTML = latestAlerts.map(alert => `
        <div class="alert-item ${alert.type}">
            <span>${alert.type === 'critical' ? '⚠️' : alert.type === 'warning' ? '⚠️' : '✅'}</span>
            <div>
                <p>${alert.message}</p>
                <small>${alert.timestamp}</small>
            </div>
        </div>
    `).join('');
}

// Handle zone switching
function setupEventListeners() {
    const zoneBtns = document.querySelectorAll('.zone-btn');
    zoneBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            zoneBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update current zone
            currentZone = btn.getAttribute('data-zone');
            updateDisplay();
        });
    });
    
    // Control toggles
    const filterToggle = document.getElementById('filterToggle');
    const fanToggle = document.getElementById('fanToggle');
    const filterStatus = document.getElementById('filterStatus');
    const fanStatus = document.getElementById('fanStatus');
    
    if (filterToggle) {
        filterToggle.addEventListener('change', (e) => {
            const status = e.target.checked ? 'ON' : 'OFF';
            filterStatus.textContent = status;
            filterStatus.setAttribute('data-status', status.toLowerCase());
        });
    }
    
    if (fanToggle) {
        fanToggle.addEventListener('change', (e) => {
            const status = e.target.checked ? 'ON' : 'OFF';
            fanStatus.textContent = status;
            fanStatus.setAttribute('data-status', status.toLowerCase());
        });
    }
}

// Start periodic updates
function startUpdates() {
    if (updateInterval) clearInterval(updateInterval);
    updateInterval = setInterval(() => {
        updateZoneData();
        updateDisplay();
    }, 5000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});