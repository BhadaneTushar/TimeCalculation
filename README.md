# Time Calculation Full-Stack Project

## Project Structure
- `/backend` — Spring Boot + PostgreSQL REST API
- `/frontend` — React (Vite) web app

---

## Backend Setup (Spring Boot + PostgreSQL)

1. **Configure PostgreSQL:**
   - Install PostgreSQL and create a database (e.g., `time_db`).
   - Note your DB username and password.

2. **Configure `application.properties`:**
   - Edit `/backend/src/main/resources/application.properties`:
     ```properties
     spring.datasource.url=jdbc:postgresql://localhost:5432/time_db
     spring.datasource.username=YOUR_DB_USERNAME
     spring.datasource.password=YOUR_DB_PASSWORD
     spring.jpa.hibernate.ddl-auto=update
     spring.jpa.show-sql=true
     spring.flyway.enabled=true
     ```

3. **Run the backend:**
   - From `/backend`, run:
     ```bash
     ./mvnw spring-boot:run
     ```
   - The API will be available at `http://localhost:8080/api/entries`.

---

## Frontend Setup (React + Vite)

1. **Install dependencies:**
   - From `/frontend`, run:
     ```bash
     npm install
     ```

2. **Run the frontend:**
   - From `/frontend`, run:
     ```bash
     npm run dev
     ```
   - The app will be available at `http://localhost:5173`.

---

## API Endpoints
- `POST /api/entries` — Submit a day's time entries
- `GET /api/entries/{day}` — Fetch summary for a specific day
- `GET /api/entries` — List all days with summaries

---

## Notes
- Ensure the backend is running before using the frontend.
- Update DB credentials in `application.properties` as needed.
- For schema initialization, Flyway migrations or `schema.sql` will be used. 