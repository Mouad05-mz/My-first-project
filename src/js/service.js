// Simple Service Manager - Easy to understand
console.log('ServiceManager loading...');

// Global services array
let services = [];

// Load services from localStorage
function loadServices() {
    const saved = localStorage.getItem('hospital_services');
    if (saved) {
        services = JSON.parse(saved);
    } else {
        // Add sample services
        services = [
            {
                id: 1,
                nom: 'Consultation générale',
                description: 'Consultation médicale de base',
                prix: 150,
                duree: '30 minutes',
                disponible: true
            },
            {
                id: 2,
                nom: 'Radiologie',
                description: 'Examens radiologiques',
                prix: 300,
                duree: '45 minutes',
                disponible: true
            }
        ];
        saveServices();
    }
    return services;
}

// Save services to localStorage
function saveServices() {
    localStorage.setItem('hospital_services', JSON.stringify(services));
}

// Get service count
function getServiceCount() {
    return services.length;
}

// Show services table with search, filter and pagination
function showServices(search = '', page = 1, itemsPerPage = 10) {
    // Filter services based on search
    let filteredServices = services.filter(service =>
        service.nom.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase()) ||
        service.duree.toLowerCase().includes(search.toLowerCase()) ||
        (service.disponible ? 'disponible' : 'indisponible').includes(search.toLowerCase())
    );

    const totalItems = filteredServices.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedServices = filteredServices.slice(startIndex, endIndex);

    const content = `
        <div class="d-flex justify-content-between mb-3">
            <h3>Gestion des Services</h3>
            <button class="btn btn-success" onclick="showAddServiceModal()">
                <i class="bi bi-plus-circle"></i> Ajouter Service
            </button>
        </div>

        <!-- Search and Filter Controls -->
        <div class="row mb-3">
            <div class="col-md-6">
                <input type="text" id="service-search" class="form-control" placeholder="Rechercher par nom, description, durée ou disponibilité..." value="${search}" onkeyup="handleServiceSearch()">
            </div>
            <div class="col-md-3">
                <select id="service-items-per-page" class="form-select" onchange="handleServiceSearch()">
                    <option value="5" ${itemsPerPage === 5 ? 'selected' : ''}>5 par page</option>
                    <option value="10" ${itemsPerPage === 10 ? 'selected' : ''}>10 par page</option>
                    <option value="25" ${itemsPerPage === 25 ? 'selected' : ''}>25 par page</option>
                    <option value="50" ${itemsPerPage === 50 ? 'selected' : ''}>50 par page</option>
                </select>
            </div>
            <div class="col-md-3 text-end">
                <small class="text-muted">Total: ${totalItems} services</small>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nom du Service</th>
                        <th>Description</th>
                        <th>Prix (DH)</th>
                        <th>Durée</th>
                        <th>Disponibilité</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${paginatedServices.map(service => `
                        <tr>
                            <td>${service.id}</td>
                            <td>${service.nom}</td>
                            <td>${service.description}</td>
                            <td>${service.prix} DH</td>
                            <td>${service.duree}</td>
                            <td><span class="badge bg-${service.disponible ? 'success' : 'danger'}">${service.disponible ? 'Disponible' : 'Indisponible'}</span></td>
                            <td>
                                <button class="btn btn-info btn-sm me-1" onclick="viewService(${service.id})">
                                    <i class="bi bi-eye"></i> Voir
                                </button>
                                <button class="btn btn-warning btn-sm me-1" onclick="editService(${service.id})">
                                    <i class="bi bi-pencil"></i> Modifier
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="deleteService(${service.id})">
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
        <nav aria-label="Service pagination">
            <ul class="pagination justify-content-center">
                <li class="page-item ${page === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeServicePage(${page - 1})">Précédent</a>
                </li>
                ${Array.from({length: totalPages}, (_, i) => i + 1).map(p => `
                    <li class="page-item ${p === page ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="changeServicePage(${p})">${p}</a>
                    </li>
                `).join('')}
                <li class="page-item ${page === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeServicePage(${page + 1})">Suivant</a>
                </li>
            </ul>
        </nav>
        ` : ''}
    `;
    document.getElementById('main-content').innerHTML = content;
}

