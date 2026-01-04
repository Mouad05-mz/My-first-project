// Simple Appointment Manager - Easy to understand
console.log('AppointmentManager loading...');

// Global appointments array
let appointments = [];

// Load appointments from localStorage
function loadAppointments() {
    const saved = localStorage.getItem('hospital_appointments');
    if (saved) {
        appointments = JSON.parse(saved);
    } else {
        // Add sample appointment
        appointments = [{
            id: 1,
            patientId: 1,
            patientName: 'Mouad Mezyan',
            doctorId: 1,
            doctorName: 'Dr. Sarah Johnson',
            date: '2025-12-30',
            time: '10:00',
            reason: 'Consultation générale',
            status: 'Confirmé'
        }];
        saveAppointments();
    }
    return appointments;
}

// Save appointments to localStorage
function saveAppointments() {
    localStorage.setItem('hospital_appointments', JSON.stringify(appointments));
}

// Get appointment count
function getAppointmentCount() {
    return appointments.length;
}

// Show appointments table with search, filter and pagination
function showAppointments(search = '', page = 1, itemsPerPage = 10) {
    // Filter appointments based on search
    let filteredAppointments = appointments.filter(appointment =>
        appointment.patientName.toLowerCase().includes(search.toLowerCase()) ||
        appointment.doctorName.toLowerCase().includes(search.toLowerCase()) ||
        appointment.reason.toLowerCase().includes(search.toLowerCase()) ||
        appointment.status.toLowerCase().includes(search.toLowerCase()) ||
        appointment.date.includes(search)
    );

    const totalItems = filteredAppointments.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);

    const content = `
        <div class="d-flex justify-content-between mb-3">
            <h3>Gestion des Rendez-vous</h3>
            <button class="btn btn-success" onclick="showAddAppointmentModal()">
                <i class="bi bi-plus-circle"></i> Ajouter Rendez-vous
            </button>
        </div>

        <!-- Search and Filter Controls -->
        <div class="row mb-3">
            <div class="col-md-6">
                <input type="text" id="appointment-search" class="form-control" placeholder="Rechercher par patient, médecin, motif, statut ou date..." value="${search}" onkeyup="handleAppointmentSearch()">
            </div>
            <div class="col-md-3">
                <select id="appointment-items-per-page" class="form-select" onchange="handleAppointmentSearch()">
                    <option value="5" ${itemsPerPage === 5 ? 'selected' : ''}>5 par page</option>
                    <option value="10" ${itemsPerPage === 10 ? 'selected' : ''}>10 par page</option>
                    <option value="25" ${itemsPerPage === 25 ? 'selected' : ''}>25 par page</option>
                    <option value="50" ${itemsPerPage === 50 ? 'selected' : ''}>50 par page</option>
                </select>
            </div>
            <div class="col-md-3 text-end">
                <small class="text-muted">Total: ${totalItems} rendez-vous</small>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Patient</th>
                        <th>Médecin</th>
                        <th>Date</th>
                        <th>Heure</th>
                        <th>Motif</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${paginatedAppointments.map(appointment => `
                        <tr>
                            <td>${appointment.id}</td>
                            <td>${appointment.patientName}</td>
                            <td>${appointment.doctorName}</td>
                            <td>${appointment.date}</td>
                            <td>${appointment.time}</td>
                            <td>${appointment.reason}</td>
                            <td><span class="badge bg-${appointment.status === 'Confirmé' ? 'success' : appointment.status === 'Annulé' ? 'danger' : 'warning'}">${appointment.status}</span></td>
                            <td>
                                <button class="btn btn-info btn-sm me-1" onclick="viewAppointment(${appointment.id})">
                                    <i class="bi bi-eye"></i> Voir
                                </button>
                                <button class="btn btn-warning btn-sm me-1" onclick="editAppointment(${appointment.id})">
                                    <i class="bi bi-pencil"></i> Modifier
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="deleteAppointment(${appointment.id})">
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
        <nav aria-label="Appointment pagination">
            <ul class="pagination justify-content-center">
                <li class="page-item ${page === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeAppointmentPage(${page - 1})">Précédent</a>
                </li>
                ${Array.from({length: totalPages}, (_, i) => i + 1).map(p => `
                    <li class="page-item ${p === page ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="changeAppointmentPage(${p})">${p}</a>
                    </li>
                `).join('')}
                <li class="page-item ${page === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeAppointmentPage(${page + 1})">Suivant</a>
                </li>
            </ul>
        </nav>
        ` : ''}
    `;
    document.getElementById('main-content').innerHTML = content;
}

