<?php
namespace App\Controllers;

use App\Models\Product;
use App\Models\InventoryMovement;
use App\Models\Sale;
use App\Models\Category;
use Response;
use Request;

class DashboardController {
    private $productModel;
    private $inventoryModel;
    private $saleModel;
    private $categoryModel;
    
    public function __construct() {
        $this->productModel = new Product();
        $this->inventoryModel = new InventoryMovement();
        $this->saleModel = new Sale();
        $this->categoryModel = new Category();
    }
    
    public function stats() {
        // Total productos
        $totalProducts = $this->productModel->countAll();
        
        // Valor total del inventario
        $inventoryValue = $this->productModel->getTotalInventoryValue();
        
        // Productos con stock bajo
        $lowStockProducts = $this->productModel->countLowStock();
        
        // Movimientos de hoy
        $todayMovements = $this->inventoryModel->countTodayMovements();
        
        // Productos agotados
        $outOfStock = $this->productModel->countOutOfStock();
        
        Response::json([
            'total_products' => $totalProducts,
            'inventory_value' => number_format($inventoryValue, 2, '.', ','),
            'low_stock' => $lowStockProducts,
            'today_movements' => $todayMovements,
            'out_of_stock' => $outOfStock
        ]);
    }
    
    public function inventoryChart() {
        $days = isset($_GET['days']) ? (int)$_GET['days'] : 7;
        $chartData = $this->inventoryModel->getMovementsChartData($days);
        
        Response::json($chartData);
    }
    
    public function categoriesChart() {
        $chartData = $this->categoryModel->getProductsByCategory();
        
        Response::json($chartData);
    }
    
    public function recentActivity() {
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 5;
        $activity = $this->inventoryModel->getRecentActivity($limit);
        
        // Formatear la actividad para el frontend
        $formattedActivity = [];
        foreach ($activity as $item) {
            $formattedActivity[] = [
                'id' => $item['id'],
                'date' => date('d/m/Y H:i', strtotime($item['created_at'])),
                'type' => $item['type'],
                'type_text' => $item['type'] === 'entry' ? 'Entrada' : 'Salida',
                'type_icon' => $item['type'] === 'entry' ? 'fa-arrow-down text-success' : 'fa-arrow-up text-danger',
                'product' => $item['product_name'],
                'quantity' => $item['quantity'],
                'user' => $item['user_name'],
                'reason' => $item['reason']
            ];
        }
        
        Response::json($formattedActivity);
    }
    
    public function lowStockAlerts() {
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 5;
        $products = $this->productModel->getLowStockProducts($limit);
        
        // Formatear para el frontend
        $formattedProducts = [];
        foreach ($products as $product) {
            $formattedProducts[] = [
                'id' => $product['id'],
                'name' => $product['name'],
                'stock' => $product['stock'],
                'min_stock' => $product['min_stock'],
                'needed' => $product['min_stock'] - $product['stock'],
                'category' => $product['category_name'],
                'unit' => $product['unit_abbreviation']
            ];
        }
        
        Response::json($formattedProducts);
    }
    
    public function salesChart() {
        $months = isset($_GET['months']) ? (int)$_GET['months'] : 6;
        $chartData = $this->saleModel->getSalesChartData($months);
        
        Response::json($chartData);
    }
    
    public function topProducts() {
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 5;
        $products = $this->saleModel->getTopSellingProducts($limit);
        
        Response::json($products);
    }
    
    public function categoriesDistribution() {
        $chartData = $this->categoryModel->getCategoriesDistribution();
        
        Response::json($chartData);
    }
}