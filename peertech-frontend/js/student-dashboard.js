document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const studentId = localStorage.getItem('studentId'); // Ensure studentId is stored in local storage

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Fetch and display competitions
    function fetchCompetitions() {
        fetch('http://localhost:5000/api/competitions', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const dashboardContent = document.getElementById('dashboard-content');
            dashboardContent.innerHTML = '<h2>Competitions</h2>';
            data.forEach(competition => {
                const competitionElement = document.createElement('div');
                competitionElement.classList.add('col-lg-4', 'col-md-6');
                competitionElement.innerHTML = `
                    <div class="card h-100">
                        <img src="${competition.image}" class="card-img-top" alt="${competition.title}">
                        <div class="card-body">
                            <h5 class="card-title">${competition.title}</h5>
                            <p class="card-text">${competition.description}</p>
                            <p class="card-text"><small class="text-muted">Organizer: ${competition.organizer}</small></p>
                            <p class="card-text"><small class="text-muted">Ends In: ${new Date(competition.endsIn).toLocaleDateString()}</small></p>
                            <p class="card-text"><small class="text-muted">Participants: ${competition.participants}</small></p>
                            <button class="btn btn-primary" onclick="enrollInCompetition('${competition._id}')">Enroll</button>
                        </div>
                    </div>
                `;
                dashboardContent.appendChild(competitionElement);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            window.location.href = 'login.html';
        });
    }

    // Fetch and display notifications
    function fetchNotifications() {
        fetch(`http://localhost:5000/api/notifications?studentId=${studentId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const notifications = document.getElementById('notifications');
            notifications.innerHTML = '<h2>Notifications</h2>';
            data.forEach(notification => {
                const notificationElement = document.createElement('div');
                notificationElement.classList.add('col-12');
                notificationElement.innerHTML = `
                    <div class="alert alert-info d-flex justify-content-between align-items-center" role="alert">
                        ${notification.message}
                        <button class="btn btn-danger btn-sm" onclick="deleteNotification('${notification._id}')">Delete</button>
                    </div>
                `;
                notifications.appendChild(notificationElement);
            });
        })
        .catch(error => {
            console.error('Error fetching notifications:', error);
            alert('Error: ' + error.message);
        });
    }

    // Enroll in a competition
    window.enrollInCompetition = function (competitionId) {
        if (!studentId) {
            alert('Student ID is missing. Please log in again.');
            window.location.href = 'login.html';
            return;
        }

        fetch(`http://localhost:5000/api/competitions/${competitionId}/enroll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ studentId })
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(data => {
            alert('Enrolled successfully! Waiting for approval.');
        })
        .catch(error => {
            console.error('Error enrolling in competition:', error);
            alert('Error: ' + error.message);
        });
    }

    // Delete a notification
    window.deleteNotification = function (notificationId) {
        fetch(`http://localhost:5000/api/notifications/${notificationId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Notification deleted successfully!');
            fetchNotifications(); // Refresh the list of notifications
        })
        .catch(error => {
            console.error('Error deleting notification:', error);
            alert('Error: ' + error.message);
        });
    }

    // Fetch competitions and notifications on page load
    fetchCompetitions();
    fetchNotifications();
});