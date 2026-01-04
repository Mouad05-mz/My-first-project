// Simple Patient Manager - Easy to understand
console.log('PatientManager loading...');

// Global patients array
let patients = [];

// Load patients from localStorage
function loadPatients() {
    const saved = localStorage.getItem('hospital_patients');
    if (saved) {
        patients = JSON.parse(saved);
    } else {
        // Add sample patient
        patients = [{
            id: 1,
            nom: 'Mouad Mezyan',
            age: 27,
            telephone: '06 00 00 00 00',
            email: 'mouad@example.com',
            adresse: '123 Rue Example'
        }];
        savePatients();
    }
    return patients;
}

// Save patients to localStorage
function savePatients() {
    localStorage.setItem('hospital_patients', JSON.stringify(patients));
}

// Get patient count
function getPatientCount() {
    return patients.length;
}

// Show patients table
function showPatients(searchTerm = '', currentPage = 1, itemsPerPage = 10) {
    // Filter patients based on search term
    let filteredPatients = patients;
    if (searchTerm) {
        filteredPatients = patients.filter(patient =>
            patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.telephone.includes(searchTerm)
        );
    }

    // Calculate pagination
    const totalItems = filteredPatients.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

    const content = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3>Gestion des Patients</h3>
            <button class="btn btn-success" onclick="showAddPatientModal()">
                <i class="bi bi-plus-circle"></i> Ajouter Patient
            </button>
        </div>

        <!-- Search and Filter -->
        <div class="row mb-3">
            <div class="col-md-6">
                <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control" id="patient-search" placeholder="Rechercher par nom, email ou téléphone..." value="${searchTerm}" onkeyup="handlePatientSearch()">
                </div>
            </div>
            <div class="col-md-3">
                <select class="form-control" id="patient-items-per-page" onchange="handlePatientSearch()">
                    <option value="5" ${itemsPerPage == 5 ? 'selected' : ''}>5 par page</option>
                    <option value="10" ${itemsPerPage == 10 ? 'selected' : ''}>10 par page</option>
                    <option value="25" ${itemsPerPage == 25 ? 'selected' : ''}>25 par page</option>
                    <option value="50" ${itemsPerPage == 50 ? 'selected' : ''}>50 par page</option>
                </select>
            </div>
            <div class="col-md-3 text-end">
                <small class="text-muted">Total: ${totalItems} patients</small>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Âge</th>
                        <th>Téléphone</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${paginatedPatients.map(patient => `
                        <tr>
                            <td>${patient.id}</td>
                            <td>${patient.nom}</td>
                            <td>${patient.age}</td>
                            <td>${patient.telephone}</td>
                            <td>${patient.email}</td>
                            <td>
                                <button class="btn btn-info btn-sm me-1" onclick="viewPatient(${patient.id})">
                                    <i class="bi bi-eye"></i> Voir
                                </button>
                                <button class="btn btn-warning btn-sm me-1" onclick="editPatient(${patient.id})">
                                    <i class="bi bi-pencil"></i> Modifier
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="deletePatient(${patient.id})">
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
        <nav aria-label="Patient pagination" class="mt-3">
            <ul class="pagination justify-content-center">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePatientPage(${currentPage - 1})">Précédent</a>
                </li>
                ${Array.from({length: totalPages}, (_, i) => i + 1).map(page => `
                    <li class="page-item ${page === currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="changePatientPage(${page})">${page}</a>
                    </li>
                `).join('')}
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePatientPage(${currentPage + 1})">Suivant</a>
                </li>
            </ul>
        </nav>
        ` : ''}
    `;
    document.getElementById('main-content').innerHTML = content;
}

// Show add patient modal
function showAddPatientModal() {
    const modal = `
        <div class="modal fade" id="patientModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Ajouter un Patient</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="patient-form">
                            <div class="mb-3">
                                <label class="form-label">Nom complet</label>
                                <input type="text" class="form-control" id="patient-nom" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Âge</label>
                                <input type="number" class="form-control" id="patient-age" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Téléphone</label>
                                <input type="tel" class="form-control" id="patient-telephone" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" id="patient-email" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Adresse</label>
                                <textarea class="form-control" id="patient-adresse" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-primary" onclick="savePatient()">Enregistrer</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal
    const existing = document.getElementById('patientModal');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modal);
    const modalElement = new bootstrap.Modal(document.getElementById('patientModal'));
    modalElement.show();

    // Clear form
    document.getElementById('patient-form').reset();
    window.currentPatientId = null;
}

// Save patient
function savePatient() {
    const form = document.getElementById('patient-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const patient = {
        id: window.currentPatientId || Date.now(),
        nom: document.getElementById('patient-nom').value,
        age: parseInt(document.getElementById('patient-age').value),
        telephone: document.getElementById('patient-telephone').value,
        email: document.getElementById('patient-email').value,
        adresse: document.getElementById('patient-adresse').value
    };

    if (window.currentPatientId) {
        // Update existing
        const index = patients.findIndex(p => p.id === window.currentPatientId);
        if (index !== -1) patients[index] = patient;
    } else {
        // Add new
        patients.push(patient);
    }

    savePatients();
    bootstrap.Modal.getInstance(document.getElementById('patientModal')).hide();
    showPatients(currentPatientSearch, currentPatientPage, currentPatientItemsPerPage);
    showAlert('Patient enregistré!', 'success');
}

// Edit patient
function editPatient(id) {
    const patient = patients.find(p => p.id === id);
    if (patient) {
        showAddPatientModal();
        document.getElementById('patient-nom').value = patient.nom;
        document.getElementById('patient-age').value = patient.age;
        document.getElementById('patient-telephone').value = patient.telephone;
        document.getElementById('patient-email').value = patient.email;
        document.getElementById('patient-adresse').value = patient.adresse;
        window.currentPatientId = id;
        document.querySelector('.modal-title').textContent = 'Modifier un Patient';
    }
}

// Delete patient
function deletePatient(id) {
    if (confirm('Supprimer ce patient ?')) {
        patients = patients.filter(p => p.id !== id);
        savePatients();
        showPatients(currentPatientSearch, currentPatientPage, currentPatientItemsPerPage);
        showAlert('Patient supprimé!', 'danger');
    }
}

// View patient
function viewPatient(id) {
    const patient = patients.find(p => p.id === id);
    if (patient) {
        const modal = `
            <div class="modal fade" id="viewModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Détails du Patient</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p><strong>ID:</strong> ${patient.id}</p>
                            <p><strong>Nom:</strong> ${patient.nom}</p>
                            <p><strong>Âge:</strong> ${patient.age} ans</p>
                            <p><strong>Téléphone:</strong> ${patient.telephone}</p>
                            <p><strong>Email:</strong> ${patient.email}</p>
                            <p><strong>Adresse:</strong> ${patient.adresse || 'N/A'}</p>
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

// Initialize patients when script loads
loadPatients();

// Global variables for pagination and search
let currentPatientPage = 1;
let currentPatientSearch = '';
let currentPatientItemsPerPage = 10;

// Handle patient search and filter
function handlePatientSearch() {
    currentPatientSearch = document.getElementById('patient-search').value;
    currentPatientItemsPerPage = parseInt(document.getElementById('patient-items-per-page').value);
    currentPatientPage = 1; // Reset to first page
    showPatients(currentPatientSearch, currentPatientPage, currentPatientItemsPerPage);
}

// Change patient page
function changePatientPage(page) {
    currentPatientPage = page;
    showPatients(currentPatientSearch, currentPatientPage, currentPatientItemsPerPage);
}