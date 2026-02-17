# Incident Tracker App

Web stack application to create, browse , search and manage production Incidents

## Feature
Create incidents with validation
Fetch incidents from a database
Incidents shown in a paginated table 
Search, filter, and sort incidents on the columsn 
View incident details and update status
Seed database with ~200 records

## Project Structure

`
  Production_Incident
    | ------backend
    | ------frontend
`

## Backend Setup

### STEP 1: Create Database

1) How to setup a MySql : https://dev.mysql.com/doc/mysql-getting-started/en/
2) After this run the MySQL server
3) Run this schema inside MySQL server in terminal . Folder Path for Schema -> `Production_Incident\backend\assignment\schema.sql`

### STEP 2 : Configure application.yml
update the credentials for db
`
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/incident_tracker?useSSL=false
    username: {your username}
    password: {your password}
`

### RUN the Backend Server
1) How to Run the Project in SpringBoot - https://guneetgstar.medium.com/how-to-run-spring-boot-applications-on-intellij-idea-for-free-381a2661d409

Server Runs at : 
`http://localhost:8080`

DataBase will auto-seed ~200 incident in DB when you run the SpringBoot Application

### API Endpoints
1) Get Inciden by ID
   `GET : /api/incidents/{id}`

2) Create Incident
   `POST : /api/incidents
   {
      "title": "Incident 1",
      "service": "FRONTEND",
      "severity": "SEV3",
      "status": "OPEN",
      "owner": "ritik@example.com",
      "summary": "Page allignment issue"
    }
   `

4) Get Incidents ( Paginated & filtered)
   `GET : /api/incidents?page=0&size=10&sortBy=createdAt&sortDirection=desc&service=PAYMENT&severity=SEV1&severity=SEV2&status=OPEN&search=payment`

5) Update Incident
   `PATCH : /api/incidents/{id}
     {
      "status": "MITIGATED",
        "summary": "Temporary mitigation deployed"
      }
   `








