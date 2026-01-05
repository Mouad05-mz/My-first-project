# Hospital Management System

Système de gestion hospitalière développé en HTML, CSS et JavaScript. L'application permet de gérer les patients, les médecins et les prescriptions.

## Description

Ce projet est une application web pour gérer les informations des patients, des médecins et des prescriptions médicales. Les données sont stockées localement dans le navigateur et persistent entre les sessions.

## Structure du Projet

```
├── index.html              # Page de connexion
├── dashboard.html          # Interface principale
├── README.md              # Documentation
└── src/
    ├── css/
    │   ├── style.css       # Styles de la page de connexion
    │   ├── dashboard.css   # Styles du tableau de bord
    │   └── patient.css     # Styles des tableaux
    └── js/
        ├── app.js          # Logique de navigation
        ├── patient.js      # Gestion des patients
        ├── doctor.js       # Gestion des médecins
        ├── prescription.js # Gestion des prescriptions
        ├── appointment.js  # Gestion des rendez-vous
        └── service.js      # Gestion des services
```

## Fonctionnalités

### Gestion des Patients
- Ajouter un nouveau patient
- Voir les détails d'un patient
- Modifier les informations d'un patient
- Supprimer un patient
- **Recherche et filtrage par nom, âge, téléphone, email**
- **Pagination avec options (5, 10, 25, 50 éléments par page)**

### Gestion des Médecins
- Ajouter un nouveau médecin
- Voir les détails d'un médecin
- Modifier les informations d'un médecin
- Supprimer un médecin
- **Recherche et filtrage par nom, spécialité, email**
- **Pagination avec options (5, 10, 25, 50 éléments par page)**

### Gestion des Prescriptions
- Ajouter une prescription
- Voir les détails d'une prescription
- Modifier une prescription
- Supprimer une prescription
- **Recherche et filtrage par patient, médecin, médicament, date**
- **Pagination avec options (5, 10, 25, 50 éléments par page)**

### Gestion des Rendez-vous
- Planifier un rendez-vous
- Voir les détails d'un rendez-vous
- Modifier un rendez-vous
- Supprimer un rendez-vous
- Gérer les statuts (Confirmé, En attente, Annulé)
- **Recherche et filtrage par patient, médecin, motif, statut, date**
- **Pagination avec options (5, 10, 25, 50 éléments par page)**

### Gestion des Services
- Ajouter un service médical
- Voir les détails d'un service
- Modifier un service
- Supprimer un service
- Gérer la disponibilité et les prix
- **Recherche et filtrage par nom, description, durée, disponibilité**
- **Pagination avec options (5, 10, 25, 50 éléments par page)**

### Tableau de Bord
- Affichage des statistiques (patients, médecins, prescriptions, rendez-vous, services)
- Navigation rapide entre les sections
- Interface responsive
- **5 graphiques interactifs (répartition par âge, statuts rendez-vous, prescriptions mensuelles, prix services, spécialités médecins)**
- **Export des données (CSV et PDF)**

## 🛠 Stack Technique

*   **HTML5 / CSS3** (Framework CSS utilisé : **Bootstrap 5.3.0**)
*   **JavaScript (ES6+)** (Vanilla JS obligatoire - Aucun framework JS utilisé)
*   **Bibliothèques JS utilisées :** Chart.js (pour les graphiques), Bootstrap 5.3.0 (composants UI)

### APIs Utilisées
<!-- Aucune API externe utilisée - Données stockées localement -->
*   **Source des données : localStorage (navigateur) - Données mockées/persistées localement**
    *   Aucune API externe requise - Application fonctionnelle hors ligne
    *   Persistance automatique des données dans le navigateur

## Technologies

- HTML5
- CSS3 avec Bootstrap 5.3.0
- JavaScript ES6+
- localStorage pour la persistance des données
- Bootstrap Icons
- Chart.js pour les graphiques

## ⚙️ Installation Locale

Pour lancer le projet localement :

1.  Cloner le repo :
    ```bash
    git clone https://github.com/votre-user/votre-repo.git
    ```
2.  Ouvrir le dossier :
    ```bash
    cd votre-dossier
    ```
3.  Lancer l'application :
    *   Ouvrez simplement `index.html` dans votre navigateur.
    *   OU utilisez Live Server (VS Code Extension).

## Utilisation

### Accès à l'Application
1. Ouvrez `index.html` pour la page de connexion
2. Entrez un identifiant et un mot de passe
3. Cliquez sur "Connexion"
4. Ouvrez `dashboard.html` pour utiliser l'application

### Ajouter des Données
1. Cliquez sur la section souhaitée dans la barre de navigation (Patients, Médecins, Prescriptions)
2. Cliquez sur le bouton "Ajouter"
3. Remplissez le formulaire
4. Cliquez sur "Enregistrer"

### Modifier des Données
1. Ouvrez la section correspondante
2. Cliquez sur le bouton "Modifier" (crayon jaune)
3. Modifiez les informations
4. Cliquez sur "Enregistrer"

### Voir les Détails
1. Cliquez sur le bouton "Voir" (œil bleu) pour afficher les détails

### Supprimer des Données
1. Cliquez sur le bouton "Supprimer" (poubelle rouge)
2. Confirmez la suppression

## Stockage des Données

Les données sont stockées dans localStorage du navigateur. Pour voir ou réinitialiser les données:
1. Ouvrez les outils développeur (F12)
2. Allez dans "Application" → "Local Storage"
3. Vous verrez les clés: `hospital_patients`, `hospital_doctors`, `hospital_prescriptions`

## Améliorations Futures

- Implémentation d'une authentification sécurisée
- Connexion à une base de données
- Rapport et statistiques avancées
- Export des données (PDF, Excel)
- Notifications et rappels
- Interface mobile native

## Navigateurs Supportés

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Auteurs
- Mouad Mezyan
- Kamil Elhaiba
- Marouane Younsi

## Répartition du Travail
- Mouad Mezyan : Structure HTML, dashboard, logique principale
- Kamil Elhaiba : CSS & design
- Marouane Younsi : Gestion patients / médecins