// =====================================================
// InventoryPro - Dashboard Script
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    // Solo ejecutar si estamos en la página de dashboard
    if (document.getElementById('inventoryChart') && document.getElementById('categoriesChart')) {
        loadDashboardData();
        initCharts();
    }
});

async function loadDashboardData() {
    try {
        // TODO: Replace with actual API call
        // const data = await apiCall(API_ENDPOINTS.DASHBOARD_DATA);
        
        // Simulated data - Verificar que los elementos existen
        const totalProducts = document.getElementById('totalProducts');
        const inventoryValue = document.getElementById('inventoryValue');
        const lowStock = document.getElementById('lowStock');
        const todayMovements = document.getElementById('todayMovements');

        if (totalProducts) totalProducts.textContent = '150';
        if (inventoryValue) inventoryValue.textContent = '$25,430';
        if (lowStock) lowStock.textContent = '12';
        if (todayMovements) todayMovements.textContent = '28';
        
        loadRecentActivity();
        loadLowStockTable();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function initCharts() {
    // Inventory Chart
    const inventoryCanvas = document.getElementById('inventoryChart');
    if (inventoryCanvas) {
        const inventoryCtx = inventoryCanvas.getContext('2d');
        new Chart(inventoryCtx, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Entradas',
                    data: [12, 19, 15, 17, 14, 20, 18],
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Salidas',
                    data: [8, 15, 12, 14, 11, 16, 14],
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        borderRadius: 8,
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 13
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    }
                }
            }
        });
    }

    // Categories Chart
    const categoriesCanvas = document.getElementById('categoriesChart');
    if (categoriesCanvas) {
        const categoriesCtx = categoriesCanvas.getContext('2d');
        new Chart(categoriesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Abarrotes', 'Bebidas', 'Lácteos', 'Limpieza'],
                datasets: [{
                    data: [40, 30, 20, 10],
                    backgroundColor: [
                        'rgb(99, 102, 241)',
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                        'rgb(239, 68, 68)'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff',
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 11,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        borderRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

function loadRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;

    const activity = [
        { 
            text: 'Entrada de 50 unidades de Arroz 1kg', 
            time: 'Hace 10 min',
            icon: 'fa-arrow-down',
            iconColor: 'text-success'
        },
        { 
            text: 'Salida de 30 unidades de Aceite', 
            time: 'Hace 25 min',
            icon: 'fa-arrow-up',
            iconColor: 'text-danger'
        },
        { 
            text: 'Nuevo producto agregado: Detergente', 
            time: 'Hace 1 hora',
            icon: 'fa-plus-circle',
            iconColor: 'text-primary'
        },
        { 
            text: 'Usuario "María" inició sesión', 
            time: 'Hace 2 horas',
            icon: 'fa-user',
            iconColor: 'text-info'
        }
    ];
    
    container.innerHTML = activity.map(item => `
        <div class="list-group-item border-0 px-0 py-3">
            <div class="d-flex align-items-start">
                <div class="me-3">
                    <i class="fas ${item.icon} ${item.iconColor}"></i>
                </div>
                <div class="flex-grow-1">
                    <p class="mb-1" style="font-size: 0.875rem;">${item.text}</p>
                    <small class="text-muted">${item.time}</small>
                </div>
            </div>
        </div>
    `).join('');
}

function loadLowStockTable() {
    const tbody = document.querySelector('#lowStockTable tbody');
    if (!tbody) return;

    const lowStockProducts = [
        { name: 'Arroz 1kg', stock: 5, minStock: 20 },
        { name: 'Aceite 1L', stock: 8, minStock: 15 },
        { name: 'Azúcar 1kg', stock: 3, minStock: 25 }
    ];
    
    tbody.innerHTML = lowStockProducts.map(product => `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <i class="fas fa-box text-warning me-2"></i>
                    <strong>${product.name}</strong>
                </div>
            </td>
            <td>
                <span class="badge bg-warning text-dark">
                    ${product.stock} / ${product.minStock}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="addStock('${product.name}')" title="Agregar stock">
                    <i class="fas fa-plus"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Function to handle add stock action
function addStock(productName) {
    // TODO: Implement add stock functionality
    alert(`Agregar stock para: ${productName}`);
    console.log('Adding stock for:', productName);
}

// Update stats with animation
function updateStat(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const currentValue = parseInt(element.textContent.replace(/[^\d]/g, '')) || 0;
    const targetValue = parseInt(value);
    const duration = 1000; // 1 second
    const steps = 30;
    const increment = (targetValue - currentValue) / steps;
    let current = currentValue;
    let step = 0;

    const timer = setInterval(() => {
        step++;
        current += increment;
        
        if (step >= steps) {
            current = targetValue;
            clearInterval(timer);
        }
        
        // Format based on element
        if (elementId === 'inventoryValue') {
            element.textContent = '$' + Math.round(current).toLocaleString('es-CO');
        } else {
            element.textContent = Math.round(current);
        }
    }, duration / steps);
}