// Show add service modal
function showAddServiceModal(isEditing = false) {
    const modal = `
        <div class="modal fade" id="serviceModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Ajouter un Service</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="service-form">
                            <div class="mb-3">
                                <label class="form-label">Nom du service</label>
                                <input type="text" class="form-control" id="service-nom" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Description</label>
                                <textarea class="form-control" id="service-description" rows="3" required></textarea>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Prix (DH)</label>
                                    <input type="number" class="form-control" id="service-prix" min="0" step="0.01" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Durée</label>
                                    <input type="text" class="form-control" id="service-duree" placeholder="ex: 30 minutes" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Disponibilité</label>
                                <select class="form-control" id="service-disponible" required>
                                    <option value="true">Disponible</option>
                                    <option value="false">Indisponible</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-primary" onclick="saveService()">Enregistrer</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal
    const existing = document.getElementById('serviceModal');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modal);
    const modalElement = new bootstrap.Modal(document.getElementById('serviceModal'));
    modalElement.show();

    // Clear form only if not editing
    if (!isEditing) {
        document.getElementById('service-form').reset();
        window.currentServiceId = null;
    }
}

// Save service
function saveService() {
    const form = document.getElementById('service-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const service = {
        id: window.currentServiceId || Date.now(),
        nom: document.getElementById('service-nom').value,
        description: document.getElementById('service-description').value,
        prix: parseFloat(document.getElementById('service-prix').value),
        duree: document.getElementById('service-duree').value,
        disponible: document.getElementById('service-disponible').value === 'true'
    };

    if (window.currentServiceId) {
        // Update existing
        const index = services.findIndex(s => s.id === window.currentServiceId);
        if (index !== -1) services[index] = service;
    } else {
        // Add new
        services.push(service);
    }

    saveServices();
    bootstrap.Modal.getInstance(document.getElementById('serviceModal')).hide();
    showServices(currentServiceSearch, currentServicePage, currentServiceItemsPerPage);
    showAlert('Service enregistré!', 'success');
}

// Edit service
function editService(id) {
    const service = services.find(s => s.id === id);
    if (service) {
        showAddServiceModal(true);
        setTimeout(() => {
            document.getElementById('service-nom').value = service.nom;
            document.getElementById('service-description').value = service.description;
            document.getElementById('service-prix').value = service.prix;
            document.getElementById('service-duree').value = service.duree;
            document.getElementById('service-disponible').value = service.disponible.toString();
            window.currentServiceId = id;
            document.querySelector('.modal-title').textContent = 'Modifier un Service';
        }, 100);
    }
}

// Delete service
function deleteService(id) {
    if (confirm('Supprimer ce service ?')) {
        services = services.filter(s => s.id !== id);
        saveServices();
        showServices(currentServiceSearch, currentServicePage, currentServiceItemsPerPage);
        showAlert('Service supprimé!', 'danger');
    }
}

// View service
function viewService(id) {
    const service = services.find(s => s.id === id);
    if (service) {
        const modal = `
            <div class="modal fade" id="viewModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Détails du Service</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p><strong>ID:</strong> ${service.id}</p>
                            <p><strong>Nom:</strong> ${service.nom}</p>
                            <p><strong>Description:</strong> ${service.description}</p>
                            <p><strong>Prix:</strong> ${service.prix} DH</p>
                            <p><strong>Durée:</strong> ${service.duree}</p>
                            <p><strong>Disponibilité:</strong> <span class="badge bg-${service.disponible ? 'success' : 'danger'}">${service.disponible ? 'Disponible' : 'Indisponible'}</span></p>
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

// Initialize services when script loads
loadServices();

// Global variables for pagination and search
let currentServicePage = 1;
let currentServiceSearch = '';
let currentServiceItemsPerPage = 10;

// Handle service search and filter
function handleServiceSearch() {
    currentServiceSearch = document.getElementById('service-search').value;
    currentServiceItemsPerPage = parseInt(document.getElementById('service-items-per-page').value);
    currentServicePage = 1; // Reset to first page
    showServices(currentServiceSearch, currentServicePage, currentServiceItemsPerPage);
}

// Change service page
function changeServicePage(page) {
    currentServicePage = page;
    showServices(currentServiceSearch, currentServicePage, currentServiceItemsPerPage);
}