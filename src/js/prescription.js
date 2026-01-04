// Simple Prescription Manager - Easy to understand
console.log('PrescriptionManager loading...');

// Global prescriptions array
let prescriptions = [];

// Load prescriptions from localStorage
function loadPrescriptions() {
    const saved = localStorage.getItem('hospital_prescriptions');
    if (saved) {
        prescriptions = JSON.parse(saved);
    } else {
        // Add sample prescription
        prescriptions = [{
            id: 1,
            patientId: 1,
            patientName: 'Mouad Mezyan',
            doctorId: 1,
            doctorName: 'Dr. Redouan Mohamed',
            medication: 'Paracetamol',
            dosage: '500mg - 3 fois par jour',
            duration: '7 jours',
            date: '2025-12-29',
            notes: ''
        }];
        savePrescriptions();
    }
    return prescriptions;
}

// Save prescriptions to localStorage
function savePrescriptions() {
    localStorage.setItem('hospital_prescriptions', JSON.stringify(prescriptions));
}

// Get prescription count
function getPrescriptionCount() {
    return prescriptions.length;
}

// Show prescriptions table with search, filter and pagination
function showPrescriptions(search = '', page = 1, itemsPerPage = 10) {
    // Filter prescriptions based on search
    let filteredPrescriptions = prescriptions.filter(prescription =>
        prescription.patientName.toLowerCase().includes(search.toLowerCase()) ||
        prescription.doctorName.toLowerCase().includes(search.toLowerCase()) ||
        prescription.medication.toLowerCase().includes(search.toLowerCase()) ||
        prescription.date.includes(search)
    );

    const totalItems = filteredPrescriptions.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPrescriptions = filteredPrescriptions.slice(startIndex, endIndex);

    const content = `
        <div class="d-flex justify-content-between mb-3">
            <h3>Gestion des Prescriptions</h3>
            <button class="btn btn-success" onclick="showAddPrescriptionModal()">
                <i class="bi bi-plus-circle"></i> Ajouter Prescription
            </button>
        </div>

        <!-- Search and Filter Controls -->
        <div class="row mb-3">
            <div class="col-md-6">
                <input type="text" id="prescription-search" class="form-control" placeholder="Rechercher par patient, médecin, médicament ou date..." value="${search}" onkeyup="handlePrescriptionSearch()">
            </div>
            <div class="col-md-3">
                <select id="prescription-items-per-page" class="form-select" onchange="handlePrescriptionSearch()">
                    <option value="5" ${itemsPerPage === 5 ? 'selected' : ''}>5 par page</option>
                    <option value="10" ${itemsPerPage === 10 ? 'selected' : ''}>10 par page</option>
                    <option value="25" ${itemsPerPage === 25 ? 'selected' : ''}>25 par page</option>
                    <option value="50" ${itemsPerPage === 50 ? 'selected' : ''}>50 par page</option>
                </select>
            </div>
            <div class="col-md-3 text-end">
                <small class="text-muted">Total: ${totalItems} prescriptions</small>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Patient</th>
                        <th>Médecin</th>
                        <th>Médicament</th>
                        <th>Dosage</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${paginatedPrescriptions.map(prescription => `
                        <tr>
                            <td>${prescription.id}</td>
                            <td>${prescription.patientName}</td>
                            <td>${prescription.doctorName}</td>
                            <td>${prescription.medication}</td>
                            <td>${prescription.dosage}</td>
                            <td>${prescription.date}</td>
                            <td>
                                <button class="btn btn-info btn-sm me-1" onclick="viewPrescription(${prescription.id})">
                                    <i class="bi bi-eye"></i> Voir
                                </button>
                                <button class="btn btn-warning btn-sm me-1" onclick="editPrescription(${prescription.id})">
                                    <i class="bi bi-pencil"></i> Modifier
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="deletePrescription(${prescription.id})">
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
        <nav aria-label="Prescription pagination">
            <ul class="pagination justify-content-center">
                <li class="page-item ${page === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePrescriptionPage(${page - 1})">Précédent</a>
                </li>
                ${Array.from({length: totalPages}, (_, i) => i + 1).map(p => `
                    <li class="page-item ${p === page ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="changePrescriptionPage(${p})">${p}</a>
                    </li>
                `).join('')}
                <li class="page-item ${page === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePrescriptionPage(${page + 1})">Suivant</a>
                </li>
            </ul>
        </nav>
        ` : ''}
    `;
    document.getElementById('main-content').innerHTML = content;
}

