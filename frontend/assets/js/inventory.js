document.addEventListener('DOMContentLoaded', function() {
    loadInventoryData();
    loadProductsForSelect();
    initEventListeners();
});

let movementsData = [];
let currentStockData = [];

// Initialize event listeners
function initEventListeners() {
    const entryForm = document.getElementById('entryForm');
    const exitForm = document.getElementById('exitForm');

    entryForm.addEventListener('submit', handleEntry);
    exitForm.addEventListener('submit', handleExit);
}

// Load inventory movements
async function loadInventoryData() {
    try {
        // Simulated movements data
        movementsData = [
            {
                id: 1,
                date: '2025-11-26 14:30',
                type: 'entry',
                product: 'Arroz Diana 1kg',
                quantity: 50,
                user: 'Admin',
                reason: 'Compra'
            },
            {
                id: 2,
                date: '2025-11-26 13:15',
                type: 'exit',
                product: 'Aceite Gourmet 1L',
                quantity: 10,
                user: 'Empleado 1',
                reason: 'Venta'
            },
            {
                id: 3,
                date: '2025-11-26 11:00',
                type: 'entry',
                product: 'Leche Alquería 1L',
                quantity: 30,
                user: 'Admin',
                reason: 'Devolución'
            },
            {
                id: 4,
                date: '2025-11-25 16:45',
                type: 'exit',
                product: 'Gaseosa Coca-Cola 2L',
                quantity: 24,
                user: 'Empleado 2',
                reason: 'Venta'
            }
        ];

        // Simulated current stock data
        currentStockData = [
            {
                id: 1,
                product: 'Arroz Diana 1kg',
                category: 'Abarrotes',
                stock: 45,
                minStock: 10,
                price: 3500
            },
            {
                id: 2,
                product: 'Aceite Gourmet 1L',
                category: 'Abarrotes',
                stock: 8,
                minStock: 15,
                price: 8900
            },
            {
                id: 3,
                product: 'Leche Alquería 1L',
                category: 'Lácteos',
                stock: 60,
                minStock: 20,
                price: 4200
            },
            {
                id: 4,
                product: 'Gaseosa Coca-Cola 2L',
                category: 'Bebidas',
                stock: 0,
                minStock: 25,
                price: 5500
            },
            {
                id: 5,
                product: 'Detergente Ariel 1kg',
                category: 'Limpieza',
                stock: 30,
                minStock: 10,
                price: 12000
            }
        ];

        displayMovements(movementsData);
        displayCurrentStock(currentStockData);
    } catch (error) {
        console.error('Error loading inventory:', error);
        showToast('Error al cargar inventario', 'error');
    }
}

// Display movements
function displayMovements(movements) {
    const tbody = document.getElementById('movementsTableBody');
    
    if (movements.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    <i class="fas fa-inbox fa-3x mb-3"></i>
                    <p>No hay movimientos registrados</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = movements.map(movement => {
        const typeIcon = movement.type === 'entry' 
            ? '<i class="fas fa-arrow-down text-success"></i>' 
            : '<i class="fas fa-arrow-up text-danger"></i>';
        
        const typeBadge = movement.type === 'entry'
            ? '<span class="badge bg-success">Entrada</span>'
            : '<span class="badge bg-danger">Salida</span>';

        return `
            <tr>
                <td>${movement.date}</td>
                <td>${typeIcon} ${typeBadge}</td>
                <td>${movement.product}</td>
                <td><strong>${movement.quantity}</strong></td>
                <td>${movement.user}</td>
                <td>${movement.reason}</td>
            </tr>
        `;
    }).join('');
}

// Display current stock
function displayCurrentStock(stock) {
    const tbody = document.getElementById('currentStockTableBody');
    
    if (stock.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    <i class="fas fa-inbox fa-3x mb-3"></i>
                    <p>No hay productos en inventario</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = stock.map(item => {
        const status = getStockStatus(item.stock, item.minStock);
        const totalValue = item.stock * item.price;

        return `
            <tr>
                <td>${item.product}</td>
                <td>${item.category}</td>
                <td><strong>${item.stock}</strong></td>
                <td>${item.minStock}</td>
                <td>${status}</td>
                <td>$${totalValue.toLocaleString('es-CO')}</td>
            </tr>
        `;
    }).join('');
}

// Get stock status badge
function getStockStatus(stock, minStock) {
    if (stock === 0) {
        return '<span class="badge bg-danger"><i class="fas fa-times-circle"></i> Agotado</span>';
    } else if (stock <= minStock) {
        return '<span class="badge bg-warning"><i class="fas fa-exclamation-triangle"></i> Bajo</span>';
    } else {
        return '<span class="badge bg-success"><i class="fas fa-check-circle"></i> Óptimo</span>';
    }
}

// Load products for select dropdowns
async function loadProductsForSelect() {
    try {
        // Simulated products
        const products = [
            { id: 1, name: 'Arroz Diana 1kg' },
            { id: 2, name: 'Aceite Gourmet 1L' },
            { id: 3, name: 'Leche Alquería 1L' },
            { id: 4, name: 'Gaseosa Coca-Cola 2L' },
            { id: 5, name: 'Detergente Ariel 1kg' }
        ];

        const entrySelect = document.getElementById('entryProduct');
        const exitSelect = document.getElementById('exitProduct');

        const options = products.map(p => 
            `<option value="${p.id}">${p.name}</option>`
        ).join('');

        entrySelect.innerHTML += options;
        exitSelect.innerHTML += options;
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Handle entry form submission
async function handleEntry(e) {
    e.preventDefault();

    const entryData = {
        productId: document.getElementById('entryProduct').value,
        quantity: parseInt(document.getElementById('entryQuantity').value),
        reason: document.getElementById('entryReason').value,
        notes: document.getElementById('entryNotes').value
    };

    try {
        // await apiCall(API_ENDPOINTS.INVENTORY_ENTRY, 'POST', entryData);
        console.log('Entry registered:', entryData);
        showToast('Entrada registrada exitosamente', 'success');

        // Close modal and reload
        bootstrap.Modal.getInstance(document.getElementById('entryModal')).hide();
        document.getElementById('entryForm').reset();
        loadInventoryData();
    } catch (error) {
        console.error('Error registering entry:', error);
        showToast('Error al registrar entrada', 'error');
    }
}

// Handle exit form submission
async function handleExit(e) {
    e.preventDefault();

    const exitData = {
        productId: document.getElementById('exitProduct').value,
        quantity: parseInt(document.getElementById('exitQuantity').value),
        reason: document.getElementById('exitReason').value,
        notes: document.getElementById('exitNotes').value
    };

    try {
        // await apiCall(API_ENDPOINTS.INVENTORY_EXIT, 'POST', exitData);
        console.log('Exit registered:', exitData);
        showToast('Salida registrada exitosamente', 'success');

        // Close modal and reload
        bootstrap.Modal.getInstance(document.getElementById('exitModal')).hide();
        document.getElementById('exitForm').reset();
        loadInventoryData();
    } catch (error) {
        console.error('Error registering exit:', error);
        showToast('Error al registrar salida', 'error');
    }
}
