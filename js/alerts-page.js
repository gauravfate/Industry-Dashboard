// Alerts page logic

let currentFilter = 'all';

// Display alerts based on filter
function displayAlerts() {
    const container = document.getElementById('alertsFullList');
    if (!container) return;
    
    let filteredAlerts = alerts;
    
    if (currentFilter !== 'all') {
        filteredAlerts = alerts.filter(alert => alert.type === currentFilter);
    }
    
    if (filteredAlerts.length === 0) {
        container.innerHTML = '<div class="card" style="text-align: center; padding: 3rem;">No alerts to display</div>';
        return;
    }
    
    container.innerHTML = filteredAlerts.map(alert => `
        <div class="alert-item ${alert.type}">
            <div class="alert-icon">
                ${alert.type === 'critical' ? '⚠️' : alert.type === 'warning' ? '⚠️' : '✅'}
            </div>
            <div class="alert-content">
                <p><strong>${alert.zone || 'System'}</strong> - ${alert.message}</p>
                <small>${alert.timestamp}</small>
            </div>
        </div>
    `).join('');
}

// Setup filter buttons
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            displayAlerts();
        });
    });
}

// Update system status in header
function updateSystemStatus() {
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
}

// Initialize alerts page
function initAlertsPage() {
    loadAlertsFromStorage();
    displayAlerts();
    setupFilters();
    updateSystemStatus();
    
    // Update alerts every 2 seconds
    setInterval(() => {
        loadAlertsFromStorage();
        displayAlerts();
        updateSystemStatus();
    }, 5000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initAlertsPage();
});