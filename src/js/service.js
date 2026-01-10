// Simple Services Management
let services = [];

// Load services from localStorage
function loadServices() {
    services = JSON.parse(localStorage.getItem('hospital_services') || '[]');
}

// Save services to localStorage
function saveServices() {
    localStorage.setItem('hospital_services', JSON.stringify(services));
}

// Show services table
function showServices() {
    loadServices();
    const content = `
        <h3>Services Médicaux</h3>
        <button class="btn btn-primary mb-3" onclick="showAddServiceModal()">Ajouter un Service</button>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Prix (€)</th>
                        <th>Durée (min)</th>
                        <th>Disponible</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${services.map(service => `
                        <tr>
                            <td>${service.nom}</td>
                            <td>${service.description}</td>
                            <td>${service.prix}</td>
                            <td>${service.duree}</td>
                            <td>${service.disponible ? 'Oui' : 'Non'}</td>
                            <td>
                                <button class="btn btn-sm btn-warning" onclick="editService(${service.id})">Modifier</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteService(${service.id})">Supprimer</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    document.getElementById('main-content').innerHTML = content;
}

// Show add/edit modal
function showAddServiceModal(isEditing = false) {
    const modalContent = `
        <div class="modal fade" id="serviceModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${isEditing ? 'Modifier' : 'Ajouter'} un Service</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="service-form">
                            <div class="mb-3">
                                <label class="form-label">Nom</label>
                                <input type="text" class="form-control" id="service-nom" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Description</label>
                                <textarea class="form-control" id="service-description" required></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Prix (€)</label>
                                <input type="number" class="form-control" id="service-prix" step="0.01" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Durée (minutes)</label>
                                <input type="number" class="form-control" id="service-duree" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Disponible</label>
                                <select class="form-control" id="service-disponible">
                                    <option value="true">Oui</option>
                                    <option value="false">Non</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary">Enregistrer</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalContent);

    const modalElement = document.getElementById('serviceModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    // Handle form submission
    document.getElementById('service-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveService();
    });

    // Clear form only when adding new service
    if (!isEditing) {
        document.getElementById('service-form').reset();
        window.currentServiceId = null;
    }

    // Remove modal from DOM after hiding
    modalElement.addEventListener('hidden.bs.modal', function() {
        modalElement.remove();
    });
}

// Save service
function saveService() {
    const form = document.getElementById('service-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const serviceData = {
        id: window.currentServiceId || Date.now(),
        nom: document.getElementById('service-nom').value,
        description: document.getElementById('service-description').value,
        prix: parseFloat(document.getElementById('service-prix').value),
        duree: parseInt(document.getElementById('service-duree').value),
        disponible: document.getElementById('service-disponible').value === 'true'
    };

    if (window.currentServiceId) {
        // Update existing
        const index = services.findIndex(s => s.id === window.currentServiceId);
        if (index !== -1) {
            services[index] = serviceData;
        }
    } else {
        // Add new
        services.push(serviceData);
    }

    saveServices();
    bootstrap.Modal.getInstance(document.getElementById('serviceModal')).hide();
    showServices();
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
        showServices();
        showAlert('Service supprimé!', 'danger');
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