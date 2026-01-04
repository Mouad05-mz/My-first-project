// Simple Doctor Manager - Easy to understand
console.log('DoctorManager loading...');

// Global doctors array
let doctors = [];

// Load doctors from localStorage
function loadDoctors() {
    const saved = localStorage.getItem('hospital_doctors');
    if (saved) {
        doctors = JSON.parse(saved);
    } else {
        // Add sample doctor
        doctors = [{
            id: 1,
            nom: 'Dr. Redouan Mohamed',
            specialite: 'Cardiologie',
            telephone: '06 11 22 33 44',
            email: 'redouan.mohamed@hospital.com',
            experience: 10
        }];
        saveDoctors();
    }
    return doctors;
}

// Save doctors to localStorage
function saveDoctors() {
    localStorage.setItem('hospital_doctors', JSON.stringify(doctors));
}

// Get doctor count
function getDoctorCount() {
    return doctors.length;
}

// Show doctors table with search, filter and pagination
function showDoctors(search = '', page = 1, itemsPerPage = 10) {
    // Filter doctors based on search
    let filteredDoctors = doctors.filter(doctor =>
        doctor.nom.toLowerCase().includes(search.toLowerCase()) ||
        doctor.specialite.toLowerCase().includes(search.toLowerCase()) ||
        doctor.email.toLowerCase().includes(search.toLowerCase())
    );

    const totalItems = filteredDoctors.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex);

    const content = `
        <div class="d-flex justify-content-between mb-3">
            <h3>Gestion des Médecins</h3>
            <button class="btn btn-success" onclick="showAddDoctorModal()">
                <i class="bi bi-plus-circle"></i> Ajouter Médecin
            </button>
        </div>

        <!-- Search and Filter Controls -->
        <div class="row mb-3">
            <div class="col-md-6">
                <input type="text" id="doctor-search" class="form-control" placeholder="Rechercher par nom, spécialité ou email..." value="${search}" onkeyup="handleDoctorSearch()">
            </div>
            <div class="col-md-3">
                <select id="doctor-items-per-page" class="form-select" onchange="handleDoctorSearch()">
                    <option value="5" ${itemsPerPage === 5 ? 'selected' : ''}>5 par page</option>
                    <option value="10" ${itemsPerPage === 10 ? 'selected' : ''}>10 par page</option>
                    <option value="25" ${itemsPerPage === 25 ? 'selected' : ''}>25 par page</option>
                    <option value="50" ${itemsPerPage === 50 ? 'selected' : ''}>50 par page</option>
                </select>
            </div>
            <div class="col-md-3 text-end">
                <small class="text-muted">Total: ${totalItems} médecins</small>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Spécialité</th>
                        <th>Téléphone</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${paginatedDoctors.map(doctor => `
                        <tr>
                            <td>${doctor.id}</td>
                            <td>${doctor.nom}</td>
                            <td>${doctor.specialite}</td>
                            <td>${doctor.telephone}</td>
                            <td>${doctor.email}</td>
                            <td>
                                <button class="btn btn-info btn-sm me-1" onclick="viewDoctor(${doctor.id})">
                                    <i class="bi bi-eye"></i> Voir
                                </button>
                                <button class="btn btn-warning btn-sm me-1" onclick="editDoctor(${doctor.id})">
                                    <i class="bi bi-pencil"></i> Modifier
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="deleteDoctor(${doctor.id})">
                                    <i class="bi bi-trash"></i> Supprimer
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        ${totalPages > 1 ? `
        <nav aria-label="Doctor pagination">
            <ul class="pagination justify-content-center">
                <li class="page-item ${page === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeDoctorPage(${page - 1})">Précédent</a>
                </li>
                ${Array.from({length: totalPages}, (_, i) => i + 1).map(p => `
                    <li class="page-item ${p === page ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="changeDoctorPage(${p})">${p}</a>
                    </li>
                `).join('')}
                <li class="page-item ${page === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeDoctorPage(${page + 1})">Suivant</a>
                </li>
            </ul>
        </nav>
        ` : ''}
    `;
    document.getElementById('main-content').innerHTML = content;
}

// Show add doctor modal
function showAddDoctorModal() {
    const modal = `
        <div class="modal fade" id="doctorModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Ajouter un Médecin</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="doctor-form">
                            <div class="mb-3">
                                <label class="form-label">Nom complet</label>
                                <input type="text" class="form-control" id="doctor-nom" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Spécialité</label>
                                <select class="form-control" id="doctor-specialite" required>
                                    <option value="">Sélectionner une spécialité</option>
                                    <option value="Cardiologie">Cardiologie</option>
                                    <option value="Dermatologie">Dermatologie</option>
                                    <option value="Gynécologie">Gynécologie</option>
                                    <option value="Ophtalmologie">Ophtalmologie</option>
                                    <option value="Pédiatrie">Pédiatrie</option>
                                    <option value="Psychiatrie">Psychiatrie</option>
                                    <option value="Radiologie">Radiologie</option>
                                    <option value="Médecine générale">Médecine générale</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Téléphone</label>
                                <input type="tel" class="form-control" id="doctor-telephone" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" id="doctor-email" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Années d'expérience</label>
                                <input type="number" class="form-control" id="doctor-experience" min="0" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-primary" onclick="saveDoctor()">Enregistrer</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal
    const existing = document.getElementById('doctorModal');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modal);
    const modalElement = new bootstrap.Modal(document.getElementById('doctorModal'));
    modalElement.show();

    // Clear form
    document.getElementById('doctor-form').reset();
    window.currentDoctorId = null;
}

