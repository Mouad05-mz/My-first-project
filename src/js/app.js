console.log('App starting...');

// Global variables
let currentView = 'dashboard';

// Simple function to load different sections
function loadContent(view) {
    currentView = view;

    // Update active menu item
    const menuItems = document.querySelectorAll('.nav-link');
    menuItems.forEach(item => item.classList.remove('active'));

    const activeItem = document.querySelector(`[onclick="loadContent('${view}')"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }

    // Load the right content
    if (view === 'dashboard') {
        showDashboard();
    } else if (view === 'patients') {
        showPatients();
    } else if (view === 'doctors') {
        showDoctors();
    } else if (view === 'prescriptions') {
        showPrescriptions();
    } else if (view === 'appointments') {
        showAppointments();
    } else if (view === 'services') {
        showServices();
    }
}

// Simple logout function
function logout() {
    if (confirm('Voulez-vous vous déconnecter ?')) {
        window.location.href = 'index.html';
    }
}

// Dashboard display
function showDashboard() {
    const content = `
        <div class="row">
            <div class="col-md-3 mb-4">
                <div class="card bg-primary text-white" style="cursor: pointer;" onclick="loadContent('patients')">
                    <div class="card-body text-center">
                        <h5 class="card-title">Patients</h5>
                        <h2 id="patient-count">${getPatientCount()}</h2>
                        <small>Cliquez pour gérer</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="card bg-success text-white" style="cursor: pointer;" onclick="loadContent('doctors')">
                    <div class="card-body text-center">
                        <h5 class="card-title">Médecins</h5>
                        <h2 id="doctor-count">${getDoctorCount()}</h2>
                        <small>Cliquez pour gérer</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="card bg-info text-white" style="cursor: pointer;" onclick="loadContent('prescriptions')">
                    <div class="card-body text-center">
                        <h5 class="card-title">Prescriptions</h5>
                        <h2 id="prescription-count">${getPrescriptionCount()}</h2>
                        <small>Cliquez pour gérer</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="card bg-warning text-white" style="cursor: pointer;" onclick="loadContent('appointments')">
                    <div class="card-body text-center">
                        <h5 class="card-title">Rendez-vous</h5>
                        <h2 id="appointment-count">${getAppointmentCount()}</h2>
                        <small>Cliquez pour gérer</small>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mb-4">
            <div class="col-md-6 mb-4">
                <div class="card bg-secondary text-white" style="cursor: pointer;" onclick="loadContent('services')">
                    <div class="card-body text-center">
                        <h5 class="card-title">Services</h5>
                        <h2 id="service-count">${getServiceCount()}</h2>
                        <small>Cliquez pour gérer</small>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Actions Rapides</h5>
                        <p class="text-muted">Cliquez sur les cartes pour gérer chaque section.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-center mt-4">
            <h3>Bienvenue dans le système hospitalier</h3>
            <p class="text-muted">Cliquez sur les cartes ci-dessus ou utilisez le menu à gauche pour naviguer</p>
        </div>
    `;
    document.getElementById('main-content').innerHTML = content;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing...');
    loadContent('dashboard');
});

// Simple count functions
function getPatientCount() {
    const patients = JSON.parse(localStorage.getItem('hospital_patients') || '[]');
    return patients.length;
}

function getDoctorCount() {
    const doctors = JSON.parse(localStorage.getItem('hospital_doctors') || '[]');
    return doctors.length;
}

function getPrescriptionCount() {
    const prescriptions = JSON.parse(localStorage.getItem('hospital_prescriptions') || '[]');
    return prescriptions.length;
}

function getAppointmentCount() {
    const appointments = JSON.parse(localStorage.getItem('hospital_appointments') || '[]');
    return appointments.length;
}

function getServiceCount() {
    const services = JSON.parse(localStorage.getItem('hospital_services') || '[]');
    return services.length;
}

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