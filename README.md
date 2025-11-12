# Projet Gestion Étudiant

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white)](https://angular.io/) 
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/) 
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/) 

---

## Description
**Gestion Étudiant** est une application complète pour gérer les étudiants.  
Elle comprend un **frontend Angular** pour l’interface utilisateur et un **backend Node.js/Express** pour la gestion des données avec une base MySQL.  
Le projet est conçu pour être modulable, moderne et facile à déployer.  

---

## Technologies utilisées

### Frontend
- Angular
- HTML / CSS / TypeScript
- Bootstrap 5
- Font Awesome

### Backend
- Node.js
- Express.js
- MySQL
- JWT pour l’authentification (si utilisé)
- Nodemon pour le développement

### Outils
- Git / GitHub
- VS Code
- Postman pour tester les API

---

## Structure du projet

Le projet est organisé en deux parties principales : le frontend et le backend.

- **Frontend Angular** : contient toute l'interface utilisateur, les composants, les services et les fichiers de configuration Angular.
- **Backend Node.js/Express** : contient les routes, les contrôleurs, les modèles de base de données et les fichiers nécessaires pour gérer les données des étudiants.
- **.gitignore** : liste des fichiers et dossiers à ignorer par Git.
- **README.md** : documentation complète du projet.

---

## Installation et exécution

### Frontend Angular
```bash
cd Etudiant-client
npm install          # Installer les dépendances
ng serve             # Lancer le serveur de développement
### Backend Node.js
cd gestion-Back-end
npm install          # Installer les dépendances
node index.js        # Lancer le serveur Node.js
### Git & Déploiement
git add .
git commit 
git push origin main
