document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');

    const verifyEmailForm = document.getElementById('verify-email-form');

    verifyEmailForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const verificationCode = document.getElementById('verification-code').value;

        // Simulate verification process
        if (verificationCode === '123456') { // Assuming '123456' is the verification code sent to the email
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(user => user.email === email);
            if (userIndex !== -1) {
                users[userIndex].verified = true;
                localStorage.setItem('users', JSON.stringify(users));
                alert('Email verified successfully. You can now log in.');
                window.location.href = 'login.html';
            } else {
                alert('User not found.');
            }
        } else {
            alert('Invalid verification code.');
        }
    });
});