# 📦 InventoryPro - Sistema de Gestión de Inventario

Sistema completo de gestión de inventario desarrollado con PHP nativo y arquitectura separada Frontend/Backend. Diseñado específicamente para tiendas de abarrotes con dashboard analítico y control de stock en tiempo real.

## ✨ Características Principales

- **Gestión completa de productos**: CRUD con imágenes, categorías y códigos de barras
- **Control de inventario**: Entradas, salidas y seguimiento de movimientos
- **Alertas automáticas**: Notificaciones cuando productos están por agotarse
- **Dashboard analítico**: Gráficas de productos más vendidos y valor total del inventario
- **Sistema de usuarios**: Roles diferenciados (Admin, Empleado, Visualizador)
- **API RESTful**: Backend completamente separado que responde en JSON
- **Reportes exportables**: Generación de reportes en PDF y Excel
- **Diseño responsive**: Interfaz adaptable a todos los dispositivos

## 🛠️ Tecnologías Utilizadas

### Backend
- PHP 8.x (Vanilla - sin frameworks)
- MySQL/MariaDB
- PDO para conexión segura a base de datos
- Arquitectura MVC personalizada
- API RESTful

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5
- Vanilla JS
- Chart.js para visualización de datos
- Fetch API para comunicación con backend

## 📁 Estructura del Proyecto

```
inventory-system/
├── LICENSE
├── README.md
├── inventorypro.sql
├── .gitignore
├── backend/
│   └── app/
│       ├── Controllers/
│       │   ├── AuthController.php
│       │   ├── DashboardController.php
│       │   ├── InventoryController.php
│       │   ├── ProductController.php
│       │   ├── ReportController.php
│       │   └── UserController.php
│       ├── Models/
│       │   ├── Category.php
│       │   ├── InventoryMovement.php
│       │   ├── Product.php
│       │   └── User.php
│       ├── Middleware/
│       │   └── AuthMiddleware.php
│       ├── Services/
│       │   ├── ExcelGenerator.php
│       │   └── PdfGenerator.php
│       ├── core/
│       │   ├── Database.php
│       │   ├── Router.php
│       │   ├── Request.php
│       │   └── Response.php
│       ├── config/
│       │   └── database.php
│       └── public/
│           └── index.php
└── frontend/
    ├── index.html
    ├── dashboard.html
    ├── inventory.html
    ├── products.html
    ├── reports.html
    ├── users.html
    └── assets/
        ├── css/
        │   └── style.css
        ├── js/
        │   ├── auth.js
        │   ├── config.js
        │   ├── dashboard.js
        │   ├── inventory.js
        │   ├── login.js
        │   ├── products.js
        │   ├── reports.js
        │   ├── sidebar.js
        │   └── users.js
        └── img/
            └── products/
```

## 🚀 Instalación

### Requisitos previos
- PHP 8.0 o superior
- MySQL 5.7+ / MariaDB 10.3+
- Servidor web (Apache/Nginx)
- Composer (para dependencias de reportes)

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/fceli6787/inventory-system.git
cd inventory-system
```

2. **Instalar dependencias PHP (para reportes)**
```bash
composer require dompdf/dompdf phpoffice/phpspreadsheet
```

3. **Configurar base de datos**
```bash
# Importar el esquema de base de datos
mysql -u root -p < inventorypro.sql
```

4. **Configurar archivo de conexión**
```bash
# Editar backend/app/config/database.php con tus credenciales
cp backend/app/config/database.example.php backend/app/config/database.php
```

5. **Configurar permisos para reportes**
```bash
mkdir -p frontend/assets/reports
chmod -R 775 frontend/assets/reports
```

6. **Configurar servidor web**
- Apuntar el DocumentRoot a `backend/app/public/` para la API
- Configurar un alias o virtual host para el frontend

7. **Iniciar el servidor**
```bash
# Opción 1: Servidor incorporado de PHP
php -S localhost:8000 -t backend/app/public/

# Opción 2: XAMPP/WAMP/LAMP
# Colocar proyecto en htdocs/www
```

## 📖 Uso

### Acceso a la aplicación
- Frontend: `http://localhost/frontend/`
- Backend API: `http://localhost:8000/api/`

### Credenciales por defecto
```
Usuario: admin@inventorypro.com
Contraseña: admin123
```

### Endpoints principales de la API

**Autenticación**
```
POST   /api/auth/login           # Iniciar sesión
POST   /api/auth/logout          # Cerrar sesión
GET    /api/auth/check           # Verificar estado de autenticación
```

**Productos**
```
GET    /api/products             # Listar todos los productos
GET    /api/products/{id}        # Obtener producto específico
POST   /api/products             # Crear nuevo producto
PUT    /api/products/{id}        # Actualizar producto
DELETE /api/products/{id}        # Eliminar producto
GET    /api/products/categories  # Listar categorías
GET    /api/products/units       # Listar unidades de medida
GET    /api/products/low-stock   # Productos con stock bajo
```

**Inventario**
```
GET    /api/inventory            # Estado actual del inventario
POST   /api/inventory/entry      # Registrar entrada de mercancía
POST   /api/inventory/exit       # Registrar salida de mercancía
GET    /api/inventory/movements  # Histórico de movimientos
```

**Dashboard**
```
GET    /api/dashboard/stats              # Estadísticas resumen
GET    /api/dashboard/inventory-chart    # Datos para gráfico de inventario
GET    /api/dashboard/categories-chart   # Datos para gráfico de categorías
GET    /api/dashboard/recent-activity    # Actividad reciente
GET    /api/dashboard/low-stock          # Alertas de stock bajo
```

**Reportes**
```
POST   /api/reports/generate     # Generar reporte personalizado
GET    /api/reports/analytics    # Obtener datos analíticos
```

**Usuarios**
```
GET    /api/users                # Listar todos los usuarios
GET    /api/users/{id}           # Obtener usuario específico
POST   /api/users                # Crear nuevo usuario
PUT    /api/users/{id}           # Actualizar usuario
DELETE /api/users/{id}           # Eliminar usuario
GET    /api/users/roles          # Listar roles disponibles
GET    /api/users/profile        # Obtener perfil del usuario actual
PUT    /api/users/profile        # Actualizar perfil del usuario
```

## 🎯 Roadmap

- [x] Arquitectura base MVC
- [x] CRUD de productos
- [x] Sistema de autenticación
- [x] Control de inventario
- [x] Dashboard analítico
- [x] Reportes en PDF y Excel
- [ ] Módulo de proveedores
- [ ] Integración con código de barras
- [ ] API mobile

## 👤 Autor

**Andres Felipe Celi Jimenez**
- GitHub: [fceli6787](https://github.com/fceli6787)
- LinkedIn: [www.linkedin.com/in/andres-felipe-celi-jimenez-a12a191a7](https://www.linkedin.com/in/andres-felipe-celi-jimenez-a12a191a7)
- Email: fceli6787@gmail.com

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

Proyecto desarrollado como parte de mi portafolio profesional para demostrar habilidades en:
- Arquitectura de software
- Desarrollo Full-Stack con PHP nativo
- Diseño de APIs RESTful
- Patrones de diseño MVC
