
document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form');
    const registerMessage = document.getElementById('register-message');

    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const role = document.getElementById('register-role').value;
        const fullName = document.getElementById('register-fullname').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        if (password !== confirmPassword) {
            registerMessage.innerHTML = `<div class="alert alert-danger">Passwords do not match</div>`;
            return;
        }

        console.log('Submitting registration', { role, fullName, email, password });

        fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role, fullName, email, password })
        })
        .then(response => {
            console.log('Response received', response);
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received', data);
            registerMessage.innerHTML = `<div class="alert alert-success">Registration successful!</div>`;
        })
        .catch(error => {
            console.error('Error:', error);
            registerMessage.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
        });
    });
});
