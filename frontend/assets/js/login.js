document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Handle login
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            // TODO: Replace with actual API call
            // const response = await apiCall(API_ENDPOINTS.LOGIN, 'POST', { email, password });
            
            // Simulated login for now
            if (email === 'admin@inventorypro.com' && password === 'admin123') {
                // Save token
                localStorage.setItem('token', 'fake-jwt-token');
                localStorage.setItem('user', JSON.stringify({ name: 'Admin', role: 'admin' }));
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                alert('Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Error al iniciar sesión');
        }
    });
});
