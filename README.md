# ESGI NestJS Watchlist API

## Installation

```bash
# Installer les dépendances
npm install
```

## Démarrage

```bash
# Mode développement
npm run start:dev
```

L'application démarre sur `http://localhost:3000`
Documentation Swagger: `http://localhost:3000/api`

## Parcours utilisateur

### 1. Inscription

```bash
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123"
}
```

Un email avec un token de validation est envoyé (il faut aller consulter les logs pour voir le token).

### 2. Validation de l'email

```bash
POST /auth/verify-email
{
  "emailToken": "abc123def456"
}
```

### 3. Connexion

```bash
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

Un code 2FA à 6 chiffres est envoyé par email (il faut aller consulter les logs).

### 4. Validation 2FA

```bash
POST /auth/verify-2fa
{
  "email": "user@example.com",
  "emailToken": "123456"
}
```

Retourne un jeton JWT token qu'il faut utiliser après pour les requêtes authentifiées.

### 5. Utilisation de l'API

Ajouter le jeton dans le Swagger pour autoriser l'utilisateur a utiliser toutes les requêtes privées.

```bash
# Ajouter un film
POST /watched-movies
Authorization: Bearer <token>
{
  "title": "Inception",
  "director": "Christopher Nolan",
  "year": 2010,
  "notes": "Amazing movie!"
}

# Récupérer mes films
GET /watched-movies
Authorization: Bearer <token>

# Récupérer un film spécifique
GET /watched-movies/:id
Authorization: Bearer <token>

# Modifier un film
PATCH /watched-movies/:id
Authorization: Bearer <token>
{
  "notes": "Watched it again, still amazing!"
}

# Supprimer un film
DELETE /watched-movies/:id
Authorization: Bearer <token>
```

### 6. Endpoints Admin uniquement

```bash
# Voir tous les films de tous les utilisateurs
GET /watched-movies/admin/all
Authorization: Bearer <admin_token>
```

## Créer un compte Admin

Pour créer un admin, modifier directement la base de données :

```sql
-- Ouvrir database.sqlite avec sqlite
sqlite3 database.sqlite
-- Mettre à jour l'utilisateur inscrit et lui mettre le rôle admin
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
-- Pour vérifier si l'utilisateur a bien le rôle admin
SELECT id, email, role FROM users;
-- Sortir de sqlite
.quit
```
