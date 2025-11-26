document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    initCharts();
});

async function loadDashboardData() {
    try {
        // TODO: Replace with actual API call
        // const data = await apiCall(API_ENDPOINTS.DASHBOARD_DATA);
        
        // Simulated data
        document.getElementById('totalProducts').textContent = '150';
        document.getElementById('inventoryValue').textContent = '$25,430';
        document.getElementById('lowStock').textContent = '12';
        document.getElementById('todayMovements').textContent = '28';
        
        loadRecentActivity();
        loadLowStockTable();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function initCharts() {
    // Inventory Chart
    const inventoryCtx = document.getElementById('inventoryChart').getContext('2d');
    new Chart(inventoryCtx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Entradas',
                data: [12, 19, 15, 17, 14, 20, 18],
                borderColor: 'rgb(25, 135, 84)',
                backgroundColor: 'rgba(25, 135, 84, 0.1)',
                tension: 0.4
            }, {
                label: 'Salidas',
                data: [8, 15, 12, 14, 11, 16, 14],
                borderColor: 'rgb(220, 53, 69)',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });

    // Categories Chart
    const categoriesCtx = document.getElementById('categoriesChart').getContext('2d');
    new Chart(categoriesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Abarrotes', 'Bebidas', 'Lácteos', 'Limpieza'],
            datasets: [{
                data: [40, 30, 20, 10],
                backgroundColor: [
                    'rgb(13, 110, 253)',
                    'rgb(25, 135, 84)',
                    'rgb(255, 193, 7)',
                    'rgb(220, 53, 69)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function loadRecentActivity() {
    const activity = [
        { text: 'Entrada de 50 unidades de Arroz 1kg', time: 'Hace 10 min' },
        { text: 'Salida de 30 unidades de Aceite', time: 'Hace 25 min' },
        { text: 'Nuevo producto agregado: Detergente', time: 'Hace 1 hora' }
    ];
    
    const container = document.getElementById('recentActivity');
    container.innerHTML = activity.map(item => `
        <div class="list-group-item">
            <small>${item.text}</small>
            <br>
            <small class="text-muted">${item.time}</small>
        </div>
    `).join('');
}

function loadLowStockTable() {
    const lowStockProducts = [
        { name: 'Arroz 1kg', stock: 5 },
        { name: 'Aceite 1L', stock: 8 },
        { name: 'Azúcar 1kg', stock: 3 }
    ];
    
    const tbody = document.querySelector('#lowStockTable tbody');
    tbody.innerHTML = lowStockProducts.map(product => `
        <tr>
            <td>${product.name}</td>
            <td><span class="badge bg-warning">${product.stock}</span></td>
            <td>
                <button class="btn btn-sm btn-primary">
                    <i class="fas fa-plus"></i>
                </button>
            </td>
        </tr>
    `).join('');
}
