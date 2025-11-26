document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    initEventListeners();
});

let productsData = [];

// Initialize event listeners
function initEventListeners() {
    const productForm = document.getElementById('productForm');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const resetFilters = document.getElementById('resetFilters');

    // Form submission
    productForm.addEventListener('submit', handleProductSubmit);

    // Filters
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    statusFilter.addEventListener('change', filterProducts);
    resetFilters.addEventListener('click', resetAllFilters);

    // Modal reset on close
    const productModal = document.getElementById('productModal');
    productModal.addEventListener('hidden.bs.modal', resetForm);
}

// Load products from API
async function loadProducts() {
    try {
        // TODO: Replace with actual API call
        // const response = await apiCall(API_ENDPOINTS.PRODUCTS);
        
        // Simulated data
        productsData = [
            {
                id: 1,
                name: 'Arroz Diana 1kg',
                code: 'ARR001',
                category: 'abarrotes',
                price: 3500,
                stock: 45,
                minStock: 10,
                unit: 'unidad',
                image: 'assets/img/placeholder.png',
                status: 'active'
            },
            {
                id: 2,
                name: 'Aceite Gourmet 1L',
                code: 'ACE001',
                category: 'abarrotes',
                price: 8900,
                stock: 8,
                minStock: 15,
                unit: 'unidad',
                image: 'assets/img/placeholder.png',
                status: 'low'
            },
            {
                id: 3,
                name: 'Leche Alquería 1L',
                code: 'LEC001',
                category: 'lacteos',
                price: 4200,
                stock: 60,
                minStock: 20,
                unit: 'unidad',
                image: 'assets/img/placeholder.png',
                status: 'active'
            },
            {
                id: 4,
                name: 'Gaseosa Coca-Cola 2L',
                code: 'BEB001',
                category: 'bebidas',
                price: 5500,
                stock: 0,
                minStock: 25,
                unit: 'unidad',
                image: 'assets/img/placeholder.png',
                status: 'out'
            },
            {
                id: 5,
                name: 'Detergente Ariel 1kg',
                code: 'LIM001',
                category: 'limpieza',
                price: 12000,
                stock: 30,
                minStock: 10,
                unit: 'unidad',
                image: 'assets/img/placeholder.png',
                status: 'active'
            }
        ];

        displayProducts(productsData);
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Error al cargar productos', 'error');
    }
}

// Display products in table
function displayProducts(products) {
    const tbody = document.getElementById('productsTableBody');
    
    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-4">
                    <i class="fas fa-inbox fa-3x mb-3"></i>
                    <p>No se encontraron productos</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = products.map(product => {
        const statusBadge = getStatusBadge(product.status, product.stock, product.minStock);
        
        return `
            <tr>
                <td>${product.id}</td>
                <td>
                    <img src="${product.image}" alt="${product.name}" 
                         class="rounded" style="width: 40px; height: 40px; object-fit: cover;">
                </td>
                <td>${product.name}</td>
                <td><span class="badge bg-secondary">${getCategoryName(product.category)}</span></td>
                <td>$${product.price.toLocaleString('es-CO')}</td>
                <td>${product.stock} ${product.unit}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="editProduct(${product.id})"
                            title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})"
                            title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Get status badge HTML
function getStatusBadge(status, stock, minStock) {
    if (stock === 0) {
        return '<span class="badge bg-danger">Agotado</span>';
    } else if (stock <= minStock) {
        return '<span class="badge bg-warning">Stock Bajo</span>';
    } else {
        return '<span class="badge bg-success">Disponible</span>';
    }
}

// Get category name
function getCategoryName(category) {
    const categories = {
        'abarrotes': 'Abarrotes',
        'bebidas': 'Bebidas',
        'lacteos': 'Lácteos',
        'limpieza': 'Limpieza'
    };
    return categories[category] || category;
}

// Filter products
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    let filtered = productsData.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.code.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        const matchesStatus = !statusFilter || product.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    displayProducts(filtered);
}

// Reset filters
function resetAllFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('statusFilter').value = '';
    displayProducts(productsData);
}

// Handle form submission
async function handleProductSubmit(e) {
    e.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value,
        code: document.getElementById('productCode').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        minStock: parseInt(document.getElementById('productMinStock').value),
        unit: document.getElementById('productUnit').value,
        description: document.getElementById('productDescription').value
    };

    try {
        if (productId) {
            // Update existing product
            // await apiCall(API_ENDPOINTS.PRODUCT_BY_ID(productId), 'PUT', productData);
            console.log('Updating product:', productId, productData);
            showToast('Producto actualizado exitosamente', 'success');
        } else {
            // Create new product
            // await apiCall(API_ENDPOINTS.PRODUCTS, 'POST', productData);
            console.log('Creating product:', productData);
            showToast('Producto creado exitosamente', 'success');
        }

        // Close modal and reload products
        bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
        loadProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        showToast('Error al guardar el producto', 'error');
    }
}

// Edit product
function editProduct(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;

    // Fill form
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCode').value = product.code;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productMinStock').value = product.minStock;
    document.getElementById('productUnit').value = product.unit;
    document.getElementById('productDescription').value = product.description || '';

    // Change modal title
    document.getElementById('modalTitle').textContent = 'Editar Producto';

    // Show modal
    new bootstrap.Modal(document.getElementById('productModal')).show();
}

// Delete product
async function deleteProduct(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
        // await apiCall(API_ENDPOINTS.PRODUCT_BY_ID(id), 'DELETE');
        console.log('Deleting product:', id);
        showToast('Producto eliminado exitosamente', 'success');
        loadProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Error al eliminar el producto', 'error');
    }
}

// Reset form
function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('modalTitle').textContent = 'Nuevo Producto';
}
