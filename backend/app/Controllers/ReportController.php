<?php
namespace App\Controllers;

use App\Models\Product;
use App\Models\InventoryMovement;
use App\Models\Sale;
use App\Models\Category;
use App\Services\PdfGenerator;
use App\Services\ExcelGenerator;
use Response;
use Request;

class ReportController {
    private $productModel;
    private $inventoryModel;
    private $saleModel;
    private $categoryModel;
    private $pdfGenerator;
    private $excelGenerator;
    
    public function __construct() {
        $this->productModel = new Product();
        $this->inventoryModel = new InventoryMovement();
        $this->saleModel = new Sale();
        $this->categoryModel = new Category();
        $this->pdfGenerator = new PdfGenerator();
        $this->excelGenerator = new ExcelGenerator();
    }
    
    public function generate(Request $request) {
        $data = $request->getBody();
        
        $type = $data['type'] ?? 'inventory';
        $format = $data['format'] ?? 'pdf';
        $startDate = $data['start_date'] ?? null;
        $endDate = $data['end_date'] ?? null;
        
        switch ($type) {
            case 'inventory':
                $reportData = $this->generateInventoryReport($startDate, $endDate);
                break;
            case 'movements':
                $reportData = $this->generateMovementsReport($startDate, $endDate);
                break;
            case 'sales':
                $reportData = $this->generateSalesReport($startDate, $endDate);
                break;
            case 'lowstock':
                $reportData = $this->generateLowStockReport();
                break;
            case 'top':
                $reportData = $this->generateTopProductsReport($startDate, $endDate);
                break;
            default:
                $reportData = $this->generateInventoryReport($startDate, $endDate);
        }
        
        $reportName = ucfirst($type) . '_Report_' . date('Y-m-d_H-i-s');
        
        try {
            if ($format === 'pdf') {
                $filePath = $this->pdfGenerator->generate($reportData, $type, $reportName);
                $downloadUrl = str_replace(__DIR__ . '/../../../', '', $filePath);
                
                Response::json([
                    'success' => true,
                    'file_name' => basename($filePath),
                    'download_url' => '/frontend/' . $downloadUrl,
                    'message' => 'Reporte generado exitosamente'
                ]);
            } elseif ($format === 'excel' || $format === 'xlsx') {
                $filePath = $this->excelGenerator->generate($reportData, $type, $reportName);
                $downloadUrl = str_replace(__DIR__ . '/../../../', '', $filePath);
                
                Response::json([
                    'success' => true,
                    'file_name' => basename($filePath),
                    'download_url' => '/frontend/' . $downloadUrl,
                    'message' => 'Reporte generado exitosamente'
                ]);
            } else {
                http_response_code(400);
                Response::json([
                    'success' => false,
                    'message' => 'Formato de reporte no válido'
                ]);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            Response::json([
                'success' => false,
                'message' => 'Error al generar el reporte: ' . $e->getMessage()
            ]);
        }
    }
    
    private function generateInventoryReport($startDate = null, $endDate = null) {
        $products = $this->productModel->getAllProducts();
        
        $totalItems = 0;
        $totalValue = 0;
        
        foreach ($products as $product) {
            $totalItems += $product['stock'];
            $totalValue += $product['stock'] * $product['price'];
        }
        
        return [
            'title' => 'Reporte de Inventario',
            'date_range' => $this->getDateRangeText($startDate, $endDate),
            'generated_at' => date('d/m/Y H:i:s'),
            'summary' => [
                'total_products' => count($products),
                'total_items' => $totalItems,
                'total_value' => $totalValue
            ],
            'data' => $products
        ];
    }
    
    private function generateMovementsReport($startDate = null, $endDate = null) {
        $movements = $this->inventoryModel->getMovementsByDateRange($startDate, $endDate);
        
        $entries = array_filter($movements, function($m) { return $m['type'] === 'entry'; });
        $exits = array_filter($movements, function($m) { return $m['type'] === 'exit'; });
        
        $totalEntries = array_sum(array_column($entries, 'quantity'));
        $totalExits = array_sum(array_column($exits, 'quantity'));
        
        return [
            'title' => 'Reporte de Movimientos de Inventario',
            'date_range' => $this->getDateRangeText($startDate, $endDate),
            'generated_at' => date('d/m/Y H:i:s'),
            'summary' => [
                'total_movements' => count($movements),
                'total_entries' => $totalEntries,
                'total_exits' => $totalExits
            ],
            'data' => $movements
        ];
    }
    
    private function generateSalesReport($startDate = null, $endDate = null) {
        $sales = $this->saleModel->getSalesByDateRange($startDate, $endDate);
        
        $totalSales = count($sales);
        $totalAmount = array_sum(array_column($sales, 'total_amount'));
        
        return [
            'title' => 'Reporte de Ventas',
            'date_range' => $this->getDateRangeText($startDate, $endDate),
            'generated_at' => date('d/m/Y H:i:s'),
            'summary' => [
                'total_sales' => $totalSales,
                'total_amount' => $totalAmount
            ],
            'data' => $sales
        ];
    }
    
    private function generateLowStockReport() {
        $products = $this->productModel->getLowStockProducts(100); // Todos los productos con stock bajo
        
        return [
            'title' => 'Reporte de Productos con Stock Bajo',
            'date_range' => 'Actual',
            'generated_at' => date('d/m/Y H:i:s'),
            'summary' => [
                'total_products' => count($products),
                'total_needed' => array_sum(array_column($products, 'needed_quantity'))
            ],
            'data' => $products
        ];
    }
    
    private function generateTopProductsReport($startDate = null, $endDate = null) {
        $products = $this->saleModel->getTopSellingProducts(20, $startDate, $endDate);
        
        return [
            'title' => 'Reporte de Productos Más Vendidos',
            'date_range' => $this->getDateRangeText($startDate, $endDate),
            'generated_at' => date('d/m/Y H:i:s'),
            'summary' => [
                'total_products' => count($products),
                'total_units' => array_sum(array_column($products, 'total_sold'))
            ],
            'data' => $products
        ];
    }
    
    private function getDateRangeText($startDate, $endDate) {
        if (!$startDate && !$endDate) {
            return 'Todo el período';
        }
        
        $startText = $startDate ? date('d/m/Y', strtotime($startDate)) : 'Inicio';
        $endText = $endDate ? date('d/m/Y', strtotime($endDate)) : 'Actual';
        
        return "{$startText} - {$endText}";
    }
    
    public function analytics() {
        $salesData = $this->saleModel->getSalesAnalytics();
        $inventoryData = $this->productModel->getInventoryAnalytics();
        $categoryData = $this->categoryModel->getTopCategories();
        
        Response::json([
            'sales' => $salesData,
            'inventory' => $inventoryData,
            'categories' => $categoryData
        ]);
    }
}