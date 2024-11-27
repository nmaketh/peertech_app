document.addEventListener('DOMContentLoaded', function () {
    const competitions = JSON.parse(localStorage.getItem('competitions')) || [];

    const container = document.getElementById('competitions-container');

    competitions.forEach(comp => {
        const competitionElement = document.createElement('div');
        competitionElement.classList.add('col-lg-4', 'col-md-6', 'wow', 'fadeInUp');
        competitionElement.setAttribute('data-wow-delay', '0.1s');

        competitionElement.innerHTML = `
            <div class="course-item bg-light">
                <div class="position-relative overflow-hidden">
                    <img class="img-fluid" src="${comp.image}" alt="${comp.title}">
                    <div class="w-100 d-flex justify-content-center position-absolute bottom-0 start-0 mb-4">
                        <a href="#" class="flex-shrink-0 btn btn-sm btn-primary px-3 border-end" style="border-radius: 30px 0 0 30px;">Read More</a>
                        <a href="#" class="flex-shrink-0 btn btn-sm btn-primary px-3" style="border-radius: 0 30px 30px 0;">Join Now</a>
                    </div>
                </div>
                <div class="text-center p-4 pb-0">
                    <h3 class="mb-0">${comp.title}</h3>
                    <div class="mb-3">
                        ${'<small class="fa fa-star text-primary"></small>'.repeat(comp.rating)}
                        <small>(${comp.reviews})</small>
                    </div>
                    <h5 class="mb-4">${comp.description}</h5>
                </div>
                <div class="d-flex border-top">
                    <small class="flex-fill text-center border-end py-2"><i class="fa fa-user-tie text-primary me-2"></i>${comp.organizer}</small>
                    <small class="flex-fill text-center border-end py-2"><i class="fa fa-clock text-primary me-2"></i>${comp.endsIn}</small>
                    <small class="flex-fill text-center py-2"><i class="fa fa-user text-primary me-2"></i>${comp.participants}</small>
                </div>
            </div>
        `;

        container.appendChild(competitionElement);
    });
});