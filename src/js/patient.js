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
function showPatients() {
    const content = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3>Gestion des Patients</h3>
            <button class="btn btn-success" onclick="showAddPatientModal()">
                <i class="bi bi-plus-circle"></i> Ajouter Patient
            </button>
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
                    ${patients.map(patient => `
                        <tr>
                            <td>${patient.id}</td>
                            <td>${patient.nom}</td>
                            <td>${patient.age}</td>
                            <td>${patient.telephone}</td>
                            <td>${patient.email}</td>
                            <td>
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
    `;
    document.getElementById('main-content').innerHTML = content;
}

// Show add patient modal
function showAddPatientModal(isEditing = false) {
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

    // Clear form only when adding new patient
    if (!isEditing) {
        document.getElementById('patient-form').reset();
        window.currentPatientId = null;
    }
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
    showPatients();
    showAlert('Patient enregistré!', 'success');
}

// Edit patient
function editPatient(id) {
    const patient = patients.find(p => p.id === id);
    if (patient) {
        showAddPatientModal(true); // Pass true for editing
        // Use setTimeout to ensure modal is fully loaded before populating fields
        setTimeout(() => {
            document.getElementById('patient-nom').value = patient.nom;
            document.getElementById('patient-age').value = patient.age;
            document.getElementById('patient-telephone').value = patient.telephone;
            document.getElementById('patient-email').value = patient.email;
            document.getElementById('patient-adresse').value = patient.adresse;
            window.currentPatientId = id;
            document.querySelector('.modal-title').textContent = 'Modifier un Patient';
        }, 100);
    }
}

// Delete patient
function deletePatient(id) {
    if (confirm('Supprimer ce patient ?')) {
        patients = patients.filter(p => p.id !== id);
        savePatients();
        showPatients();
        showAlert('Patient supprimé!', 'danger');
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