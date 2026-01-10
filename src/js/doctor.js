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

// Show doctors table
function showDoctors() {
    const content = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3>Gestion des Médecins</h3>
            <button class="btn btn-success" onclick="showAddDoctorModal()">
                <i class="bi bi-plus-circle"></i> Ajouter Médecin
            </button>
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
                    ${doctors.map(doctor => `
                        <tr>
                            <td>${doctor.id}</td>
                            <td>${doctor.nom}</td>
                            <td>${doctor.specialite}</td>
                            <td>${doctor.telephone}</td>
                            <td>${doctor.email}</td>
                            <td>
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
    `;
    document.getElementById('main-content').innerHTML = content;
}

// Show add doctor modal
function showAddDoctorModal(isEditing = false) {
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

    // Clear form only when adding new doctor
    if (!isEditing) {
        document.getElementById('doctor-form').reset();
        window.currentDoctorId = null;
    }
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
    showDoctors();
    showAlert('Médecin enregistré!', 'success');
}

// Edit doctor
function editDoctor(id) {
    const doctor = doctors.find(d => d.id === id);
    if (doctor) {
        showAddDoctorModal(true); // Pass true for editing
        // Use setTimeout to ensure modal is fully loaded before populating fields
        setTimeout(() => {
            document.getElementById('doctor-nom').value = doctor.nom;
            document.getElementById('doctor-specialite').value = doctor.specialite;
            document.getElementById('doctor-telephone').value = doctor.telephone;
            document.getElementById('doctor-email').value = doctor.email;
            document.getElementById('doctor-experience').value = doctor.experience;
            window.currentDoctorId = id;
            document.querySelector('.modal-title').textContent = 'Modifier un Médecin';
        }, 100);
    }
}

// Delete doctor
function deleteDoctor(id) {
    if (confirm('Supprimer ce médecin ?')) {
        doctors = doctors.filter(d => d.id !== id);
        saveDoctors();
        showDoctors();
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