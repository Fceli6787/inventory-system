-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS inventorypro DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inventorypro;

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar roles por defecto
INSERT INTO roles (name, description) VALUES
('admin', 'Administrador con acceso total al sistema'),
('employee', 'Empleado con permisos para gestionar inventario y productos'),
('viewer', 'Usuario con permisos de solo lectura');

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL DEFAULT 2,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario admin por defecto (contraseña: admin123)
-- La contraseña está hasheada con password_hash('admin123', PASSWORD_DEFAULT)
INSERT INTO users (name, email, password, role_id) VALUES (
    'Administrador',
    'admin@inventorypro.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    1
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar categorías por defecto
INSERT INTO categories (name, code, description) VALUES
('Abarrotes', 'ABAR', 'Productos de despensa básicos'),
('Bebidas', 'BEBI', 'Refrescos, jugos y otros'),
('Lácteos', 'LACT', 'Leche, queso, yogurt y derivados'),
('Limpieza', 'LIMP', 'Productos de limpieza para el hogar'),
('Congelados', 'CONG', 'Productos congelados'),
('Carnes', 'CARN', 'Cortes de carne y embutidos'),
('Frutas y Verduras', 'FVER', 'Productos frescos'),
('Otros', 'OTRO', 'Categoría para productos no clasificados');

-- Tabla de unidades de medida
CREATE TABLE IF NOT EXISTS units (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    abbreviation VARCHAR(10) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar unidades de medida por defecto
INSERT INTO units (name, abbreviation, description) VALUES
('Unidad', 'und', 'Artículos individuales'),
('Kilogramo', 'kg', 'Peso en kilogramos'),
('Litro', 'lt', 'Volumen en litros'),
('Caja', 'caja', 'Unidades empacadas en caja'),
('Paquete', 'paq', 'Unidades empacadas en paquete'),
('Docena', 'doc', '12 unidades');

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 5,
    category_id INT NOT NULL,
    unit_id INT NOT NULL DEFAULT 1,
    image_path VARCHAR(255),
    barcode VARCHAR(50),
    status ENUM('active', 'low', 'out') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de movimientos de inventario
CREATE TABLE IF NOT EXISTS inventory_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    type ENUM('entry', 'exit') NOT NULL,
    quantity INT NOT NULL,
    previous_stock INT NOT NULL,
    new_stock INT NOT NULL,
    reason VARCHAR(100) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de proveedores
CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de compras (entradas de inventario desde proveedores)
CREATE TABLE IF NOT EXISTS purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    user_id INT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de detalles de compras
CREATE TABLE IF NOT EXISTS purchase_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de ventas (salidas de inventario)
CREATE TABLE IF NOT EXISTS sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    payment_method ENUM('cash', 'card', 'transfer') NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de detalles de ventas
CREATE TABLE IF NOT EXISTS sale_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de logs de actividad
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de alertas de stock bajo
CREATE TABLE IF NOT EXISTS low_stock_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    alert_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de reportes programados
CREATE TABLE IF NOT EXISTS scheduled_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    format ENUM('pdf', 'excel', 'csv') NOT NULL,
    frequency ENUM('daily', 'weekly', 'monthly') NOT NULL,
    last_sent TIMESTAMP NULL,
    next_send TIMESTAMP NOT NULL,
    recipients TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de configuraciones del sistema
CREATE TABLE IF NOT EXISTS system_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar configuraciones por defecto
INSERT INTO system_config (config_key, config_value, description) VALUES
('inventory.low_stock_threshold', '5', 'Umbral para alertas de stock bajo'),
('report.default_format', 'pdf', 'Formato predeterminado para reportes'),
('system.currency', 'COP', 'Moneda del sistema'),
('notifications.email_enabled', 'true', 'Habilitar notificaciones por correo'),
('notifications.low_stock_enabled', 'true', 'Habilitar alertas de stock bajo'),
('backup.frequency', 'daily', 'Frecuencia de respaldos'),
('backup.retention_days', '30', 'Días de retención de respaldos');

-- Vista para productos con stock bajo
CREATE OR REPLACE VIEW low_stock_products AS
SELECT 
    p.id,
    p.code,
    p.name,
    p.stock,
    p.min_stock,
    (p.min_stock - p.stock) AS needed_quantity,
    c.name AS category_name,
    u.name AS unit_name,
    u.abbreviation AS unit_abbreviation,
    p.price
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN units u ON p.unit_id = u.id
WHERE p.stock <= p.min_stock AND p.stock > 0
ORDER BY p.stock ASC;

-- Vista para productos agotados
CREATE OR REPLACE VIEW out_of_stock_products AS
SELECT 
    p.id,
    p.code,
    p.name,
    p.stock,
    p.min_stock,
    c.name AS category_name,
    u.name AS unit_name,
    u.abbreviation AS unit_abbreviation
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN units u ON p.unit_id = u.id
WHERE p.stock = 0
ORDER BY p.name;

-- Vista para valor total del inventario
CREATE OR REPLACE VIEW inventory_value AS
SELECT 
    p.id,
    p.code,
    p.name,
    p.stock,
    p.price,
    (p.stock * p.price) AS total_value,
    c.name AS category_name,
    u.name AS unit_name
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN units u ON p.unit_id = u.id
ORDER BY total_value DESC;

-- Vista para movimientos recientes
CREATE OR REPLACE VIEW recent_movements AS
SELECT 
    m.id,
    m.created_at,
    m.type,
    m.quantity,
    m.previous_stock,
    m.new_stock,
    m.reason,
    m.notes,
    p.id AS product_id,
    p.name AS product_name,
    p.code AS product_code,
    u.id AS user_id,
    u.name AS user_name
FROM inventory_movements m
JOIN products p ON m.product_id = p.id
JOIN users u ON m.user_id = u.id
ORDER BY m.created_at DESC
LIMIT 50;

-- Vista para análisis de ventas por categoría
CREATE OR REPLACE VIEW sales_by_category AS
SELECT 
    c.id AS category_id,
    c.name AS category_name,
    COUNT(sd.product_id) AS total_products_sold,
    SUM(sd.quantity) AS total_units_sold,
    SUM(sd.quantity * sd.unit_price) AS total_revenue
FROM sale_details sd
JOIN products p ON sd.product_id = p.id
JOIN categories c ON p.category_id = c.id
JOIN sales s ON sd.sale_id = s.id
GROUP BY c.id, c.name
ORDER BY total_revenue DESC;

-- Vista para productos más vendidos
CREATE OR REPLACE VIEW top_selling_products AS
SELECT 
    p.id,
    p.code,
    p.name,
    c.name AS category_name,
    SUM(sd.quantity) AS total_sold,
    AVG(sd.unit_price) AS avg_price,
    SUM(sd.quantity * sd.unit_price) AS total_revenue
FROM sale_details sd
JOIN products p ON sd.product_id = p.id
JOIN categories c ON p.category_id = c.id
JOIN sales s ON sd.sale_id = s.id
GROUP BY p.id, p.code, p.name, c.name
ORDER BY total_sold DESC
LIMIT 10;

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_stock ON products(stock);
CREATE INDEX idx_movements_date ON inventory_movements(created_at);
CREATE INDEX idx_movements_product ON inventory_movements(product_id);
CREATE INDEX idx_sales_date ON sales(created_at);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_code ON products(code);
CREATE INDEX idx_products_barcode ON products(barcode);

-- Procedimiento almacenado para registrar entrada de inventario
DELIMITER $$
CREATE PROCEDURE register_inventory_entry(
    IN p_product_id INT,
    IN p_user_id INT,
    IN p_quantity INT,
    IN p_reason VARCHAR(100),
    IN p_notes TEXT
)
BEGIN
    DECLARE current_stock INT;
    DECLARE new_stock INT;
    
    -- Obtener stock actual
    SELECT stock INTO current_stock FROM products WHERE id = p_product_id FOR UPDATE;
    
    -- Calcular nuevo stock
    SET new_stock = current_stock + p_quantity;
    
    -- Actualizar stock del producto
    UPDATE products 
    SET stock = new_stock,
        status = CASE
            WHEN new_stock > min_stock THEN 'active'
            WHEN new_stock = 0 THEN 'out'
            ELSE 'low'
        END
    WHERE id = p_product_id;
    
    -- Registrar movimiento
    INSERT INTO inventory_movements (
        product_id, user_id, type, quantity, 
        previous_stock, new_stock, reason, notes
    ) VALUES (
        p_product_id, p_user_id, 'entry', p_quantity,
        current_stock, new_stock, p_reason, p_notes
    );
    
    -- Verificar si hay alertas de stock bajo que se pueden resolver
    IF new_stock > (SELECT min_stock FROM products WHERE id = p_product_id) THEN
        UPDATE low_stock_alerts 
        SET resolved = true, resolved_at = NOW()
        WHERE product_id = p_product_id AND resolved = false;
    END IF;
    
    SELECT LAST_INSERT_ID() AS movement_id, new_stock AS updated_stock;
END$$
DELIMITER ;

-- Procedimiento almacenado para registrar salida de inventario
DELIMITER $$
CREATE PROCEDURE register_inventory_exit(
    IN p_product_id INT,
    IN p_user_id INT,
    IN p_quantity INT,
    IN p_reason VARCHAR(100),
    IN p_notes TEXT
)
BEGIN
    DECLARE current_stock INT;
    DECLARE new_stock INT;
    
    -- Obtener stock actual
    SELECT stock INTO current_stock FROM products WHERE id = p_product_id FOR UPDATE;
    
    -- Verificar si hay suficiente stock
    IF current_stock < p_quantity THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'No hay suficiente stock para realizar esta salida';
    END IF;
    
    -- Calcular nuevo stock
    SET new_stock = current_stock - p_quantity;
    
    -- Actualizar stock del producto
    UPDATE products 
    SET stock = new_stock,
        status = CASE
            WHEN new_stock > min_stock THEN 'active'
            WHEN new_stock = 0 THEN 'out'
            ELSE 'low'
        END
    WHERE id = p_product_id;
    
    -- Registrar movimiento
    INSERT INTO inventory_movements (
        product_id, user_id, type, quantity, 
        previous_stock, new_stock, reason, notes
    ) VALUES (
        p_product_id, p_user_id, 'exit', p_quantity,
        current_stock, new_stock, p_reason, p_notes
    );
    
    -- Crear alerta si el stock está bajo
    IF new_stock <= (SELECT min_stock FROM products WHERE id = p_product_id) AND new_stock > 0 THEN
        INSERT INTO low_stock_alerts (product_id) VALUES (p_product_id);
    END IF;
    
    -- Crear alerta si el producto está agotado
    IF new_stock = 0 THEN
        INSERT INTO low_stock_alerts (product_id) VALUES (p_product_id);
    END IF;
    
    SELECT LAST_INSERT_ID() AS movement_id, new_stock AS updated_stock;
END$$
DELIMITER ;

-- Función para obtener el valor total del inventario
DELIMITER $$
CREATE FUNCTION get_total_inventory_value()
RETURNS DECIMAL(15,2)
DETERMINISTIC
BEGIN
    DECLARE total_value DECIMAL(15,2);
    
    SELECT SUM(stock * price) INTO total_value
    FROM products;
    
    RETURN COALESCE(total_value, 0);
END$$
DELIMITER ;

-- Trigger para crear alerta automáticamente cuando el stock está bajo
DELIMITER $$
CREATE TRIGGER after_product_update
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    -- Si el producto pasó a estado 'low' y no tiene alertas pendientes
    IF NEW.status = 'low' AND OLD.status != 'low' THEN
        INSERT INTO low_stock_alerts (product_id) VALUES (NEW.id);
    END IF;
    
    -- Si el producto pasó a estado 'out' y no tiene alertas pendientes
    IF NEW.status = 'out' AND OLD.status != 'out' THEN
        INSERT INTO low_stock_alerts (product_id) VALUES (NEW.id);
    END IF;
    
    -- Si el producto ya no está en estado bajo o agotado, resolver alertas
    IF NEW.status = 'active' AND (OLD.status = 'low' OR OLD.status = 'out') THEN
        UPDATE low_stock_alerts 
        SET resolved = true, resolved_at = NOW()
        WHERE product_id = NEW.id AND resolved = false;
    END IF;
END$$
DELIMITER ;

-- Trigger para registrar actividad cuando se crea un usuario
DELIMITER $$
CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO activity_logs (user_id, action, description)
    VALUES (NEW.id, 'user_create', CONCAT('Usuario creado: ', NEW.name));
END$$
DELIMITER ;

-- Trigger para actualizar automáticamente el estado del producto
DELIMITER $$
CREATE TRIGGER before_product_update
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
    -- Actualizar estado basado en el stock y stock mínimo
    IF NEW.stock = 0 THEN
        SET NEW.status = 'out';
    ELSEIF NEW.stock <= NEW.min_stock THEN
        SET NEW.status = 'low';
    ELSE
        SET NEW.status = 'active';
    END IF;
END$$
DELIMITER ;

-- Insertar datos de ejemplo para pruebas
INSERT INTO products (code, name, description, price, stock, min_stock, category_id, unit_id) VALUES
('ARROZ001', 'Arroz Diana 1kg', 'Arroz blanco de grano largo', 3500.00, 45, 10, 1, 1),
('ACEITE001', 'Aceite Gourmet 1L', 'Aceite vegetal refinado', 8900.00, 8, 15, 1, 1),
('LECHE001', 'Leche Alquería 1L', 'Leche entera pasteurizada', 4200.00, 60, 20, 3, 1),
('GASEOSA001', 'Gaseosa Coca-Cola 2L', 'Refresco de cola', 5500.00, 0, 25, 2, 1),
('DETERGENTE001', 'Detergente Ariel 1kg', 'Detergente en polvo para lavadora', 12000.00, 30, 10, 4, 1),
('HUEVOS001', 'Huevos Rojos x30', 'Huevos de gallina rojos', 15000.00, 25, 20, 7, 1),
('CARNE001', 'Carne Molida 500g', 'Carne molida de res', 12500.00, 15, 10, 6, 1),
('YOGURT001', 'Yogurt Alpina 1kg', 'Yogurt natural', 7800.00, 12, 8, 3, 1),
('PAPEL001', 'Papel Higiénico x4', 'Papel higiénico suave', 6500.00, 5, 15, 4, 1),
('AZUCAR001', 'Azúcar Manuelita 1kg', 'Azúcar blanca refinada', 3200.00, 35, 20, 1, 1),
('SAL001', 'Sal Yodada 500g', 'Sal con yodo', 1800.00, 40, 15, 1, 1),
('CAFE001', 'Café Sello Rojo 250g', 'Café molido', 9500.00, 18, 10, 1, 1),
('CHOCOLATE001', 'Chocolate Corona 250g', 'Chocolate para repostería', 7800.00, 0, 12, 1, 1),
('ATUN001', 'Atún Van Camps 170g', 'Atún en agua', 4200.00, 22, 15, 1, 1),
('SARDINAS001', 'Sardinas La Calvo 155g', 'Sardinas en aceite', 3800.00, 17, 12, 1, 1);

-- Insertar movimientos de ejemplo
INSERT INTO inventory_movements (product_id, user_id, type, quantity, previous_stock, new_stock, reason, notes) VALUES
(1, 1, 'entry', 50, 0, 50, 'Compra inicial', 'Primera compra del producto'),
(2, 1, 'entry', 20, 0, 20, 'Compra inicial', 'Primera compra del producto'),
(3, 1, 'entry', 80, 0, 80, 'Compra inicial', 'Primera compra del producto'),
(4, 1, 'entry', 30, 0, 30, 'Compra inicial', 'Primera compra del producto'),
(1, 1, 'exit', 5, 50, 45, 'Venta', 'Venta al cliente #1001'),
(2, 1, 'exit', 12, 20, 8, 'Venta', 'Venta al cliente #1002'),
(4, 1, 'exit', 30, 30, 0, 'Venta', 'Venta al cliente #1003'),
(5, 1, 'entry', 40, 0, 40, 'Compra inicial', 'Primera compra del producto'),
(5, 1, 'exit', 10, 40, 30, 'Venta', 'Venta al cliente #1004');

-- Insertar usuarios de ejemplo
INSERT INTO users (name, email, password, role_id, status) VALUES
('Empleado 1', 'empleado1@inventorypro.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, 'active'),
('Visualizador', 'viewer@inventorypro.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, 'active');

-- Insertar proveedores de ejemplo
INSERT INTO suppliers (name, contact_person, phone, email, address, status) VALUES
('Almacenes Éxito S.A.', 'Juan Pérez', '3101234567', 'juan.perez@exito.com', 'Calle 100 #20-30, Bogotá', 'active'),
('Alkosto S.A.', 'María López', '3157654321', 'maria.lopez@alkosto.com', 'Carrera 15 #95-45, Bogotá', 'active'),
('D1 S.A.', 'Carlos Gómez', '3112345678', 'carlos.gomez@d1.com.co', 'Avenida Boyacá #70-25, Bogotá', 'active');

-- Insertar ventas de ejemplo
INSERT INTO sales (user_id, total_amount, payment_method, notes) VALUES
(1, 25000.00, 'cash', 'Venta de varios productos'),
(1, 18500.00, 'card', 'Venta con tarjeta de crédito'),
(2, 32000.00, 'cash', 'Venta grande de abarrotes');

-- Insertar detalles de ventas de ejemplo
INSERT INTO sale_details (sale_id, product_id, quantity, unit_price) VALUES
(1, 1, 3, 3500.00),
(1, 3, 2, 4200.00),
(1, 5, 1, 12000.00),
(2, 2, 1, 8900.00),
(2, 6, 1, 15000.00),
(3, 1, 5, 3500.00),
(3, 2, 1, 8900.00),
(3, 10, 2, 3200.00);

-- Crear función para obtener productos con stock bajo
DELIMITER $$
CREATE FUNCTION count_low_stock_products()
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE count_low INT;
    
    SELECT COUNT(*) INTO count_low
    FROM products
    WHERE stock <= min_stock AND stock > 0;
    
    RETURN COALESCE(count_low, 0);
END$$
DELIMITER ;

-- Crear función para obtener productos agotados
DELIMITER $$
CREATE FUNCTION count_out_of_stock_products()
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE count_out INT;
    
    SELECT COUNT(*) INTO count_out
    FROM products
    WHERE stock = 0;
    
    RETURN COALESCE(count_out, 0);
END$$
DELIMITER ;

-- Procedimiento para generar reporte de inventario completo
DELIMITER $$
CREATE PROCEDURE generate_inventory_report()
BEGIN
    SELECT 
        p.code,
        p.name,
        c.name AS category,
        u.name AS unit,
        p.stock,
        p.min_stock,
        p.price,
        (p.stock * p.price) AS total_value,
        p.status
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN units u ON p.unit_id = u.id
    ORDER BY c.name, p.name;
END$$
DELIMITER ;

-- Procedimiento para generar reporte de movimientos por rango de fechas
DELIMITER $$
CREATE PROCEDURE generate_movements_report(
    IN start_date DATE,
    IN end_date DATE
)
BEGIN
    SELECT 
        m.created_at AS movement_date,
        m.type,
        p.code AS product_code,
        p.name AS product_name,
        m.quantity,
        m.previous_stock,
        m.new_stock,
        m.reason,
        u.name AS user_name
    FROM inventory_movements m
    JOIN products p ON m.product_id = p.id
    JOIN users u ON m.user_id = u.id
    WHERE DATE(m.created_at) BETWEEN start_date AND end_date
    ORDER BY m.created_at DESC;
END$$
DELIMITER ;

-- Crear evento para limpiar alertas resueltas antiguas
DELIMITER $$
CREATE EVENT IF NOT EXISTS clean_old_resolved_alerts
ON SCHEDULE EVERY 1 MONTH
DO
BEGIN
    DELETE FROM low_stock_alerts 
    WHERE resolved = true AND resolved_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);
END$$
DELIMITER ;

-- Habilitar eventos
SET GLOBAL event_scheduler = ON;

-- Insertar configuraciones adicionales
INSERT INTO system_config (config_key, config_value, description) VALUES
('business.name', 'Mi Tienda de Abarrotes', 'Nombre del negocio'),
('business.address', 'Calle Principal #123, Ciudad', 'Dirección del negocio'),
('business.phone', '3101234567', 'Teléfono del negocio'),
('business.email', 'contacto@mitienda.com', 'Correo electrónico del negocio'),
('report.sender_email', 'noreply@inventorypro.com', 'Correo remitente para reportes'),
('backup.path', '/backups/', 'Ruta para almacenar respaldos'),
('log.level', 'info', 'Nivel de logueo (debug, info, warning, error)');

-- Otorgar permisos a un usuario de base de datos dedicado (ejecutar como root)
-- CREATE USER 'inventory_user'@'localhost' IDENTIFIED BY 'secure_password_123';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON inventorypro.* TO 'inventory_user'@'localhost';
-- FLUSH PRIVILEGES;
