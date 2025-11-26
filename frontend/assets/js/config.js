// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost/backend/public/api',
    TIMEOUT: 30000,
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// API Endpoints
const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    
    // Products
    PRODUCTS: '/products',
    PRODUCT_BY_ID: (id) => `/products/${id}`,
    
    // Inventory
    INVENTORY: '/inventory',
    INVENTORY_ENTRY: '/inventory/entry',
    INVENTORY_EXIT: '/inventory/exit',
    
    // Reports
    DASHBOARD_DATA: '/reports/dashboard',
    LOW_STOCK: '/reports/low-stock',
    
    // Users
    USERS: '/users',
    USER_BY_ID: (id) => `/users/${id}`
};

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', data = null) {
    const token = localStorage.getItem('token');
    
    const config = {
        method: method,
        headers: {
            ...API_CONFIG.HEADERS,
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(API_CONFIG.BASE_URL + endpoint, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Show toast notifications
function showToast(message, type = 'success') {
    // Using Bootstrap toast or simple alert for now
    alert(message);
    // TODO: Implement proper toast notifications
}
