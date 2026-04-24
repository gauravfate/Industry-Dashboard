// Data simulation module
const zones = {
    zoneA: {
        co2: 420,
        pm25: 80,
        nox: 25,
        temperature: 32
    },
    factory: {
        co2: 480,
        pm25: 110,
        nox: 45,
        temperature: 38
    },
    outdoor: {
        co2: 370,
        pm25: 60,
        nox: 18,
        temperature: 28
    }
};

let currentZone = 'zoneA';
let alerts = [];
let co2History = [];
let pm25History = [];

// Generate random value between min and max
function randomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Update zone data with random values
function updateZoneData() {
    zones.zoneA = {
        co2: randomValue(350, 500),
        pm25: randomValue(40, 120),
        nox: randomValue(10, 50),
        temperature: randomValue(25, 40)
    };
    
    zones.factory = {
        co2: randomValue(400, 550),
        pm25: randomValue(80, 150),
        nox: randomValue(30, 70),
        temperature: randomValue(30, 45)
    };
    
    zones.outdoor = {
        co2: randomValue(350, 420),
        pm25: randomValue(30, 90),
        nox: randomValue(10, 30),
        temperature: randomValue(20, 35)
    };
}

// Get current zone data
function getCurrentZoneData() {
    return zones[currentZone];
}

// Generate alert based on pollution levels
function generateAlert(data, zone) {
    const timestamp = new Date().toLocaleTimeString();
    let alert = null;
    
    if (data.co2 > 450) {
        alert = {
            type: 'warning',
            message: `High CO₂ level (${data.co2} ppm) in ${zone}`,
            timestamp: timestamp,
            zone: zone
        };
    } else if (data.pm25 > 100) {
        alert = {
            type: 'critical',
            message: `Critical PM2.5 level (${data.pm25} µg/m³) in ${zone}`,
            timestamp: timestamp,
            zone: zone
        };
    } else {
        alert = {
            type: 'normal',
            message: `System running normal - ${zone}`,
            timestamp: timestamp,
            zone: zone
        };
    }
    
    return alert;
}

// Add alert to history (keep last 50)
function addAlert(alert) {
    alerts.unshift(alert);
    if (alerts.length > 50) {
        alerts.pop();
    }
    saveAlertsToStorage();
}

// Save alerts to localStorage
function saveAlertsToStorage() {
    localStorage.setItem('pollutionAlerts', JSON.stringify(alerts));
}

// Load alerts from localStorage
function loadAlertsFromStorage() {
    const stored = localStorage.getItem('pollutionAlerts');
    if (stored) {
        alerts = JSON.parse(stored);
    } else {
        // Initialize with sample alerts
        alerts = [
            {
                type: 'normal',
                message: 'System running normal - Zone A',
                timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(),
                zone: 'Zone A'
            },
            {
                type: 'warning',
                message: 'PM2.5 level is moderate - Zone A',
                timestamp: new Date(Date.now() - 7200000).toLocaleTimeString(),
                zone: 'Zone A'
            }
        ];
    }
}

// Update data history for charts
function updateHistory(data) {
    co2History.push(data.co2);
    pm25History.push(data.pm25);
    
    // Keep last 20 data points
    if (co2History.length > 20) {
        co2History.shift();
    }
    if (pm25History.length > 20) {
        pm25History.shift();
    }
}

// Get status text and color based on value
function getStatus(value, type) {
    if (type === 'co2') {
        if (value < 400) return { text: 'Good', color: '#22C55E' };
        if (value < 450) return { text: 'Moderate', color: '#F59E0B' };
        return { text: 'High', color: '#EF4444' };
    } else if (type === 'pm25') {
        if (value < 70) return { text: 'Good', color: '#22C55E' };
        if (value < 100) return { text: 'Moderate', color: '#F59E0B' };
        return { text: 'Critical', color: '#EF4444' };
    } else if (type === 'nox') {
        if (value < 30) return { text: 'Good', color: '#22C55E' };
        if (value < 45) return { text: 'Moderate', color: '#F59E0B' };
        return { text: 'High', color: '#EF4444' };
    } else if (type === 'temp') {
        if (value < 28) return { text: 'Normal', color: '#22C55E' };
        if (value < 35) return { text: 'Warm', color: '#F59E0B' };
        return { text: 'High', color: '#EF4444' };
    }
    return { text: 'Normal', color: '#22C55E' };
}

// Export functions and variables
window.zones = zones;
window.currentZone = currentZone;
window.alerts = alerts;
window.co2History = co2History;
window.pm25History = pm25History;
window.randomValue = randomValue;
window.updateZoneData = updateZoneData;
window.getCurrentZoneData = getCurrentZoneData;
window.generateAlert = generateAlert;
window.addAlert = addAlert;
window.saveAlertsToStorage = saveAlertsToStorage;
window.loadAlertsFromStorage = loadAlertsFromStorage;
window.updateHistory = updateHistory;
window.getStatus = getStatus;