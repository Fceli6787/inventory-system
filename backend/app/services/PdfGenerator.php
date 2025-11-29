<?php
namespace App\Services;

use Dompdf\Dompdf;
use Dompdf\Options;

class PdfGenerator {
    private $dompdf;
    
    public function __construct() {
        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isPhpEnabled', true);
        $options->set('isRemoteEnabled', true);
        
        $this->dompdf = new Dompdf($options);
    }
    
    public function generate($data, $type, $filename) {
        $html = $this->generateHtml($data, $type);
        
        $this->dompdf->loadHtml($html);
        $this->dompdf->setPaper('A4', 'portrait');
        $this->dompdf->render();
        
        // Crear directorio si no existe
        $directory = __DIR__ . '/../../../frontend/reports/';
        if (!file_exists($directory)) {
            mkdir($directory, 0777, true);
        }
        
        $filePath = $directory . $filename . '.pdf';
        file_put_contents($filePath, $this->dompdf->output());
        
        return $filePath;
    }
    
    private function generateHtml($data, $type) {
        $logoPath = __DIR__ . '/../../../frontend/assets/img/logo.png';
        $logoBase64 = file_exists($logoPath) ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath)) : '';
        
        $html = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>' . $data['title'] . '</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    color: #333;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #0d6efd;
                    padding-bottom: 20px;
                }
                .logo {
                    max-height: 80px;
                    margin-bottom: 10px;
                }
                h1 {
                    color: #0d6efd;
                    margin: 10px 0;
                }
                .report-info {
                    text-align: right;
                    margin-bottom: 20px;
                }
                .summary {
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                }
                .summary h3 {
                    margin-top: 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #0d6efd;
                    color: white;
                }
                tr:nth-child(even) {
                    background-color: #f8f9fa;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    font-size: 0.9em;
                    color: #666;
                }
                .status-low {
                    color: #ffc107;
                    font-weight: bold;
                }
                .status-out {
                    color: #dc3545;
                    font-weight: bold;
                }
                .status-active {
                    color: #198754;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="header">
                ' . ($logoBase64 ? '<img src="' . $logoBase64 . '" class="logo">' : '') . '
                <h1>' . $data['title'] . '</h1>
                <p>Sistema de Gestión de Inventario - InventoryPro</p>
            </div>
            
            <div class="report-info">
                <p><strong>Generado:</strong> ' . $data['generated_at'] . '</p>
                <p><strong>Rango de fechas:</strong> ' . $data['date_range'] . '</p>
            </div>
            
            <div class="summary">
                <h3>Resumen</h3>
                <ul>';
        
        foreach ($data['summary'] as $key => $value) {
            $label = str_replace('_', ' ', $key);
            $label = ucwords($label);
            
            if (strpos($key, 'value') !== false || strpos($key, 'amount') !== false) {
                $value = '$' . number_format($value, 2, ',', '.');
            }
            
            $html .= '<li><strong>' . $label . ':</strong> ' . $value . '</li>';
        }
        
        $html .= '
                </ul>
            </div>';
        
        // Tabla de datos según el tipo de reporte
        $html .= $this->generateTableHtml($data, $type);
        
        $html .= '
            <div class="footer">
                <p>Reporte generado por InventoryPro - Sistema de Gestión de Inventario</p>
                <p>Página <span class="page-number"></span> de <span class="total-pages"></span></p>
            </div>
        </body>
        </html>';
        
        return $html;
    }
    
    private function generateTableHtml($data, $type) {
        $html = '<table>';
        
        switch ($type) {
            case 'inventory':
                $html .= '
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Stock</th>
                        <th>Precio Unit.</th>
                        <th>Valor Total</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>';
                
                foreach ($data['data'] as $product) {
                    $totalValue = $product['stock'] * $product['price'];
                    $statusClass = $this->getStatusClass($product['status']);
                    
                    $html .= '
                    <tr>
                        <td>' . $product['code'] . '</td>
                        <td>' . $product['name'] . '</td>
                        <td>' . $product['category_name'] . '</td>
                        <td>' . $product['stock'] . ' ' . $product['unit_abbreviation'] . '</td>
                        <td>$' . number_format($product['price'], 2, ',', '.') . '</td>
                        <td>$' . number_format($totalValue, 2, ',', '.') . '</td>
                        <td class="' . $statusClass . '">' . $this->getStatusText($product['status']) . '</td>
                    </tr>';
                }
                break;
                
            case 'movements':
                $html .= '
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Ant. Stock</th>
                        <th>Nuevo Stock</th>
                        <th>Usuario</th>
                        <th>Motivo</th>
                    </tr>
                </thead>
                <tbody>';
                
                foreach ($data['data'] as $movement) {
                    $typeText = $movement['type'] === 'entry' ? 'Entrada' : 'Salida';
                    $typeClass = $movement['type'] === 'entry' ? 'status-active' : 'status-out';
                    
                    $html .= '
                    <tr>
                        <td>' . date('d/m/Y H:i', strtotime($movement['created_at'])) . '</td>
                        <td class="' . $typeClass . '">' . $typeText . '</td>
                        <td>' . $movement['product_name'] . '</td>
                        <td>' . $movement['quantity'] . '</td>
                        <td>' . $movement['previous_stock'] . '</td>
                        <td>' . $movement['new_stock'] . '</td>
                        <td>' . $movement['user_name'] . '</td>
                        <td>' . $movement['reason'] . '</td>
                    </tr>';
                }
                break;
                
            case 'lowstock':
                $html .= '
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Stock Actual</th>
                        <th>Stock Mínimo</th>
                        <th>Necesita</th>
                        <th>Valor Necesita</th>
                    </tr>
                </thead>
                <tbody>';
                
                foreach ($data['data'] as $product) {
                    $neededQuantity = $product['min_stock'] - $product['stock'];
                    $neededValue = $neededQuantity * $product['price'];
                    
                    $html .= '
                    <tr>
                        <td>' . $product['code'] . '</td>
                        <td>' . $product['name'] . '</td>
                        <td>' . $product['category_name'] . '</td>
                        <td class="status-low">' . $product['stock'] . '</td>
                        <td>' . $product['min_stock'] . '</td>
                        <td class="status-low">' . $neededQuantity . ' ' . $product['unit_abbreviation'] . '</td>
                        <td class="status-low">$' . number_format($neededValue, 2, ',', '.') . '</td>
                    </tr>';
                }
                break;
                
            case 'top':
                $html .= '
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Categoría</th>
                        <th>Unidades Vendidas</th>
                        <th>Precio Promedio</th>
                        <th>Ingresos Totales</th>
                    </tr>
                </thead>
                <tbody>';
                
                foreach ($data['data'] as $product) {
                    $html .= '
                    <tr>
                        <td>' . $product['name'] . '</td>
                        <td>' . $product['category_name'] . '</td>
                        <td>' . $product['total_sold'] . '</td>
                        <td>$' . number_format($product['avg_price'], 2, ',', '.') . '</td>
                        <td>$' . number_format($product['total_revenue'], 2, ',', '.') . '</td>
                    </tr>';
                }
                break;
                
            default:
                $html .= '
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Producto</th>
                        <th>Stock</th>
                        <th>Precio</th>
                    </tr>
                </thead>
                <tbody>';
                
                foreach ($data['data'] as $product) {
                    $html .= '
                    <tr>
                        <td>' . $product['code'] . '</td>
                        <td>' . $product['name'] . '</td>
                        <td>' . $product['stock'] . '</td>
                        <td>$' . number_format($product['price'], 2, ',', '.') . '</td>
                    </tr>';
                }
        }
        
        $html .= '
                </tbody>
            </table>';
        
        return $html;
    }
    
    private function getStatusClass($status) {
        switch ($status) {
            case 'low':
                return 'status-low';
            case 'out':
                return 'status-out';
            default:
                return 'status-active';
        }
    }
    
    private function getStatusText($status) {
        switch ($status) {
            case 'low':
                return 'Stock Bajo';
            case 'out':
                return 'Agotado';
            default:
                return 'Activo';
        }
    }
}