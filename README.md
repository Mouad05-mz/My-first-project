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

# Hospital Management System - Simplified Version

Système de gestion hospitalière simplifié développé en HTML, CSS et JavaScript. Cette version est conçue pour être facilement compréhensible lors d'une présentation.

## Description

Ce projet est une application web simplifiée pour gérer les informations des patients, médecins, prescriptions, rendez-vous et services. Les données sont stockées localement dans le navigateur. Cette version a été simplifiée pour faciliter la compréhension du code lors d'une présentation.

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

## Fonctionnalités Simplifiées

### Gestion des Patients
- Ajouter un nouveau patient
- Modifier les informations d'un patient
- Supprimer un patient
- Affichage simple en tableau

### Gestion des Médecins
- Ajouter un nouveau médecin
- Modifier les informations d'un médecin
- Supprimer un médecin
- Affichage simple en tableau

### Gestion des Prescriptions
- Ajouter une prescription
- Modifier une prescription
- Supprimer une prescription
- Affichage simple en tableau

### Gestion des Rendez-vous
- Planifier un rendez-vous
- Modifier un rendez-vous
- Supprimer un rendez-vous
- Affichage simple en tableau

### Gestion des Services
- Ajouter un service médical
- Modifier un service
- Supprimer un service
- Affichage simple en tableau

### Tableau de Bord
- Affichage des compteurs pour chaque section
- Navigation simple par clic sur les cartes
- Interface claire et épurée

## 🛠 Stack Technique

*   **HTML5 / CSS3** (Framework CSS utilisé : **Bootstrap 5.3.0**)
*   **JavaScript (ES6+)** (Vanilla JS - code simplifié pour la présentation)
*   **Bibliothèques JS :** Bootstrap 5.3.0 (composants UI)

### Stockage des Données
*   **localStorage** - Données persistées localement dans le navigateur
*   Aucune API externe - Application fonctionnelle hors ligne

## Technologies

- HTML5
- CSS3 avec Bootstrap 5.3.0
- JavaScript ES6+ (simplifié)
- localStorage pour la persistance des données
- Bootstrap Icons

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
2. Entrez un identifiant et un mot de passe (n'importe lesquels)
3. Cliquez sur "Connexion"
4. L'application redirige automatiquement vers `dashboard.html`

### Navigation
- Utilisez le menu latéral ou cliquez sur les cartes du dashboard
- Chaque section affiche un tableau simple avec les données
- Boutons "Ajouter", "Modifier", "Supprimer" pour chaque élément

### Ajouter des Données
1. Cliquez sur la section souhaitée
2. Cliquez sur le bouton "Ajouter"
3. Remplissez le formulaire dans la modale
4. Cliquez sur "Enregistrer"

### Modifier des Données
1. Dans le tableau, cliquez sur "Modifier" (crayon)
2. Modifiez les informations dans la modale
3. Cliquez sur "Enregistrer"

### Supprimer des Données
1. Cliquez sur "Supprimer" (poubelle rouge)
2. Confirmez la suppression

## Stockage des Données

Les données sont stockées dans localStorage du navigateur. Pour voir ou réinitialiser les données:
1. Ouvrez les outils développeur (F12)
2. Allez dans "Application" → "Local Storage"
3. Vous verrez les clés: `hospital_patients`, `hospital_doctors`, `hospital_prescriptions`

## Version Simplifiée

Cette version du système hospitalier a été simplifiée pour :
- Faciliter la compréhension du code lors d'une présentation
- Montrer les concepts de base du JavaScript
- Éviter la complexité des fonctionnalités avancées

### Fonctionnalités supprimées dans cette version :
- Recherche et filtrage
- Pagination
- Graphiques et statistiques
- Export des données
- Fonctions "Voir les détails"
- Authentification sécurisée

### Fonctionnalités conservées :
- CRUD basique (Créer, Lire, Modifier, Supprimer)
- Navigation simple
- Modales Bootstrap
- Stockage localStorage
- Interface responsive

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