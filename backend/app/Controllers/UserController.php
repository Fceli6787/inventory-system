<?php
namespace App\Controllers;

use App\Models\User;
use App\Models\Role;
use Response;
use Request;

class UserController {
    private $userModel;
    private $roleModel;
    
    public function __construct() {
        $this->userModel = new User();
        $this->roleModel = new Role();
    }
    
    public function index() {
        $users = $this->userModel->getAllUsers();
        
        // Formatear para el frontend
        $formattedUsers = [];
        foreach ($users as $user) {
            $formattedUsers[] = [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => [
                    'id' => $user['role_id'],
                    'name' => $user['role_name'],
                    'description' => $user['role_description']
                ],
                'status' => $user['status'],
                'status_text' => $user['status'] === 'active' ? 'Activo' : 'Inactivo',
                'created_at' => date('d/m/Y', strtotime($user['created_at']))
            ];
        }
        
        Response::json($formattedUsers);
    }
    
    public function show($id) {
        $user = $this->userModel->find($id);
        
        if (!$user) {
            http_response_code(404);
            Response::json(['error' => 'Usuario no encontrado']);
            return;
        }
        
        $role = $this->roleModel->find($user['role_id']);
        
        $formattedUser = [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role_id' => $user['role_id'],
            'role_name' => $role['name'] ?? 'Sin rol',
            'status' => $user['status'],
            'created_at' => date('d/m/Y H:i:s', strtotime($user['created_at'])),
            'updated_at' => date('d/m/Y H:i:s', strtotime($user['updated_at']))
        ];
        
        Response::json($formattedUser);
    }
    
    public function store(Request $request) {
        $data = $request->getBody();
        
        // Validaciones
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            Response::json(['error' => 'Nombre, email y contraseña son requeridos']);
            return;
        }
        
        // Verificar si el email ya existe
        if ($this->userModel->emailExists($data['email'])) {
            http_response_code(400);
            Response::json(['error' => 'El email ya está en uso']);
            return;
        }
        
        // Validar rol
        $roleId = isset($data['role_id']) ? (int)$data['role_id'] : 2; // Por defecto empleado
        $validRoles = [1, 2, 3]; // admin, employee, viewer
        if (!in_array($roleId, $validRoles)) {
            $roleId = 2;
        }
        
        $userData = [
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => password_hash($data['password'], PASSWORD_DEFAULT),
            'role_id' => $roleId,
            'status' => $data['status'] ?? 'active'
        ];
        
        $id = $this->userModel->create($userData);
        $user = $this->userModel->find($id);
        $role = $this->roleModel->find($user['role_id']);
        
        Response::json([
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => [
                    'id' => $role['id'],
                    'name' => $role['name']
                ],
                'status' => $user['status'],
                'created_at' => date('d/m/Y H:i:s', strtotime($user['created_at']))
            ]
        ]);
    }
    
    public function update($id, Request $request) {
        $user = $this->userModel->find($id);
        if (!$user) {
            http_response_code(404);
            Response::json(['error' => 'Usuario no encontrado']);
            return;
        }
        
        $data = $request->getBody();
        
        // Validar email único (excepto para el usuario actual)
        if (isset($data['email']) && $data['email'] !== $user['email']) {
            if ($this->userModel->emailExists($data['email'])) {
                http_response_code(400);
                Response::json(['error' => 'El email ya está en uso']);
                return;
            }
        }
        
        // Validar rol
        if (isset($data['role_id'])) {
            $validRoles = [1, 2, 3];
            if (!in_array((int)$data['role_id'], $validRoles)) {
                http_response_code(400);
                Response::json(['error' => 'Rol no válido']);
                return;
            }
        }
        
        // Si se actualiza la contraseña
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        } else {
            unset($data['password']);
        }
        
        $updateData = [
            'name' => $data['name'] ?? $user['name'],
            'email' => $data['email'] ?? $user['email'],
            'role_id' => $data['role_id'] ?? $user['role_id'],
            'status' => $data['status'] ?? $user['status']
        ];
        
        if (isset($data['password'])) {
            $updateData['password'] = $data['password'];
        }
        
        $this->userModel->update($id, $updateData);
        $updatedUser = $this->userModel->find($id);
        $role = $this->roleModel->find($updatedUser['role_id']);
        
        Response::json([
            'success' => true,
            'user' => [
                'id' => $updatedUser['id'],
                'name' => $updatedUser['name'],
                'email' => $updatedUser['email'],
                'role' => [
                    'id' => $role['id'],
                    'name' => $role['name']
                ],
                'status' => $updatedUser['status'],
                'updated_at' => date('d/m/Y H:i:s', strtotime($updatedUser['updated_at']))
            ]
        ]);
    }
    
    public function destroy($id) {
        $user = $this->userModel->find($id);
        if (!$user) {
            http_response_code(404);
            Response::json(['error' => 'Usuario no encontrado']);
            return;
        }
        
        // No permitir eliminar al usuario admin principal (id=1)
        if ($user['id'] == 1) {
            http_response_code(403);
            Response::json(['error' => 'No se puede eliminar el usuario administrador principal']);
            return;
        }
        
        $this->userModel->delete($id);
        
        Response::json([
            'success' => true,
            'message' => 'Usuario eliminado correctamente'
        ]);
    }
    
    public function roles() {
        $roles = $this->roleModel->all();
        
        $formattedRoles = [];
        foreach ($roles as $role) {
            $formattedRoles[] = [
                'id' => $role['id'],
                'name' => $role['name'],
                'description' => $role['description'],
                'created_at' => date('d/m/Y', strtotime($role['created_at']))
            ];
        }
        
        Response::json($formattedRoles);
    }
    
    public function profile(Request $request) {
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            Response::json(['error' => 'No autenticado']);
            return;
        }
        
        $user = $this->userModel->find($_SESSION['user_id']);
        if (!$user) {
            http_response_code(404);
            Response::json(['error' => 'Usuario no encontrado']);
            return;
        }
        
        unset($user['password']);
        $role = $this->roleModel->find($user['role_id']);
        $user['role'] = $role['name'];
        
        Response::json($user);
    }
    
    public function updateProfile(Request $request) {
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            Response::json(['error' => 'No autenticado']);
            return;
        }
        
        $userId = $_SESSION['user_id'];
        $user = $this->userModel->find($userId);
        if (!$user) {
            http_response_code(404);
            Response::json(['error' => 'Usuario no encontrado']);
            return;
        }
        
        $data = $request->getBody();
        
        // Validar email único (excepto para el usuario actual)
        if (isset($data['email']) && $data['email'] !== $user['email']) {
            if ($this->userModel->emailExists($data['email'])) {
                http_response_code(400);
                Response::json(['error' => 'El email ya está en uso']);
                return;
            }
        }
        
        $updateData = [
            'name' => $data['name'] ?? $user['name'],
            'email' => $data['email'] ?? $user['email']
        ];
        
        // Si se actualiza la contraseña
        if (isset($data['current_password']) && isset($data['new_password'])) {
            if (!password_verify($data['current_password'], $user['password'])) {
                http_response_code(400);
                Response::json(['error' => 'Contraseña actual incorrecta']);
                return;
            }
            
            $updateData['password'] = password_hash($data['new_password'], PASSWORD_DEFAULT);
        }
        
        $this->userModel->update($userId, $updateData);
        $updatedUser = $this->userModel->find($userId);
        unset($updatedUser['password']);
        
        Response::json([
            'success' => true,
            'user' => $updatedUser,
            'message' => 'Perfil actualizado correctamente'
        ]);
    }
}