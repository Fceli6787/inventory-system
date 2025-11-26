document.addEventListener('DOMContentLoaded', function() {
    loadReportsData();
    initCharts();
    initCustomReportForm();
});

// Initialize custom report form
function initCustomReportForm() {
    const form = document.getElementById('customReportForm');
    
    // Set default dates
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    document.getElementById('startDate').valueAsDate = firstDay;
    document.getElementById('endDate').valueAsDate = today;

    form.addEventListener('submit', handleCustomReport);
}

// Load reports data
async function loadReportsData() {
    try {
        // Simulated data
        const topProducts = [
            { name: 'Arroz Diana 1kg', quantity: 150 },
            { name: 'Aceite Gourmet 1L', quantity: 120 },
            { name: 'Leche Alquería 1L', quantity: 95 },
            { name: 'Azúcar 1kg', quantity: 80 },
            { name: 'Gaseosa Coca-Cola 2L', quantity: 75 }
        ];

        displayTopProducts(topProducts);
    } catch (error) {
        console.error('Error loading reports:', error);
        showToast('Error al cargar reportes', 'error');
    }
}

// Display top products
function displayTopProducts(products) {
    const list = document.getElementById('topProductsList');
    
    list.innerHTML = products.map((product, index) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <span class="badge bg-primary rounded-pill me-2">${index + 1}</span>
                <strong>${product.name}</strong>
            </div>
            <span class="badge bg-success">${product.quantity}</span>
        </li>
    `).join('');
}

// Initialize charts
function initCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    new Chart(salesCtx, {
        type: 'bar',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Ventas ($)',
                data: [12000, 15000, 13500, 18000, 16500, 19000, 21000, 20500, 22000, 24000, 23500, 25000],
                backgroundColor: 'rgba(13, 110, 253, 0.8)',
                borderColor: 'rgb(13, 110, 253)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return '$' + context.parsed.y.toLocaleString('es-CO');
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString('es-CO');
                        }
                    }
                }
            }
        }
    });

    // Categories Donut Chart
    const categoriesCtx = document.getElementById('categoriesDonutChart').getContext('2d');
    new Chart(categoriesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Abarrotes', 'Bebidas', 'Lácteos', 'Limpieza'],
            datasets: [{
                data: [35, 25, 25, 15],
                backgroundColor: [
                    'rgb(13, 110, 253)',
                    'rgb(25, 135, 84)',
                    'rgb(255, 193, 7)',
                    'rgb(220, 53, 69)'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
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

// Handle custom report generation
async function handleCustomReport(e) {
    e.preventDefault();

    const reportData = {
        type: document.getElementById('reportType').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        format: document.getElementById('reportFormat').value
    };

    try {
        console.log('Generating custom report:', reportData);
        showToast('Generando reporte...', 'info');

        // Simulate report generation delay
        setTimeout(() => {
            showToast('Reporte generado exitosamente', 'success');
            // In production, this would download the file
            console.log('Report would be downloaded here');
        }, 2000);
    } catch (error) {
        console.error('Error generating report:', error);
        showToast('Error al generar reporte', 'error');
    }
}

// Generate specific report
function generateReport(type) {
    console.log('Generating report type:', type);
    showToast(`Generando reporte de ${type}...`, 'info');

    // Simulate report generation
    setTimeout(() => {
        showToast('Reporte generado exitosamente', 'success');
        // In production, this would trigger actual file download
    }, 1500);
}
