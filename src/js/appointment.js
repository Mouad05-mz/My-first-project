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
            doctorName: 'Dr. Redouan Mohamed',
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

// Show appointments table
function showAppointments() {
    loadAppointments();
    
    const content = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3>Gestion des Rendez-vous</h3>
            <button class="btn btn-success" onclick="showAddAppointmentModal()">
                <i class="bi bi-plus-circle"></i> Ajouter Rendez-vous
            </button>
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
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${appointments.length === 0 ? 
                        '<tr><td colspan="7" class="text-center">Aucun rendez-vous trouvé. Cliquez sur "Ajouter Rendez-vous" pour en créer un.</td></tr>' : 
                        appointments.map(appointment => 
                            `<tr>
                                <td>${appointment.id}</td>
                                <td>${appointment.patientName || 'N/A'}</td>
                                <td>${appointment.doctorName || 'N/A'}</td>
                                <td>${appointment.date || 'N/A'}</td>
                                <td>${appointment.time || 'N/A'}</td>
                                <td>${appointment.status || 'N/A'}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm me-1" onclick="editAppointment(${appointment.id})">
                                        <i class="bi bi-pencil"></i> Modifier
                                    </button>
                                    <button class="btn btn-danger btn-sm" onclick="deleteAppointment(${appointment.id})">
                                        <i class="bi bi-trash"></i> Supprimer
                                    </button>
                                </td>
                            </tr>`
                        ).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = content;
    }
}

// Show add appointment modal
function showAddAppointmentModal(isEditing = false) {
    // Load data from localStorage
    const patientsData = JSON.parse(localStorage.getItem('hospital_patients') || '[]');
    const doctorsData = JSON.parse(localStorage.getItem('hospital_doctors') || '[]');
    
    const patientOptions = patientsData.map(p => `<option value="${p.id}">${p.nom}</option>`).join('');
    const doctorOptions = doctorsData.map(d => `<option value="${d.id}">${d.nom}</option>`).join('');

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

    // Clear form only when adding new appointment
    if (!isEditing) {
        document.getElementById('appointment-form').reset();
        // Set default date to today
        document.getElementById('appointment-date').valueAsDate = new Date();
        window.currentAppointmentId = null;
    }
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

    // Get patient and doctor names from localStorage
    const patientsData = JSON.parse(localStorage.getItem('hospital_patients') || '[]');
    const doctorsData = JSON.parse(localStorage.getItem('hospital_doctors') || '[]');
    
    const patient = patientsData.find(p => p.id === patientId);
    const doctor = doctorsData.find(d => d.id === doctorId);

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
    showAppointments();
    showAlert('Rendez-vous enregistré!', 'success');
}

// Edit appointment
function editAppointment(id) {
    const appointment = appointments.find(a => a.id === id);
    if (appointment) {
        showAddAppointmentModal(true); // Pass true for editing
        // Use setTimeout to ensure modal is fully loaded before populating fields
        setTimeout(() => {
            document.getElementById('appointment-patient').value = appointment.patientId;
            document.getElementById('appointment-doctor').value = appointment.doctorId;
            document.getElementById('appointment-date').value = appointment.date;
            document.getElementById('appointment-time').value = appointment.time;
            document.getElementById('appointment-reason').value = appointment.reason;
            document.getElementById('appointment-status').value = appointment.status;
            document.getElementById('appointment-notes').value = appointment.notes;
            window.currentAppointmentId = id;
            document.querySelector('.modal-title').textContent = 'Modifier un Rendez-vous';
        }, 100);
    }
}

// Delete appointment
function deleteAppointment(id) {
    if (confirm('Supprimer ce rendez-vous ?')) {
        appointments = appointments.filter(a => a.id !== id);
        saveAppointments();
        showAppointments();
        showAlert('Rendez-vous supprimé!', 'danger');
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