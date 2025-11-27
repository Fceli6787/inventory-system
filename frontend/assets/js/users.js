// =====================================================
// InventoryPro - Users Management Script
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    loadUserStats();
    initEventListeners();
});

let usersData = [];

// Initialize event listeners
function initEventListeners() {
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', handleUserSubmit);
    }

    // Reset form on modal close
    const userModal = document.getElementById('userModal');
    if (userModal) {
        userModal.addEventListener('hidden.bs.modal', resetForm);
    }
}

// Load users
async function loadUsers() {
    try {
        // TODO: Replace with actual API call
        // const response = await apiCall(API_ENDPOINTS.USERS);
        
        // Simulated users data
        usersData = [
            {
                id: 1,
                name: 'Juan Pérez',
                email: 'admin@inventorypro.com',
                role: 'admin',
                phone: '3001234567',
                active: true,
                lastLogin: '2025-11-27 13:30'
            },
            {
                id: 2,
                name: 'María García',
                email: 'maria@inventorypro.com',
                role: 'empleado',
                phone: '3007654321',
                active: true,
                lastLogin: '2025-11-27 10:15'
            },
            {
                id: 3,
                name: 'Carlos Rodríguez',
                email: 'carlos@inventorypro.com',
                role: 'empleado',
                phone: '3009876543',
                active: true,
                lastLogin: '2025-11-26 16:45'
            },
            {
                id: 4,
                name: 'Ana Martínez',
                email: 'ana@inventorypro.com',
                role: 'visualizador',
                phone: '3005551234',
                active: false,
                lastLogin: '2025-11-20 09:00'
            },
            {
                id: 5,
                name: 'Luis Ramírez',
                email: 'luis@inventorypro.com',
                role: 'empleado',
                phone: '3001112233',
                active: true,
                lastLogin: '2025-11-27 08:20'
            }
        ];

        displayUsers(usersData);
        loadUserStats();
    } catch (error) {
        console.error('Error loading users:', error);
        showToast('Error al cargar usuarios', 'error');
    }
}

// Load user statistics
function loadUserStats() {
    const totalUsers = usersData.length;
    const activeUsers = usersData.filter(u => u.active).length;
    const inactiveUsers = usersData.filter(u => !u.active).length;

    const totalElement = document.getElementById('totalUsers');
    const activeElement = document.getElementById('activeUsers');
    const inactiveElement = document.getElementById('inactiveUsers');

    if (totalElement) totalElement.textContent = totalUsers;
    if (activeElement) activeElement.textContent = activeUsers;
    if (inactiveElement) inactiveElement.textContent = inactiveUsers;
}