// Save doctor
function saveDoctor() {
    const form = document.getElementById('doctor-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const doctor = {
        id: window.currentDoctorId || Date.now(),
        nom: document.getElementById('doctor-nom').value,
        specialite: document.getElementById('doctor-specialite').value,
        telephone: document.getElementById('doctor-telephone').value,
        email: document.getElementById('doctor-email').value,
        experience: parseInt(document.getElementById('doctor-experience').value)
    };

    if (window.currentDoctorId) {
        // Update existing
        const index = doctors.findIndex(d => d.id === window.currentDoctorId);
        if (index !== -1) doctors[index] = doctor;
    } else {
        // Add new
        doctors.push(doctor);
    }

    saveDoctors();
    bootstrap.Modal.getInstance(document.getElementById('doctorModal')).hide();
    showDoctors(currentDoctorSearch, currentDoctorPage, currentDoctorItemsPerPage);
    showAlert('Médecin enregistré!', 'success');
}

// Edit doctor
function editDoctor(id) {
    const doctor = doctors.find(d => d.id === id);
    if (doctor) {
        showAddDoctorModal();
        document.getElementById('doctor-nom').value = doctor.nom;
        document.getElementById('doctor-specialite').value = doctor.specialite;
        document.getElementById('doctor-telephone').value = doctor.telephone;
        document.getElementById('doctor-email').value = doctor.email;
        document.getElementById('doctor-experience').value = doctor.experience;
        window.currentDoctorId = id;
        document.querySelector('.modal-title').textContent = 'Modifier un Médecin';
    }
}

// Delete doctor
function deleteDoctor(id) {
    if (confirm('Supprimer ce médecin ?')) {
        doctors = doctors.filter(d => d.id !== id);
        saveDoctors();
        showDoctors(currentDoctorSearch, currentDoctorPage, currentDoctorItemsPerPage);
        showAlert('Médecin supprimé!', 'danger');
    }
}

// View doctor
function viewDoctor(id) {
    const doctor = doctors.find(d => d.id === id);
    if (doctor) {
        const modal = `
            <div class="modal fade" id="viewModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Détails du Médecin</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p><strong>ID:</strong> ${doctor.id}</p>
                            <p><strong>Nom:</strong> ${doctor.nom}</p>
                            <p><strong>Spécialité:</strong> ${doctor.specialite}</p>
                            <p><strong>Téléphone:</strong> ${doctor.telephone}</p>
                            <p><strong>Email:</strong> ${doctor.email}</p>
                            <p><strong>Expérience:</strong> ${doctor.experience} années</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existing = document.getElementById('viewModal');
        if (existing) existing.remove();

        document.body.insertAdjacentHTML('beforeend', modal);
        new bootstrap.Modal(document.getElementById('viewModal')).show();
    }
}

// Simple alert function
function showAlert(message, type) {
    const alert = `<div class="alert alert-${type} alert-dismissible fade show position-fixed" style="top: 20px; right: 20px; z-index: 9999;">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', alert);
    setTimeout(() => {
        const alertEl = document.querySelector('.alert');
        if (alertEl) alertEl.remove();
    }, 3000);
}

// Initialize doctors when script loads
loadDoctors();

// Global variables for pagination and search
let currentDoctorPage = 1;
let currentDoctorSearch = '';
let currentDoctorItemsPerPage = 10;

// Handle doctor search and filter
function handleDoctorSearch() {
    currentDoctorSearch = document.getElementById('doctor-search').value;
    currentDoctorItemsPerPage = parseInt(document.getElementById('doctor-items-per-page').value);
    currentDoctorPage = 1; // Reset to first page
    showDoctors(currentDoctorSearch, currentDoctorPage, currentDoctorItemsPerPage);
}

// Change doctor page
function changeDoctorPage(page) {
    currentDoctorPage = page;
    showDoctors(currentDoctorSearch, currentDoctorPage, currentDoctorItemsPerPage);
}