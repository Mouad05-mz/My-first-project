// Simple Hospital App - Easy to understand for EMSI students
console.log('App starting...');

// Global variables
let currentView = 'dashboard';

// Simple function to load different sections
function loadContent(view) {
    console.log('Loading:', view);
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
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-primary" onclick="exportData('csv')">
                                <i class="bi bi-file-earmark-spreadsheet me-2"></i>Exporter CSV
                            </button>
                            <button class="btn btn-outline-danger" onclick="exportData('pdf')">
                                <i class="bi bi-file-earmark-pdf me-2"></i>Exporter PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="row mb-4">
            <div class="col-12">
                <h4 class="mb-3">Statistiques et Graphiques</h4>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="mb-0">Répartition des Patients par Tranche d'Âge</h6>
                    </div>
                    <div class="card-body">
                        <canvas id="ageChart" width="400" height="300"></canvas>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="mb-0">Statut des Rendez-vous</h6>
                    </div>
                    <div class="card-body">
                        <canvas id="appointmentChart" width="400" height="300"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="mb-0">Prescriptions par Mois</h6>
                    </div>
                    <div class="card-body">
                        <canvas id="prescriptionChart" width="400" height="300"></canvas>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="mb-0">Prix des Services</h6>
                    </div>
                    <div class="card-body">
                        <canvas id="serviceChart" width="400" height="300"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h6 class="mb-0">Spécialités des Médecins</h6>
                    </div>
                    <div class="card-body">
                        <canvas id="specialtyChart" width="400" height="300"></canvas>
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

    // Initialize charts after content is loaded
    setTimeout(() => {
        initializeCharts();
    }, 100);
}

// Placeholder functions for other sections
function showAppointments() {
    document.getElementById('main-content').innerHTML = `
        <h3>Rendez-vous</h3>
        <p>Cette fonctionnalité sera ajoutée prochainement.</p>
    `;
}

function showServices() {
    document.getElementById('main-content').innerHTML = `
        <h3>Services</h3>
        <p>Cette fonctionnalité sera ajoutée prochainement.</p>
    `;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing...');
    loadContent('dashboard');
});

