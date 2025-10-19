# Backend (Django + GraphQL + PostGIS)

Requirements

- Python 3.10+
- PostgreSQL with PostGIS extension installed (on Linux: postgresql-server-dev, postgis packages)

Quickstart

1. Create and activate a virtualenv

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Configure database

- Ensure PostgreSQL is running and create a database and enable PostGIS:

```sql
CREATE DATABASE waytrove;
\c waytrove
CREATE EXTENSION postgis;
```

3. Copy .env.example to .env and edit values

4. Run migrations

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

5. GraphQL playground

- Visit http://localhost:8000/graphql/ to access the GraphiQL interface (development only).

Notes

- Uploads are expected to be handled via S3 or Supabase Storage; avatar_url is stored as a URL.
- This scaffolding includes a `users` app with a custom User model and a GraphQL mutation
  `updateProfile`.

Authentication

- The backend provides two GraphQL mutations to authenticate users:
  - `register(email: String!, password: String!, username: String, firstName: String, lastName: String)`
    returns `user`, `accessToken`, and `refreshToken`.
  - `login(email: String!, password: String!)` returns `user`, `accessToken`, and `refreshToken`.

Quick Docker run

1. Build and start services:

```powershell
docker compose -f .\backend\docker-compose.yml up --build
```

2. Run migrations and create a superuser (in a separate terminal):

```powershell
docker compose -f .\backend\docker-compose.yml exec web python manage.py migrate
docker compose -f .\backend\docker-compose.yml exec web python manage.py createsuperuser
```

3. Use the GraphiQL endpoint at http://localhost:8000/graphql/ to exercise the `register` and
   `login` mutations.
