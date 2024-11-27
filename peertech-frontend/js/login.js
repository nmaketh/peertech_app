
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        console.log('Submitting login form', { email, password });

        fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            console.log('Response received', response);
            if (!response.ok) {
                return response.text().then(text => { 
                    console.error('Error response text:', text);
                    throw new Error(text);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received', data);
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('studentId', data.userId); // Store studentId in local storage
                const userRole = parseJwt(data.token).user.role;
                console.log('User role:', userRole); // Add this line for debugging
                if (userRole === 'student') {
                    window.location.href = 'student-dashboard.html';
                } else if (userRole === 'teacher') {
                    window.location.href = 'teacher-dashboard.html';
                } else if (userRole === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                }
            } else {
                loginMessage.innerHTML = `<div class="alert alert-danger">${data.msg}</div>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            loginMessage.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
        });
    });

    function parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }
});
