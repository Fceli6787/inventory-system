<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../core/init.php';

$request = new Request();
$router = new Router($request);

// Middleware de autenticación
$authMiddleware = new \App\Middleware\AuthMiddleware();

// Rutas de autenticación (sin autenticación)
$router->add('POST', '/api/auth/login', 'AuthController', 'login');
$router->add('POST', '/api/auth/logout', 'AuthController', 'logout');

// Rutas protegidas (requieren autenticación)
$router->add('GET', '/api/auth/check', 'AuthController', 'check', [$authMiddleware, 'handle']);

// Dashboard
$router->add('GET', '/api/dashboard/stats', 'DashboardController', 'stats', [$authMiddleware, 'handle']);
$router->add('GET', '/api/dashboard/inventory-chart', 'DashboardController', 'inventoryChart', [$authMiddleware, 'handle']);
$router->add('GET', '/api/dashboard/categories-chart', 'DashboardController', 'categoriesChart', [$authMiddleware, 'handle']);
$router->add('GET', '/api/dashboard/recent-activity', 'DashboardController', 'recentActivity', [$authMiddleware, 'handle']);
$router->add('GET', '/api/dashboard/low-stock', 'DashboardController', 'lowStockAlerts', [$authMiddleware, 'handle']);
$router->add('GET', '/api/dashboard/sales-chart', 'DashboardController', 'salesChart', [$authMiddleware, 'handle']);
$router->add('GET', '/api/dashboard/top-products', 'DashboardController', 'topProducts', [$authMiddleware, 'handle']);
$router->add('GET', '/api/dashboard/categories-distribution', 'DashboardController', 'categoriesDistribution', [$authMiddleware, 'handle']);

// Productos
$router->add('GET', '/api/products', 'ProductController', 'index', [$authMiddleware, 'handle']);
$router->add('GET', '/api/products/{id}', 'ProductController', 'show', [$authMiddleware, 'handle']);
$router->add('POST', '/api/products', 'ProductController', 'store', [$authMiddleware, 'handle']);
$router->add('PUT', '/api/products/{id}', 'ProductController', 'update', [$authMiddleware, 'handle']);
$router->add('DELETE', '/api/products/{id}', 'ProductController', 'destroy', [$authMiddleware, 'handle']);
$router->add('GET', '/api/products/categories', 'ProductController', 'categories', [$authMiddleware, 'handle']);
$router->add('GET', '/api/products/units', 'ProductController', 'units', [$authMiddleware, 'handle']);
$router->add('GET', '/api/products/low-stock', 'ProductController', 'lowStock', [$authMiddleware, 'handle']);
$router->add('GET', '/api/products/out-of-stock', 'ProductController', 'outOfStock', [$authMiddleware, 'handle']);

// Inventario
$router->add('GET', '/api/inventory', 'InventoryController', 'index', [$authMiddleware, 'handle']);
$router->add('POST', '/api/inventory/entry', 'InventoryController', 'entry', [$authMiddleware, 'handle']);
$router->add('POST', '/api/inventory/exit', 'InventoryController', 'exit', [$authMiddleware, 'handle']);
$router->add('GET', '/api/inventory/movements', 'InventoryController', 'movements', [$authMiddleware, 'handle']);

// Reportes
$router->add('POST', '/api/reports/generate', 'ReportController', 'generate', [$authMiddleware, 'handle']);
$router->add('GET', '/api/reports/analytics', 'ReportController', 'analytics', [$authMiddleware, 'handle']);

// Usuarios
$router->add('GET', '/api/users', 'UserController', 'index', [$authMiddleware, 'handle']);
$router->add('GET', '/api/users/{id}', 'UserController', 'show', [$authMiddleware, 'handle']);
$router->add('POST', '/api/users', 'UserController', 'store', [$authMiddleware, 'handle']);
$router->add('PUT', '/api/users/{id}', 'UserController', 'update', [$authMiddleware, 'handle']);
$router->add('DELETE', '/api/users/{id}', 'UserController', 'destroy', [$authMiddleware, 'handle']);
$router->add('GET', '/api/users/roles', 'UserController', 'roles', [$authMiddleware, 'handle']);
$router->add('GET', '/api/users/profile', 'UserController', 'profile', [$authMiddleware, 'handle']);
$router->add('PUT', '/api/users/profile', 'UserController', 'updateProfile', [$authMiddleware, 'handle']);

// Iniciar el enrutador
$router->dispatch();