// Initialize charts
function initializeCharts() {
    // Age distribution chart
    const ageCtx = document.getElementById('ageChart');
    if (ageCtx) {
        const ageData = getAgeDistribution();
        new Chart(ageCtx, {
            type: 'pie',
            data: {
                labels: ageData.labels,
                datasets: [{
                    data: ageData.data,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }

    // Appointment status chart
    const appointmentCtx = document.getElementById('appointmentChart');
    if (appointmentCtx) {
        const appointmentData = getAppointmentStatusData();
        new Chart(appointmentCtx, {
            type: 'bar',
            data: {
                labels: appointmentData.labels,
                datasets: [{
                    label: 'Nombre de rendez-vous',
                    data: appointmentData.data,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Prescription chart
    const prescriptionCtx = document.getElementById('prescriptionChart');
    if (prescriptionCtx) {
        const prescriptionData = getPrescriptionData();
        new Chart(prescriptionCtx, {
            type: 'line',
            data: {
                labels: prescriptionData.labels,
                datasets: [{
                    label: 'Prescriptions',
                    data: prescriptionData.data,
                    borderColor: '#36A2EB',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Service price chart
    const serviceCtx = document.getElementById('serviceChart');
    if (serviceCtx) {
        const serviceData = getServicePriceData();
        new Chart(serviceCtx, {
            type: 'bar',
            data: {
                labels: serviceData.labels,
                datasets: [{
                    label: 'Prix (DH)',
                    data: serviceData.data,
                    backgroundColor: '#4BC0C0',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Specialty chart
    const specialtyCtx = document.getElementById('specialtyChart');
    if (specialtyCtx) {
        const specialtyData = getSpecialtyData();
        new Chart(specialtyCtx, {
            type: 'doughnut',
            data: {
                labels: specialtyData.labels,
                datasets: [{
                    data: specialtyData.data,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }
}

// Chart data functions
function getAgeDistribution() {
    const patients = JSON.parse(localStorage.getItem('hospital_patients') || '[]');
    const ageGroups = {
        '0-18': 0,
        '19-35': 0,
        '36-50': 0,
        '51-65': 0,
        '65+': 0
    };

    patients.forEach(patient => {
        const age = patient.age;
        if (age <= 18) ageGroups['0-18']++;
        else if (age <= 35) ageGroups['19-35']++;
        else if (age <= 50) ageGroups['36-50']++;
        else if (age <= 65) ageGroups['51-65']++;
        else ageGroups['65+']++;
    });

    return {
        labels: Object.keys(ageGroups),
        data: Object.values(ageGroups)
    };
}

function getAppointmentStatusData() {
    const appointments = JSON.parse(localStorage.getItem('hospital_appointments') || '[]');
    const statusCount = {
        'Confirmé': 0,
        'En attente': 0,
        'Annulé': 0
    };

    appointments.forEach(appointment => {
        if (statusCount[appointment.status] !== undefined) {
            statusCount[appointment.status]++;
        }
    });

    return {
        labels: Object.keys(statusCount),
        data: Object.values(statusCount)
    };
}

function getPrescriptionData() {
    const prescriptions = JSON.parse(localStorage.getItem('hospital_prescriptions') || '[]');
    const monthlyData = {};

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const key = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
        monthlyData[key] = 0;
    }

    prescriptions.forEach(prescription => {
        const date = new Date(prescription.date);
        const key = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
        if (monthlyData[key] !== undefined) {
            monthlyData[key]++;
        }
    });

    return {
        labels: Object.keys(monthlyData),
        data: Object.values(monthlyData)
    };
}

function getServicePriceData() {
    const services = JSON.parse(localStorage.getItem('hospital_services') || '[]');
    return {
        labels: services.map(service => service.nom),
        data: services.map(service => service.prix)
    };
}

function getSpecialtyData() {
    const doctors = JSON.parse(localStorage.getItem('hospital_doctors') || '[]');
    const specialtyCount = {};

    doctors.forEach(doctor => {
        const specialty = doctor.specialite;
        specialtyCount[specialty] = (specialtyCount[specialty] || 0) + 1;
    });

    return {
        labels: Object.keys(specialtyCount),
        data: Object.values(specialtyCount)
    };
}

// Export functions
function exportData(format) {
    if (format === 'csv') {
        exportToCSV();
    } else if (format === 'pdf') {
        exportToPDF();
    }
}

function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add headers
    csvContent += "Section,Data\n";

    // Add summary data
    csvContent += `Patients,${getPatientCount()}\n`;
    csvContent += `Médecins,${getDoctorCount()}\n`;
    csvContent += `Prescriptions,${getPrescriptionCount()}\n`;
    csvContent += `Rendez-vous,${getAppointmentCount()}\n`;
    csvContent += `Services,${getServiceCount()}\n`;

    // Add detailed data
    const patients = JSON.parse(localStorage.getItem('hospital_patients') || '[]');
    patients.forEach(patient => {
        csvContent += `Patient,"${patient.nom},${patient.age},${patient.telephone},${patient.email}"\n`;
    });

    const doctors = JSON.parse(localStorage.getItem('hospital_doctors') || '[]');
    doctors.forEach(doctor => {
        csvContent += `Médecin,"${doctor.nom},${doctor.specialite},${doctor.telephone},${doctor.email}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "hospital_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showAlert('Données exportées en CSV!', 'success');
}

function exportToPDF() {
    // Simple PDF export using browser print
    const printContent = `
        <html>
        <head>
            <title>Hospital Management System - Rapport</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #007bff; }
                .summary { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1>Rapport du Système Hospitalier</h1>
            <div class="summary">
                <h3>Résumé</h3>
                <p>Patients: ${getPatientCount()}</p>
                <p>Médecins: ${getDoctorCount()}</p>
                <p>Prescriptions: ${getPrescriptionCount()}</p>
                <p>Rendez-vous: ${getAppointmentCount()}</p>
                <p>Services: ${getServiceCount()}</p>
                <p>Date: ${new Date().toLocaleDateString('fr-FR')}</p>
            </div>
            <p>Rapport généré automatiquement par le système hospitalier.</p>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();

    showAlert('Rapport PDF généré!', 'success');
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