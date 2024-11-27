
document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // Ensure userId is stored in local storage

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Fetch and display users
    function fetchUsers() {
        fetch('http://localhost:5000/api/admin/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = 'login.html';
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const adminContent = document.getElementById('admin-content');
            adminContent.innerHTML = '<h2>Users</h2>';
            data.forEach(user => {
                const userElement = document.createElement('div');
                userElement.innerHTML = `
                    <p>${user.name} (${user.email}) - ${user.role}</p>
                    <button onclick="updateUserRole('${user._id}', 'student')">Set as Student</button>
                    <button onclick="updateUserRole('${user._id}', 'teacher')">Set as Teacher</button>
                    <button onclick="updateUserRole('${user._id}', 'admin')">Set as Admin</button>
                    <button onclick="deleteUser('${user._id}')">Delete</button>
                `;
                adminContent.appendChild(userElement);
            });
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            alert('Error: ' + error.message);
        });
    }

    // Fetch and display competitions
    function fetchCompetitions() {
        fetch('http://localhost:5000/api/admin/competitions', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = 'login.html';
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const adminContent = document.getElementById('admin-content');
            adminContent.innerHTML += '<h2>Competitions</h2>';
            data.forEach(competition => {
                const competitionElement = document.createElement('div');
                competitionElement.innerHTML = `
                    <p>${competition.title} - ${competition.description}</p>
                    <button onclick="deleteCompetition('${competition._id}')">Delete</button>
                `;
                adminContent.appendChild(competitionElement);
            });
        })
        .catch(error => {
            console.error('Error fetching competitions:', error);
            alert('Error: ' + error.message);
        });
    }

    // Update user role
    window.updateUserRole = function (userId, role) {
        fetch(`http://localhost:5000/api/admin/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ role })
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = 'login.html';
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert('User role updated successfully!');
            fetchUsers(); // Refresh the list of users
        })
        .catch(error => {
            console.error('Error updating user role:', error);
            alert('Error: ' + error.message);
        });
    };

    // Delete user
    window.deleteUser = function (userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        window.location.href = 'login.html';
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                alert('User deleted successfully!');
                fetchUsers(); // Refresh the list of users
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                alert('Error: ' + error.message);
            });
        }
    };

    // Delete competition
    window.deleteCompetition = function (competitionId) {
        if (confirm('Are you sure you want to delete this competition?')) {
            fetch(`http://localhost:5000/api/admin/competitions/${competitionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        window.location.href = 'login.html';
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                alert('Competition deleted successfully!');
                fetchCompetitions(); // Refresh the list of competitions
            })
            .catch(error => {
                console.error('Error deleting competition:', error);
                alert('Error: ' + error.message);
            });
        }
    };

    // Fetch users and competitions on page load
    fetchUsers();
    fetchCompetitions();
});
