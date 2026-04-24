// Sensors page logic

let sensorsInterval;

// Update sensors display
function updateSensors() {
    const data = getCurrentZoneData();
    const now = new Date().toLocaleTimeString();
    
    // Update values
    document.getElementById('sensorCo2').innerHTML = `${data.co2} <span>ppm</span>`;
    document.getElementById('sensorPm25').innerHTML = `${data.pm25} <span>µg/m³</span>`;
    document.getElementById('sensorNox').innerHTML = `${data.nox} <span>ppb</span>`;
    document.getElementById('sensorTemp').innerHTML = `${data.temperature} <span>°C</span>`;
    
    // Update timestamps
    document.getElementById('sensorCo2Time').textContent = `Last updated: ${now}`;
    document.getElementById('sensorPm25Time').textContent = `Last updated: ${now}`;
    document.getElementById('sensorNoxTime').textContent = `Last updated: ${now}`;
    document.getElementById('sensorTempTime').textContent = `Last updated: ${now}`;
    
    // Update status colors
    updateSensorStatus();
}

// Update sensor status indicators
function updateSensorStatus() {
    const data = getCurrentZoneData();
    const co2Status = getStatus(data.co2, 'co2');
    const pm25Status = getStatus(data.pm25, 'pm25');
    const noxStatus = getStatus(data.nox, 'nox');
    const tempStatus = getStatus(data.temperature, 'temp');
    
    // You can add color highlighting to sensor values if desired
    const sensorValues = document.querySelectorAll('.sensor-value');
    if (sensorValues[0]) sensorValues[0].style.color = co2Status.color;
    if (sensorValues[1]) sensorValues[1].style.color = pm25Status.color;
    if (sensorValues[2]) sensorValues[2].style.color = noxStatus.color;
    if (sensorValues[3]) sensorValues[3].style.color = tempStatus.color;
}

// Initialize sensors page
function initSensors() {
    loadAlertsFromStorage();
    updateSensors();
    
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
    if (sensorsInterval) clearInterval(sensorsInterval);
    sensorsInterval = setInterval(() => {
        updateZoneData();
        updateSensors();
    }, 5000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initSensors();
});