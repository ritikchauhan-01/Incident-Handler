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

-> UUID used as primary key for safer public exposure
-> Server-side pagination to support large datasets
-> JPA Specification used for dynamic filtering/search
-> DTOs separate API contract from entity model
-> Global exception handler for clean API responses
-> Debounced search to reduce server load
-> Responsive CSS instead of UI libraries to keep bundle lightweight

---------------

# TradeOffs

No authentication added (not required for assignment)
Simple CSS used instead of component library

---------------

# Future Improvements
-> Add Authentication and Authorization ( JWT )
-> WebSocket live incident updates
-> Unit & Integration tests
-> Add Audit logs/history tracking
-> Manage the concurrency for multiple user updating the same incident.
-> Docker deployment 