// Display users
function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    if (users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-5">
                    <i class="fas fa-users fa-3x mb-3 d-block"></i>
                    <p>No hay usuarios registrados</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = users.map(user => {
        const roleBadge = getRoleBadge(user.role);
        const statusBadge = user.active 
            ? '<span class="badge bg-success"><i class="fas fa-check-circle me-1"></i>Activo</span>'
            : '<span class="badge bg-danger"><i class="fas fa-times-circle me-1"></i>Inactivo</span>';

        return `
            <tr>
                <td><strong>${user.id}</strong></td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-circle bg-primary bg-opacity-10 text-primary me-2">
                            ${user.name.charAt(0).toUpperCase()}
                        </div>
                        <strong>${user.name}</strong>
                    </div>
                </td>
                <td>
                    <i class="fas fa-envelope text-muted me-1"></i>
                    ${user.email}
                </td>
                <td>${roleBadge}</td>
                <td>${statusBadge}</td>
                <td>
                    <small class="text-muted">
                        <i class="fas fa-clock me-1"></i>
                        ${user.lastLogin}
                    </small>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-primary" onclick="editUser(${user.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-info" onclick="viewUser(${user.id})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Get role badge
function getRoleBadge(role) {
    const badges = {
        'admin': '<span class="badge bg-danger"><i class="fas fa-crown me-1"></i>Administrador</span>',
        'empleado': '<span class="badge bg-primary"><i class="fas fa-user me-1"></i>Empleado</span>',
        'visualizador': '<span class="badge bg-secondary"><i class="fas fa-eye me-1"></i>Visualizador</span>'
    };
    return badges[role] || `<span class="badge bg-secondary">${role}</span>`;
}

// Handle form submission
async function handleUserSubmit(e) {
    e.preventDefault();

    const userId = document.getElementById('userId').value;
    const userData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        role: document.getElementById('userRole').value,
        phone: document.getElementById('userPhone').value,
        active: document.getElementById('userActive').checked
    };

    // Only include password if it's provided
    const password = document.getElementById('userPassword').value;
    if (password) {
        userData.password = password;
    }

    try {
        if (userId) {
            // Update user
            // await apiCall(API_ENDPOINTS.USER_BY_ID(userId), 'PUT', userData);
            console.log('Updating user:', userId, userData);
            
            // Update local data
            const index = usersData.findIndex(u => u.id == userId);
            if (index !== -1) {
                usersData[index] = { ...usersData[index], ...userData };
            }
            
            showToast('Usuario actualizado exitosamente', 'success');
        } else {
            // Create new user
            // await apiCall(API_ENDPOINTS.USERS, 'POST', userData);
            console.log('Creating user:', userData);
            
            // Add to local data
            const newUser = {
                id: usersData.length + 1,
                ...userData,
                lastLogin: 'Nunca'
            };
            usersData.push(newUser);
            
            showToast('Usuario creado exitosamente', 'success');
        }

        // Close modal and reload
        const modal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
        if (modal) modal.hide();
        
        displayUsers(usersData);
        loadUserStats();
    } catch (error) {
        console.error('Error saving user:', error);
        showToast('Error al guardar usuario', 'error');
    }
}

// Edit user
function editUser(id) {
    const user = usersData.find(u => u.id === id);
    if (!user) return;

    // Fill form
    document.getElementById('userId').value = user.id;
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userPassword').value = ''; // Don't show password
    document.getElementById('userPassword').placeholder = 'Dejar vacío para mantener contraseña actual';
    document.getElementById('userRole').value = user.role;
    document.getElementById('userPhone').value = user.phone || '';
    document.getElementById('userActive').checked = user.active;

    // Change modal title
    document.getElementById('userModalTitle').textContent = 'Editar Usuario';

    // Make password optional for edit
    document.getElementById('userPassword').required = false;

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
}

// View user details
function viewUser(id) {
    const user = usersData.find(u => u.id === id);
    if (!user) return;

    const details = `
        <strong>ID:</strong> ${user.id}<br>
        <strong>Nombre:</strong> ${user.name}<br>
        <strong>Email:</strong> ${user.email}<br>
        <strong>Rol:</strong> ${user.role}<br>
        <strong>Teléfono:</strong> ${user.phone || 'N/A'}<br>
        <strong>Estado:</strong> ${user.active ? 'Activo' : 'Inactivo'}<br>
        <strong>Última conexión:</strong> ${user.lastLogin}
    `;

    // Simple alert for now - you can create a custom modal for better UX
    const modalContent = `
        <div style="text-align: left;">
            ${details}
        </div>
    `;
    
    alert(`Detalles del Usuario:\n\n${user.name}\n${user.email}\nRol: ${user.role}\nEstado: ${user.active ? 'Activo' : 'Inactivo'}`);
}

// Delete user
async function deleteUser(id) {
    const user = usersData.find(u => u.id === id);
    if (!user) return;
    
    if (!confirm(`¿Estás seguro de eliminar al usuario "${user.name}"?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }

    try {
        // await apiCall(API_ENDPOINTS.USER_BY_ID(id), 'DELETE');
        console.log('Deleting user:', id);
        
        // Remove from local data
        usersData = usersData.filter(u => u.id !== id);
        
        showToast('Usuario eliminado exitosamente', 'success');
        displayUsers(usersData);
        loadUserStats();
    } catch (error) {
        console.error('Error deleting user:', error);
        showToast('Error al eliminar usuario', 'error');
    }
}

// Reset form
function resetForm() {
    const form = document.getElementById('userForm');
    if (form) form.reset();
    
    document.getElementById('userId').value = '';
    document.getElementById('userModalTitle').textContent = 'Nuevo Usuario';
    document.getElementById('userPassword').required = true;
    document.getElementById('userPassword').placeholder = 'Mínimo 8 caracteres';
}

// Simple toast notification
function showToast(message, type = 'success') {
    // For now, using alert - you can implement a proper toast later
    alert(message);
}
