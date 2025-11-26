// Check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('token');
    const currentPage = window.location.pathname;
    
    // If no token and not on login page, redirect to login
    if (!token && !currentPage.includes('index.html')) {
        window.location.href = 'index.html';
        return false;
    }
    
    // If has token and on login page, redirect to dashboard
    if (token && currentPage.includes('index.html')) {
        window.location.href = 'dashboard.html';
        return false;
    }
    
    return true;
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Run auth check on page load
document.addEventListener('DOMContentLoaded', checkAuth);
