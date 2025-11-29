<?php
namespace App\Services;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Color;

class ExcelGenerator {
    public function generate($data, $type, $filename) {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        // Título del reporte
        $sheet->setCellValue('A1', $data['title']);
        $sheet->mergeCells('A1:H1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        
        // Información del reporte
        $sheet->setCellValue('A2', 'Generado: ' . $data['generated_at']);
        $sheet->setCellValue('A3', 'Rango de fechas: ' . $data['date_range']);
        
        // Resumen
        $row = 5;
        $sheet->setCellValue('A' . $row, 'Resumen');
        $sheet->getStyle('A' . $row)->getFont()->setBold(true)->setSize(14);
        $row++;
        
        foreach ($data['summary'] as $key => $value) {
            $label = str_replace('_', ' ', $key);
            $label = ucwords($label);
            
            if (strpos($key, 'value') !== false || strpos($key, 'amount') !== false) {
                $value = '$' . number_format($value, 2);
            }
            
            $sheet->setCellValue('A' . $row, $label . ':');
            $sheet->setCellValue('B' . $row, $value);
            $row++;
        }
        
        $row += 2;
        
        // Tabla de datos según el tipo
        $this->generateTable($sheet, $data, $type, $row);
        
        // Ajustar ancho de columnas
        foreach (range('A', 'H') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }
        
        // Crear directorio si no existe
        $directory = __DIR__ . '/../../../frontend/reports/';
        if (!file_exists($directory)) {
            mkdir($directory, 0777, true);
        }
        
        $filePath = $directory . $filename . '.xlsx';
        $writer = new Xlsx($spreadsheet);
        $writer->save($filePath);
        
        return $filePath;
    }
    
    private function generateTable($sheet, $data, $type, $startRow) {
        $row = $startRow;
        
        switch ($type) {
            case 'inventory':
                // Encabezados
                $headers = ['Código', 'Producto', 'Categoría', 'Stock', 'Unidad', 'Precio Unit.', 'Valor Total', 'Estado'];
                $this->writeHeaders($sheet, $headers, $row);
                $row++;
                
                // Datos
                foreach ($data['data'] as $product) {
                    $totalValue = $product['stock'] * $product['price'];
                    $status = $this->getStatusText($product['status']);
                    
                    $sheet->setCellValue('A' . $row, $product['code']);
                    $sheet->setCellValue('B' . $row, $product['name']);
                    $sheet->setCellValue('C' . $row, $product['category_name']);
                    $sheet->setCellValue('D' . $row, $product['stock']);
                    $sheet->setCellValue('E' . $row, $product['unit_abbreviation']);
                    $sheet->setCellValue('F' . $row, $product['price']);
                    $sheet->setCellValue('G' . $row, $totalValue);
                    $sheet->setCellValue('H' . $row, $status);
                    
                    // Aplicar formato de moneda
                    $sheet->getStyle('F' . $row)->getNumberFormat()->setFormatCode('$#,##0.00');
                    $sheet->getStyle('G' . $row)->getNumberFormat()->setFormatCode('$#,##0.00');
                    
                    // Aplicar color según estado
                    $this->applyStatusColor($sheet, 'H' . $row, $product['status']);
                    
                    $row++;
                }
                break;
                
            case 'movements':
                // Encabezados
                $headers = ['Fecha', 'Tipo', 'Producto', 'Cantidad', 'Ant. Stock', 'Nuevo Stock', 'Usuario', 'Motivo'];
                $this->writeHeaders($sheet, $headers, $row);
                $row++;
                
                // Datos
                foreach ($data['data'] as $movement) {
                    $typeText = $movement['type'] === 'entry' ? 'Entrada' : 'Salida';
                    
                    $sheet->setCellValue('A' . $row, date('d/m/Y H:i', strtotime($movement['created_at'])));
                    $sheet->setCellValue('B' . $row, $typeText);
                    $sheet->setCellValue('C' . $row, $movement['product_name']);
                    $sheet->setCellValue('D' . $row, $movement['quantity']);
                    $sheet->setCellValue('E' . $row, $movement['previous_stock']);
                    $sheet->setCellValue('F' . $row, $movement['new_stock']);
                    $sheet->setCellValue('G' . $row, $movement['user_name']);
                    $sheet->setCellValue('H' . $row, $movement['reason']);
                    
                    // Aplicar color según tipo
                    if ($movement['type'] === 'entry') {
                        $sheet->getStyle('B' . $row)->getFont()->getColor()->setARGB(Color::COLOR_GREEN);
                    } else {
                        $sheet->getStyle('B' . $row)->getFont()->getColor()->setARGB(Color::COLOR_RED);
                    }
                    
                    $row++;
                }
                break;
                
            case 'lowstock':
                // Encabezados
                $headers = ['Código', 'Producto', 'Categoría', 'Stock Actual', 'Stock Mínimo', 'Necesita', 'Unidad', 'Valor Necesita'];
                $this->writeHeaders($sheet, $headers, $row);
                $row++;
                
                // Datos
                foreach ($data['data'] as $product) {
                    $neededQuantity = $product['min_stock'] - $product['stock'];
                    $neededValue = $neededQuantity * $product['price'];
                    
                    $sheet->setCellValue('A' . $row, $product['code']);
                    $sheet->setCellValue('B' . $row, $product['name']);
                    $sheet->setCellValue('C' . $row, $product['category_name']);
                    $sheet->setCellValue('D' . $row, $product['stock']);
                    $sheet->setCellValue('E' . $row, $product['min_stock']);
                    $sheet->setCellValue('F' . $row, $neededQuantity);
                    $sheet->setCellValue('G' . $row, $product['unit_abbreviation']);
                    $sheet->setCellValue('H' . $row, $neededValue);
                    
                    // Aplicar formato de moneda
                    $sheet->getStyle('H' . $row)->getNumberFormat()->setFormatCode('$#,##0.00');
                    
                    // Aplicar color de alerta
                    $this->applyStatusColor($sheet, 'D' . $row, 'low');
                    $this->applyStatusColor($sheet, 'F' . $row, 'low');
                    $this->applyStatusColor($sheet, 'H' . $row, 'low');
                    
                    $row++;
                }
                break;
                
            case 'top':
                // Encabezados
                $headers = ['Producto', 'Categoría', 'Unidades Vendidas', 'Precio Promedio', 'Ingresos Totales'];
                $this->writeHeaders($sheet, $headers, $row);
                $row++;
                
                // Datos
                foreach ($data['data'] as $product) {
                    $sheet->setCellValue('A' . $row, $product['name']);
                    $sheet->setCellValue('B' . $row, $product['category_name']);
                    $sheet->setCellValue('C' . $row, $product['total_sold']);
                    $sheet->setCellValue('D' . $row, $product['avg_price']);
                    $sheet->setCellValue('E' . $row, $product['total_revenue']);
                    
                    // Aplicar formato de moneda
                    $sheet->getStyle('D' . $row)->getNumberFormat()->setFormatCode('$#,##0.00');
                    $sheet->getStyle('E' . $row)->getNumberFormat()->setFormatCode('$#,##0.00');
                    
                    $row++;
                }
                break;
        }
        
        // Aplicar bordes a la tabla
        $lastColumn = 'H';
        $lastRow = $row - 1;
        $range = "A{$startRow}:{$lastColumn}{$lastRow}";
        
        $sheet->getStyle($range)->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);
    }
    
    private function writeHeaders($sheet, $headers, $row) {
        $column = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($column . $row, $header);
            $sheet->getStyle($column . $row)->getFont()->setBold(true);
            $sheet->getStyle($column . $row)->getFill()->setFillType(Fill::FILL_SOLID);
            $sheet->getStyle($column . $row)->getFill()->getStartColor()->setARGB('FFDDEBF7');
            $column++;
        }
    }
    
    private function applyStatusColor($sheet, $cell, $status) {
        switch ($status) {
            case 'low':
                $sheet->getStyle($cell)->getFill()->setFillType(Fill::FILL_SOLID);
                $sheet->getStyle($cell)->getFill()->getStartColor()->setARGB('FFFFF0B3');
                break;
            case 'out':
                $sheet->getStyle($cell)->getFill()->setFillType(Fill::FILL_SOLID);
                $sheet->getStyle($cell)->getFill()->getStartColor()->setARGB('FFF8D9D9');
                break;
            default:
                $sheet->getStyle($cell)->getFill()->setFillType(Fill::FILL_SOLID);
                $sheet->getStyle($cell)->getFill()->getStartColor()->setARGB('FFD9EAD3');
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