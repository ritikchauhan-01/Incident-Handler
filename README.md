# Incident Tracker App

A full-stack web application to create, browse, search, and manage production incidents.

---

## 🚀 Features

- Create incidents with validation  
- Fetch incidents from the database  
- Display incidents in a paginated table  
- Search, filter, and sort incidents by columns  
- View incident details and update status  
- Automatically seed the database with ~200 records on startup  

---

## 📁 Project Structure

```
Production_Incident
│
├── backend
└── frontend
```

---

# 🖥 Backend Setup

## Step 1: Create the Database

1. Install MySQL:  
   https://dev.mysql.com/doc/mysql-getting-started/en/

2. Start the MySQL server.

3. Run the schema inside file in MySQL:

```
Production_Incident/backend/assignment/schema.sql
```

---

## Step 2: Configure `application.yml`

Update your database credentials:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/incident_tracker?useSSL=false
    username: your_username
    password: your_password
```

---

## ▶ Run the Backend Server

Run using Maven:

```bash
mvn spring-boot:run
```

OR you can check this link how to Run the SpringBoot Project in Intellij - 
https://guneetgstar.medium.com/how-to-run-spring-boot-applications-on-intellij-idea-for-free-381a2661d409

The server runs at:

```
http://localhost:8080
```

The database will automatically seed ~200 incident records when the application starts.

---

# 📡 API Endpoints

## 1️⃣ Get Incident by ID

```http
GET /api/incidents/{id}
```

---

## 2️⃣ Create Incident

```http
POST /api/incidents
```

### Request Body

```json
{
  "title": "Incident 1",
  "service": "FRONTEND",
  "severity": "SEV3",
  "status": "OPEN",
  "owner": "ritik@example.com",
  "summary": "Page alignment issue"
}
```

---

## 3️⃣ Get Incidents (Paginated & Filtered)

```http
GET /api/incidents?page=0&size=15&sortBy=createdAt&sortDirection=desc&service=PAYMENT&severity=SEV1&severity=SEV2&status=OPEN&search=payment
```

---

## 4️⃣ Update Incident

```http
PATCH /api/incidents/{id}
```

### Request Body

```json
{
  "status": "MITIGATED",
  "summary": "Temporary mitigation deployed"
}
```

---

# Frontend Setup
```
cd frontend
npm install 
npm run dev
```

App runs at :
```
http://localhost:5173
```

# API Endpoints

## Create Incident
```
POST  /api/incidents
```

## Get Incidents ( Pagination + Filter )
```
GET /api/incidents?page=0&size=15&search=&severity=&status=&sort=createdAt
```

## Get Incident By ID
```
GET /api/incidents/{id}
```

## update Incident
```
PATCH /api/incidents/{id}
```

---------------

# Design Decisions

- UUID used as the primary key for safer public exposure.
- Server-side pagination implemented to support large datasets efficiently.
- JPA Specifications used for dynamic filtering and searching.
- DTOs used to separate the API contract from the entity model.
- Global exception handler implemented for consistent and clean API responses.
- Debounced search implemented on the frontend to reduce server load.
- Custom responsive CSS used instead of UI libraries to keep the bundle lightweight.

---

# Trade-offs

- Authentication and authorization were not implemented (not required for this assignment).
- Simple CSS was used instead of a component library to keep the project minimal and focused.

---

# Future Improvements

- Add authentication and authorization (JWT-based security).
- Implement WebSocket support for real-time incident updates.
- Add unit and integration tests.
- Implement audit logs and history tracking.
- Handle concurrency issues when multiple users update the same incident (e.g., optimistic locking).
- Add Docker support for containerized deployment.


# 🏗 High-Level Design — Production Incident Tracker


```
                                 +-------------------------------+
                                 |           Frontend            |
                                 |          (React App)          |
                                 |-------------------------------|
                                 | - Create Incident Form        |
                                 | - Incident List View          |
                                 | - Filters & Search            |
                                 | - Pagination Controls         |
                                 |   (page, size, sort)          |
                                 +---------------+---------------+
                                                 |
                                                 |  REST API
                                                 |  GET /api/incidents?page=0&size=10
                                                 v
                                 +-----------------------------------------------+
                                 |              Backend (Spring Boot)            |
                                 |-----------------------------------------------|
                                 | 1. Controller Layer                           |
                                 |    - Exposes REST APIs                        |
                                 |    - Accepts page, size, filters              |
                                 |                                               |
                                 | 2. Service Layer                              |
                                 |    - Business logic                           |
                                 |    - Status transitions                       |
                                 |    - Creates Pageable object                  |
                                 |                                               |
                                 | 3. Repository Layer (Spring Data JPA)        |
                                 |    - Uses JPA Specifications                  |
                                 |    - findAll(Pageable pageable)               |
                                 |                                               |
                                 | 4. Global Exception Handler                   |
                                 |    - Standardized error responses             |
                                 +-----------------------+-----------------------+
                                                         |
                                                         |  Generates SQL
                                                         v
                                 +-----------------------------------------------+
                                 |                MySQL Database                 |
                                 |-----------------------------------------------|
                                 | Table: incidents                              |
                                 |                                               |
                                 | SELECT * FROM incidents                       |
                                 | WHERE severity = 'SEV1'                       |
                                 | ORDER BY created_at DESC                      |
                                 | LIMIT 10 OFFSET 0;                            |
                                 |                                               |
                                 | Indexed Columns:                              |
                                 | - id (UUID - Primary Key)                     |
                                 | - created_at                                  |
                                 | - severity                                    |
                                 | - status                                      |
                                 +-----------------------------------------------+
```