// Show add appointment modal
function showAddAppointmentModal() {
    // Get patients and doctors from global arrays
    const patientOptions = patients.map(p => `<option value="${p.id}">${p.nom}</option>`).join('');
    const doctorOptions = doctors.map(d => `<option value="${d.id}">${d.nom}</option>`).join('');

    const modal = `
        <div class="modal fade" id="appointmentModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Ajouter un Rendez-vous</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="appointment-form">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Patient</label>
                                    <select class="form-control" id="appointment-patient" required>
                                        <option value="">Sélectionner un patient</option>
                                        ${patientOptions}
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Médecin</label>
                                    <select class="form-control" id="appointment-doctor" required>
                                        <option value="">Sélectionner un médecin</option>
                                        ${doctorOptions}
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Date</label>
                                    <input type="date" class="form-control" id="appointment-date" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Heure</label>
                                    <input type="time" class="form-control" id="appointment-time" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Motif de consultation</label>
                                <input type="text" class="form-control" id="appointment-reason" placeholder="ex: Consultation générale" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Statut</label>
                                <select class="form-control" id="appointment-status" required>
                                    <option value="Confirmé">Confirmé</option>
                                    <option value="En attente">En attente</option>
                                    <option value="Annulé">Annulé</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Notes supplémentaires</label>
                                <textarea class="form-control" id="appointment-notes" rows="3" placeholder="Notes optionnelles..."></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-primary" onclick="saveAppointment()">Enregistrer</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal
    const existing = document.getElementById('appointmentModal');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modal);
    const modalElement = new bootstrap.Modal(document.getElementById('appointmentModal'));
    modalElement.show();

    // Clear form
    document.getElementById('appointment-form').reset();
    // Set default date to today
    document.getElementById('appointment-date').valueAsDate = new Date();
    window.currentAppointmentId = null;
}

// Save appointment
function saveAppointment() {
    const form = document.getElementById('appointment-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const patientId = parseInt(document.getElementById('appointment-patient').value);
    const doctorId = parseInt(document.getElementById('appointment-doctor').value);

    // Get patient and doctor names
    const patient = patients.find(p => p.id === patientId);
    const doctor = doctors.find(d => d.id === doctorId);

    const appointment = {
        id: window.currentAppointmentId || Date.now(),
        patientId: patientId,
        patientName: patient ? patient.nom : 'Patient inconnu',
        doctorId: doctorId,
        doctorName: doctor ? doctor.nom : 'Médecin inconnu',
        date: document.getElementById('appointment-date').value,
        time: document.getElementById('appointment-time').value,
        reason: document.getElementById('appointment-reason').value,
        status: document.getElementById('appointment-status').value,
        notes: document.getElementById('appointment-notes').value
    };

    if (window.currentAppointmentId) {
        // Update existing
        const index = appointments.findIndex(a => a.id === window.currentAppointmentId);
        if (index !== -1) appointments[index] = appointment;
    } else {
        // Add new
        appointments.push(appointment);
    }

    saveAppointments();
    bootstrap.Modal.getInstance(document.getElementById('appointmentModal')).hide();
    showAppointments(currentAppointmentSearch, currentAppointmentPage, currentAppointmentItemsPerPage);
    showAlert('Rendez-vous enregistré!', 'success');
}

// Edit appointment
function editAppointment(id) {
    const appointment = appointments.find(a => a.id === id);
    if (appointment) {
        showAddAppointmentModal();
        document.getElementById('appointment-patient').value = appointment.patientId;
        document.getElementById('appointment-doctor').value = appointment.doctorId;
        document.getElementById('appointment-date').value = appointment.date;
        document.getElementById('appointment-time').value = appointment.time;
        document.getElementById('appointment-reason').value = appointment.reason;
        document.getElementById('appointment-status').value = appointment.status;
        document.getElementById('appointment-notes').value = appointment.notes;
        window.currentAppointmentId = id;
        document.querySelector('.modal-title').textContent = 'Modifier un Rendez-vous';
    }
}

// Delete appointment
function deleteAppointment(id) {
    if (confirm('Supprimer ce rendez-vous ?')) {
        appointments = appointments.filter(a => a.id !== id);
        saveAppointments();
        showAppointments(currentAppointmentSearch, currentAppointmentPage, currentAppointmentItemsPerPage);
        showAlert('Rendez-vous supprimé!', 'danger');
    }
}

// View appointment
function viewAppointment(id) {
    const appointment = appointments.find(a => a.id === id);
    if (appointment) {
        const modal = `
            <div class="modal fade" id="viewModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Détails du Rendez-vous</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p><strong>ID:</strong> ${appointment.id}</p>
                            <p><strong>Patient:</strong> ${appointment.patientName}</p>
                            <p><strong>Médecin:</strong> ${appointment.doctorName}</p>
                            <p><strong>Date:</strong> ${appointment.date}</p>
                            <p><strong>Heure:</strong> ${appointment.time}</p>
                            <p><strong>Motif:</strong> ${appointment.reason}</p>
                            <p><strong>Statut:</strong> <span class="badge bg-${appointment.status === 'Confirmé' ? 'success' : appointment.status === 'Annulé' ? 'danger' : 'warning'}">${appointment.status}</span></p>
                            ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
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

// Initialize appointments when script loads
loadAppointments();

// Global variables for pagination and search
let currentAppointmentPage = 1;
let currentAppointmentSearch = '';
let currentAppointmentItemsPerPage = 10;

// Handle appointment search and filter
function handleAppointmentSearch() {
    currentAppointmentSearch = document.getElementById('appointment-search').value;
    currentAppointmentItemsPerPage = parseInt(document.getElementById('appointment-items-per-page').value);
    currentAppointmentPage = 1; // Reset to first page
    showAppointments(currentAppointmentSearch, currentAppointmentPage, currentAppointmentItemsPerPage);
}

// Change appointment page
function changeAppointmentPage(page) {
    currentAppointmentPage = page;
    showAppointments(currentAppointmentSearch, currentAppointmentPage, currentAppointmentItemsPerPage);
}