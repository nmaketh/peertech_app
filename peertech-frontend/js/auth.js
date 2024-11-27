document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const registerMessage = document.getElementById('register-message');
    const loginMessage = document.getElementById('login-message');

    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fullName, email, password, role })
            })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    registerMessage.textContent = 'Registration successful!';
                    registerMessage.style.color = 'green';
                } else {
                    registerMessage.textContent = data.errors ? data.errors[0].msg : 'Registration failed';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                registerMessage.textContent = 'Registration failed';
            });
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    loginMessage.textContent = 'Login successful!';
                    loginMessage.style.color = 'green';
                    window.location.href = 'dashboard.html';
                } else {
                    loginMessage.textContent = data.errors ? data.errors[0].msg : 'Login failed';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                loginMessage.textContent = 'Login failed';
            });
        });
    }
});