document.addEventListener('DOMContentLoaded', function () {
    const createCompetitionForm = document.getElementById('create-competition-form');
    const competitionsList = document.getElementById('competitions-list');

    // Centralized error handling function
    function handleError(response) {
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = 'login.html';
            }
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    }

    // Fetch and display competitions
    function fetchCompetitions() {
        fetch('http://localhost:5000/api/competitions', {
            method: 'GET'
        })
        .then(handleError)
        .then(data => {
            competitionsList.innerHTML = '';
            data.forEach(competition => {
                const competitionCard = `
                    <div class="col-lg-4 col-md-6">
                        <div class="card h-100">
                            <img src="${competition.image}" class="card-img-top" alt="${competition.title}">
                            <div class="card-body">
                                <h5 class="card-title">${competition.title}</h5>
                                <p class="card-text">${competition.description}</p>
                                <p class="card-text"><small class="text-muted">Organizer: ${competition.organizer}</small></p>
                                <p class="card-text"><small class="text-muted">Ends In: ${new Date(competition.endsIn).toLocaleDateString()}</small></p>
                                <p class="card-text"><small class="text-muted">Participants: ${competition.participants}</small></p>
                                <button class="btn btn-primary" onclick="updateCompetition('${competition._id}')">Update</button>
                                <button class="btn btn-danger" onclick="deleteCompetition('${competition._id}')">Delete</button>
                                <button class="btn btn-secondary" onclick="viewEnrollments('${competition._id}')">View Enrollments</button>
                            </div>
                        </div>
                    </div>
                `;
                competitionsList.innerHTML += competitionCard;
            });
        })
        .catch(error => {
            console.error('Error fetching competitions:', error);
            alert('Error fetching competitions: ' + error.message);
        });
    }

    // Fetch competitions on page load
    fetchCompetitions();

    // Create a new competition
    createCompetitionForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const organizer = document.getElementById('organizer').value;
        const endsIn = document.getElementById('endsIn').value;
        const participants = document.getElementById('participants').value;
        const image = document.getElementById('image').value;

        fetch('http://localhost:5000/api/competitions/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, organizer, endsIn, participants, image })
        })
        .then(handleError)
        .then(data => {
            alert('Competition created successfully!');
            fetchCompetitions(); // Refresh the list of competitions
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        });
    });

    // Update a competition
    window.updateCompetition = function (id) {
        const title = prompt('Enter new title:');
        const description = prompt('Enter new description:');
        const organizer = prompt('Enter new organizer:');
        const endsIn = prompt('Enter new end date (YYYY-MM-DD):');
        const participants = prompt('Enter new number of participants:');
        const image = prompt('Enter new image URL:');

        fetch(`http://localhost:5000/api/competitions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, organizer, endsIn, participants, image })
        })
        .then(handleError)
        .then(data => {
            alert('Competition updated successfully!');
            fetchCompetitions(); // Refresh the list of competitions
        })
        .catch(error => {
            console.error('Error updating competition:', error);
            alert('Error: ' + error.message);
        });
    };

    // Delete a competition
    window.deleteCompetition = function (id) {
        if (confirm('Are you sure you want to delete this competition?')) {
            fetch(`http://localhost:5000/api/competitions/${id}`, {
                method: 'DELETE'
            })
            .then(handleError)
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

    // View enrollments for a competition
    window.viewEnrollments = function (competitionId) {
        fetch(`http://localhost:5000/api/competitions/${competitionId}/enrollments`, {
            method: 'GET'
        })
        .then(handleError)
        .then(data => {
            const enrollmentsList = document.getElementById('enrollments-list');
            enrollmentsList.innerHTML = '<h2>Enrollments</h2>';
            data.forEach(enrollment => {
                const student = enrollment.student || {}; // Handle case where student is null
                const enrollmentElement = document.createElement('div');
                enrollmentElement.innerHTML = `
                    <p>${student.name || 'Unknown'} (${student.email || 'Unknown'}) - ${enrollment.status}</p>
                    <button onclick="updateEnrollmentStatus('${competitionId}', '${enrollment._id}', 'accepted')">Accept</button>
                    <button onclick="updateEnrollmentStatus('${competitionId}', '${enrollment._id}', 'rejected')">Reject</button>
                `;
                enrollmentsList.appendChild(enrollmentElement);
            });
        })
        .catch(error => {
            console.error('Error fetching enrollments:', error);
            alert('Error: ' + error.message);
        });
    };

    // Update enrollment status
    window.updateEnrollmentStatus = function (competitionId, enrollmentId, status) {
        fetch(`http://localhost:5000/api/competitions/${competitionId}/enrollments/${enrollmentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        })
        .then(handleError)
        .then(data => {
            alert(`Enrollment ${status} successfully!`);
            viewEnrollments(competitionId); // Refresh the list of enrollments
        })
        .catch(error => {
            console.error(`Error updating enrollment status:`, error);
            alert('Error: ' + error.message);
        });
    };

    // Fetch competitions on page load
    fetchCompetitions();
});