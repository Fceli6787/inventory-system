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
- Bootstrap 5 / Tailwind CSS (CDN)
- Alpine.js / Vanilla JS
- Chart.js para visualización de datos
- Fetch API para comunicación con backend

## 📁 Estructura del Proyecto

```
inventory-system/
├── backend/              # API PHP
│   ├── app/
│   │   ├── Controllers/
│   │   ├── Models/
│   │   ├── Middleware/
│   │   └── Services/
│   ├── config/
│   ├── core/
│   └── public/
├── frontend/            # Interfaz de usuario
│   ├── assets/
│   ├── pages/
│   └── components/
├── docs/
└── README.md
```

## 🚀 Instalación

### Requisitos previos
- PHP 8.0 o superior
- MySQL 5.7+ / MariaDB 10.3+
- Servidor web (Apache/Nginx)
- Composer (opcional)

### Pasos de instalación

1. **Clonar el repositorio**
```
git clone https://github.com/fceli6787/inventory-system.git
cd inventory-system
```

2. **Configurar base de datos**
```
# Importar el esquema de base de datos
mysql -u root -p < database/schema.sql
```

3. **Configurar archivo de conexión**
```
# Editar backend/config/database.php con tus credenciales
cp backend/config/database.example.php backend/config/database.php
```

4. **Configurar servidor web**
- Apuntar el DocumentRoot a `backend/public/` para la API
- Configurar virtual host para el frontend

5. **Iniciar el servidor**
```
# Opción 1: Servidor incorporado de PHP
php -S localhost:8000 -t backend/public/

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

```
GET    /api/products           # Listar todos los productos
POST   /api/products           # Crear nuevo producto
GET    /api/products/{id}      # Obtener producto específico
PUT    /api/products/{id}      # Actualizar producto
DELETE /api/products/{id}      # Eliminar producto

GET    /api/inventory          # Estado del inventario
POST   /api/inventory/entry    # Registrar entrada de mercancía
POST   /api/inventory/exit     # Registrar salida de mercancía

GET    /api/reports/dashboard  # Datos para dashboard
GET    /api/reports/low-stock  # Productos con stock bajo
```

## 🎯 Roadmap

- [x] Arquitectura base MVC
- [x] CRUD de productos
- [x] Sistema de autenticación
- [ ] Implementar reportes PDF
- [ ] Módulo de proveedores
- [ ] Integración con código de barras
- [ ] API mobile

## 👤 Autor

**Andres Felipe Celi Jimenez**
- GitHub: fceli6787(https://github.com/fceli6787)
- LinkedIn: www.linkedin.com/in/andres-felipe-celi-jimenez-a12a191a7
- Email: fceli6787@gmail.com

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🙏 Agradecimientos

Proyecto desarrollado como parte de mi portafolio profesional para demostrar habilidades en:
- Arquitectura de software
- Desarrollo Full-Stack con PHP nativo
- Diseño de APIs RESTful
- Patrones de diseño MVC
```
