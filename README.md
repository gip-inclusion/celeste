# Celeste

Céleste est une tentative technique de réponse à la question : sur le plan de l’IT (qui n’est qu’une dimension de l’équation globale, avec celle humaine ou politique), à quoi ressemblerait une solution permettant à tous les intervenants dans le domaine de l’inclusion d’avoir le maximum d’informations, propositions et outils utiles pour accompagner au mieux un demandeur d’emploi en situation difficile ?

## Installation

**1/** Récupérer les sources du projet

```
git clone git@github.com:gip-inclusion/celeste.git && cd celeste
```

**2/** Créer le fichier .env en le copiant depuis le fichier .env.example

```
cp .env.example .env
```

**3/** Démarrer un conteneur PostgreSQL

```
docker compose up -d
```

**4/** Installer les dépendances

```
npm install
```

**5/** Initialiser la base de données (la supprime si existante)

```
npm run db:init
```

**6/** Démarrer l'application (en mode DEV)

```
npm run dev
```

**7/** Créer un premier client

```
curl -X POST "http://localhost:3000/api/admin/clients" \
     -H "Content-Type: application/json" \
     -H "x-api-token: lorem-ipsum" \
     -d '{
          "name": "Dora Web Client",
          "source": "dora"
        }'
```

**8**/ Publier un premier évènement

```
curl -X POST "http://localhost:3000/api/events" \
     -H "Content-Type: application/json" \
     -H "x-api-token: < le_token_du_client >" \
     -d '{
          "event_type": "if.application.submitted",
          "event_timestamp": "2025-02-19T19:45:00Z",
          "event_correlation_id": "abcd-1234",
          "actor_sub": "user@example.com",
          "actor_type": "beneficiary",
          "payload": { "status": "submitted" }
        }'
```

**9/** Lancer Prisma Studio pour monitorer les données (de préférence, dans un autre onglet) et accéder à l'URL http://localhost:5555

```
npm run db:studio
```

**10/** Accéder à la documentation Swagger / OpenAPI (v3) à l'URL http://localhost:3000/docs