// Show add prescription modal
function showAddPrescriptionModal() {
    // Get patients and doctors from global arrays
    const patientOptions = patients.map(p => `<option value="${p.id}">${p.nom}</option>`).join('');
    const doctorOptions = doctors.map(d => `<option value="${d.id}">${d.nom}</option>`).join('');

    const modal = `
        <div class="modal fade" id="prescriptionModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Ajouter une Prescription</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="prescription-form">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Patient</label>
                                    <select class="form-control" id="prescription-patient" required>
                                        <option value="">Sélectionner un patient</option>
                                        ${patientOptions}
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Médecin</label>
                                    <select class="form-control" id="prescription-doctor" required>
                                        <option value="">Sélectionner un médecin</option>
                                        ${doctorOptions}
                                    </select>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Médicament</label>
                                <input type="text" class="form-control" id="prescription-medication" required>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Dosage</label>
                                    <input type="text" class="form-control" id="prescription-dosage" placeholder="ex: 500mg - 3 fois par jour" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Durée</label>
                                    <input type="text" class="form-control" id="prescription-duration" placeholder="ex: 7 jours" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Date</label>
                                <input type="date" class="form-control" id="prescription-date" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Notes supplémentaires</label>
                                <textarea class="form-control" id="prescription-notes" rows="3" placeholder="Instructions spéciales..."></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-primary" onclick="savePrescription()">Enregistrer</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal
    const existing = document.getElementById('prescriptionModal');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modal);
    const modalElement = new bootstrap.Modal(document.getElementById('prescriptionModal'));
    modalElement.show();

    // Clear form
    document.getElementById('prescription-form').reset();
    // Set default date to today
    document.getElementById('prescription-date').valueAsDate = new Date();
    window.currentPrescriptionId = null;
}

// Save prescription
function savePrescription() {
    const form = document.getElementById('prescription-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const patientId = parseInt(document.getElementById('prescription-patient').value);
    const doctorId = parseInt(document.getElementById('prescription-doctor').value);

    // Get patient and doctor names
    const patient = patients.find(p => p.id === patientId);
    const doctor = doctors.find(d => d.id === doctorId);

    const prescription = {
        id: window.currentPrescriptionId || Date.now(),
        patientId: patientId,
        patientName: patient ? patient.nom : 'Patient inconnu',
        doctorId: doctorId,
        doctorName: doctor ? doctor.nom : 'Médecin inconnu',
        medication: document.getElementById('prescription-medication').value,
        dosage: document.getElementById('prescription-dosage').value,
        duration: document.getElementById('prescription-duration').value,
        date: document.getElementById('prescription-date').value,
        notes: document.getElementById('prescription-notes').value
    };

    if (window.currentPrescriptionId) {
        // Update existing
        const index = prescriptions.findIndex(p => p.id === window.currentPrescriptionId);
        if (index !== -1) prescriptions[index] = prescription;
    } else {
        // Add new
        prescriptions.push(prescription);
    }

    savePrescriptions();
    bootstrap.Modal.getInstance(document.getElementById('prescriptionModal')).hide();
    showPrescriptions(currentPrescriptionSearch, currentPrescriptionPage, currentPrescriptionItemsPerPage);
    showAlert('Prescription enregistrée!', 'success');
}

// Edit prescription
function editPrescription(id) {
    const prescription = prescriptions.find(p => p.id === id);
    if (prescription) {
        showAddPrescriptionModal();
        document.getElementById('prescription-patient').value = prescription.patientId;
        document.getElementById('prescription-doctor').value = prescription.doctorId;
        document.getElementById('prescription-medication').value = prescription.medication;
        document.getElementById('prescription-dosage').value = prescription.dosage;
        document.getElementById('prescription-duration').value = prescription.duration;
        document.getElementById('prescription-date').value = prescription.date;
        document.getElementById('prescription-notes').value = prescription.notes;
        window.currentPrescriptionId = id;
        document.querySelector('.modal-title').textContent = 'Modifier une Prescription';
    }
}

// Delete prescription
function deletePrescription(id) {
    if (confirm('Supprimer cette prescription ?')) {
        prescriptions = prescriptions.filter(p => p.id !== id);
        savePrescriptions();
        showPrescriptions(currentPrescriptionSearch, currentPrescriptionPage, currentPrescriptionItemsPerPage);
        showAlert('Prescription supprimée!', 'danger');
    }
}

// View prescription
function viewPrescription(id) {
    const prescription = prescriptions.find(p => p.id === id);
    if (prescription) {
        const modal = `
            <div class="modal fade" id="viewModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Détails de la Prescription</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p><strong>ID:</strong> ${prescription.id}</p>
                            <p><strong>Patient:</strong> ${prescription.patientName}</p>
                            <p><strong>Médecin:</strong> ${prescription.doctorName}</p>
                            <p><strong>Médicament:</strong> ${prescription.medication}</p>
                            <p><strong>Dosage:</strong> ${prescription.dosage}</p>
                            <p><strong>Durée:</strong> ${prescription.duration}</p>
                            <p><strong>Date:</strong> ${prescription.date}</p>
                            ${prescription.notes ? `<p><strong>Notes:</strong> ${prescription.notes}</p>` : ''}
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

// Initialize prescriptions when script loads
loadPrescriptions();

// Global variables for pagination and search
let currentPrescriptionPage = 1;
let currentPrescriptionSearch = '';
let currentPrescriptionItemsPerPage = 10;

// Handle prescription search and filter
function handlePrescriptionSearch() {
    currentPrescriptionSearch = document.getElementById('prescription-search').value;
    currentPrescriptionItemsPerPage = parseInt(document.getElementById('prescription-items-per-page').value);
    currentPrescriptionPage = 1; // Reset to first page
    showPrescriptions(currentPrescriptionSearch, currentPrescriptionPage, currentPrescriptionItemsPerPage);
}

// Change prescription page
function changePrescriptionPage(page) {
    currentPrescriptionPage = page;
    showPrescriptions(currentPrescriptionSearch, currentPrescriptionPage, currentPrescriptionItemsPerPage);
}