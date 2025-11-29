<?php
class Router {
    private $routes = [];
    private $request;
    
    public function __construct(Request $request) {
        $this->request = $request;
    }
    
    public function add($method, $uri, $controller, $action, $middleware = null) {
        // Reemplazar parámetros {id} con expresión regular
        $uri = preg_replace('/\{id\}/', '([0-9]+)', $uri);
        $uri = str_replace('/', '\/', $uri);
        $this->routes[$method][$uri] = [
            'controller' => $controller,
            'action' => $action,
            'middleware' => $middleware
        ];
    }
    
    public function dispatch() {
        $method = $this->request->getMethod();
        $path = $this->request->getPath();
        
        // Verificar si el método tiene rutas definidas
        if (!isset($this->routes[$method])) {
            http_response_code(405);
            Response::json(['error' => 'Método no permitido']);
            return;
        }
        
        foreach ($this->routes[$method] as $uri => $handler) {
            if (preg_match("#^{$uri}$#i", $path, $matches)) {
                array_shift($matches); // Eliminar coincidencia completa
                
                // Ejecutar middleware si existe
                if ($handler['middleware']) {
                    $middlewareClass = $handler['middleware'][0];
                    $middlewareMethod = $handler['middleware'][1];
                    
                    $middleware = new $middlewareClass();
                    if (method_exists($middleware, $middlewareMethod)) {
                        call_user_func_array([$middleware, $middlewareMethod], [$this->request]);
                    }
                }
                
                // Crear instancia del controlador
                $controllerName = "App\\Controllers\\{$handler['controller']}";
                $controller = new $controllerName();
                
                // Ejecutar acción
                $action = $handler['action'];
                if (empty($matches)) {
                    call_user_func([$controller, $action], $this->request);
                } else {
                    call_user_func_array([$controller, $action], array_merge($matches, [$this->request]));
                }
                
                return;
            }
        }
        
        http_response_code(404);
        Response::json(['error' => 'Ruta no encontrada']);
    }
}