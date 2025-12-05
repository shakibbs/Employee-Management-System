# 🏢 Employee Management System (EMS)

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)](https://www.mysql.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive full-stack Employee Management System with Spring Boot backend and React frontend, featuring JWT authentication, role-based access control, and complete CRUD operations for managing employees, departments, users, and attendance.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Database Schema](#-database-schema)
- [Frontend Setup](#-frontend-setup)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### Core Functionality
✅ **Employee Management** - Complete CRUD operations for employee records with department assignment  
✅ **Department Management** - Organize employees by departments  
✅ **User Management** - Admin-controlled user account management with roles  
✅ **Attendance Tracking** - Check-in/Check-out system with attendance reports  
✅ **Leave Management** - Employee leave requests with approval workflow  
✅ **Analytics Dashboard** - Department statistics, attendance trends, payroll summaries  
✅ **Notification System** - Email notifications for important events  

### Security Features
🔐 **JWT Authentication** - Secure token-based authentication  
🔐 **Role-Based Access Control** - Three roles: ADMIN, HR, USER  
🔐 **BCrypt Password Hashing** - Secure password storage  
🔐 **Token Expiration** - Automatic token expiry after 1 hour  
🔐 **Stateless Sessions** - No server-side session management  

### Technical Features
🛠️ **RESTful APIs** - Clean and well-structured REST endpoints  
🛠️ **Input Validation** - Comprehensive validation with custom error messages  
🛠️ **Exception Handling** - Graceful error responses  
🛠️ **Auto-Initialization** - Default admin account on first startup  
🛠️ **API Documentation** - Swagger/OpenAPI integration  
🛠️ **CORS Configuration** - Frontend-backend communication enabled  

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Spring Boot 3.5.7
- **Language:** Java 21
- **Security:** Spring Security + JWT (jjwt 0.11.5)
- **Database:** MySQL 8.0+
- **ORM:** Spring Data JPA (Hibernate)
- **Validation:** Jakarta Bean Validation
- **Email:** Spring Mail (SMTP)
- **Build Tool:** Maven
- **API Docs:** SpringDoc OpenAPI 2.5.0

### Frontend
- **Framework:** React 18.x
- **Build Tool:** Vite
- **Styling:** TailwindCSS 3.x
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **State Management:** React Context API

### Database
- **RDBMS:** MySQL 8.0+
- **Connection:** JDBC
- **Schema Management:** Hibernate DDL Auto (Update mode)

---

## 🏗️ Architecture

### Layered Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│              TailwindCSS + Context API                   │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST
                       │ (Axios)
┌──────────────────────▼──────────────────────────────────┐
│                 Controller Layer                         │
│         (REST Endpoints + Request Mapping)               │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                  Service Layer                           │
│         (Business Logic + Validation)                    │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                Repository Layer                          │
│              (JPA + Spring Data)                         │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                  MySQL Database                          │
│         (Persistent Data Storage)                        │
└─────────────────────────────────────────────────────────┘
```

### Security Flow

```
User Login Request
       │
       ▼
AuthController (/api/auth/login)
       │
       ▼
AuthenticationManager (validates credentials)
       │
       ▼
CustomUserDetailsService (loads user from DB)
       │
       ▼
Password matches? → Generate JWT Token
       │
       ▼
Return Token to Client
       │
       ▼
Client stores token (localStorage)
       │
       ▼
Subsequent Requests → Include "Bearer {token}" header
       │
       ▼
JwtFilter (validates token + extracts user info)
       │
       ▼
SecurityContext (sets authentication)
       │
       ▼
Access Protected Endpoints
```

---

## 🚀 Getting Started

### Prerequisites

1. **Java Development Kit (JDK) 21** or higher
   ```bash
   java -version
   ```

2. **MySQL 8.0+** installed and running
   ```bash
   mysql --version
   ```

3. **Node.js 18+** and npm (for frontend)
   ```bash
   node --version
   npm --version
   ```

4. **Maven** (optional, wrapper included)
   ```bash
   mvn --version
   ```

5. **Git** (for cloning)

---

### Backend Setup

#### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd EMS
```

#### Step 2: Configure Database
Create a MySQL database:
```sql
CREATE DATABASE ems_db;
```

#### Step 3: Update Configuration
Edit `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/ems_db?createDatabaseIfNotExist=true&useSSL=false
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# JWT Secret Key (change in production)
jwt.secret=YourSuperSecretKeyHere12345
jwt.expirationMs=3600000

# Email Configuration (optional)
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
```

#### Step 4: Build and Run
```bash
# Using Maven wrapper (Windows)
./mvnw.cmd clean install
./mvnw.cmd spring-boot:run

# Using Maven wrapper (Mac/Linux)
./mvnw clean install
./mvnw spring-boot:run

# Or using system Maven
mvn clean install
mvn spring-boot:run

# Or run from IDE (IntelliJ IDEA / Eclipse)
# Right-click on EmsApplication.java → Run
```

#### Step 5: Verify Backend
- Application runs on: `http://localhost:8081`
- Swagger UI: `http://localhost:8081/swagger-ui/index.html`
- API Base URL: `http://localhost:8081/api`

**Console Output:**
```
Default admin user created successfully with username: admin and password: admin123
Started EmsApplication in 8.245 seconds
```

---

### Frontend Setup

#### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Verify Environment Variables
Check `frontend/.env` file:
```env
REACT_APP_API_URL=http://localhost:8081/api
REACT_APP_TOKEN_KEY=auth_token
```

#### Step 4: Run Frontend
```bash
npm run dev
```

#### Step 5: Access Application
- Frontend runs on: `http://localhost:3000`
- Login with:
  - **Username:** `admin`
  - **Password:** `admin123`

---

## 📚 API Documentation

### Swagger UI
Access interactive API documentation at:
```
http://localhost:8081/swagger-ui/index.html
```

### Base URL
```
http://localhost:8081/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | User login | No |

**Login Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

### User Endpoints (ADMIN Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/{id}` | Get user by ID |
| POST | `/users/create` | Create new user |
| PUT | `/users/{id}` | Update user |
| DELETE | `/users/{id}` | Delete user |

**Create User Request:**
```json
{
  "username": "john_doe",
  "name": "John Doe",
  "email": "john@ems.com",
  "password": "secure123",
  "role": "USER",
  "phone": "01712345678",
  "address": "Dhaka, Bangladesh"
}
```

**Password Validation:**
- Minimum: 6 characters
- Maximum: 20 characters
- Stored as BCrypt hash (~60 chars)

---

### Department Endpoints

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/departments` | Get all departments | ADMIN, HR |
| GET | `/departments/{id}` | Get department by ID | ADMIN, HR |
| POST | `/departments` | Create department | ADMIN |
| PUT | `/departments/{id}` | Update department | ADMIN |
| DELETE | `/departments/{id}` | Delete department | ADMIN |

**Create Department Request:**
```json
{
  "name": "Software Development",
  "description": "Handles all software development projects"
}
```

---

### Employee Endpoints

| Method | Endpoint | Description | Role Required |
|--------|----------|-------------|---------------|
| GET | `/employees` | Get all employees | ADMIN, HR |
| GET | `/employees/{id}` | Get employee by ID | ADMIN, HR |
| GET | `/employees/department/{deptId}` | Get employees by department | ADMIN, HR |
| POST | `/employees` | Create employee | ADMIN, HR |
| PUT | `/employees/{id}` | Update employee | ADMIN, HR |
| DELETE | `/employees/{id}` | Delete employee | ADMIN |

**Create Employee Request:**
```json
{
  "firstName": "Alice",
  "lastName": "Johnson",
  "email": "alice@ems.com",
  "department": {
    "id": 1
  },
  "position": "Senior Software Engineer",
  "salary": 85000.00
}
```

---

### Attendance Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/attendance/checkin/{employeeId}` | Check in employee |
| PUT | `/attendance/checkout/{attendanceId}` | Check out employee |
| GET | `/attendance/employee/{employeeId}` | Get employee attendance |
| GET | `/attendance/report/{employeeId}` | Get attendance report |

---

### Leave Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leave` | Get all leave requests |
| GET | `/leave/{id}` | Get leave by ID |
| POST | `/leave` | Create leave request |
| PUT | `/leave/{id}/approve` | Approve leave |
| PUT | `/leave/{id}/reject` | Reject leave |

---

### Analytics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/department-employee-count` | Department statistics |
| GET | `/analytics/attendance-trends` | Attendance trends |
| GET | `/analytics/payroll-summary` | Payroll summary |

---

## 🔒 Security

### JWT Token Configuration

```properties
jwt.secret=YourSuperSecretKeyHere12345
jwt.expirationMs=3600000  # 1 hour
```

### Password Encryption
- **Algorithm:** BCrypt
- **Strength:** Default (10 rounds)
- **Storage:** 60 characters in database

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full access to all endpoints |
| **HR** | Create/Read/Update Employees and Departments |
| **USER** | Read-only access to own data |

### Security Configuration

- **CSRF:** Disabled (stateless JWT)
- **CORS:** Enabled for `http://localhost:3000`
- **Sessions:** Stateless
- **Auth:** JWT token in `Authorization: Bearer {token}` header

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE user (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(500)
);
```

### Departments Table
```sql
CREATE TABLE department (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT
);
```

### Employees Table
```sql
CREATE TABLE employees (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  department_id BIGINT,
  position VARCHAR(255),
  salary DOUBLE,
  FOREIGN KEY (department_id) REFERENCES department(id)
);
```

### Attendance Table
```sql
CREATE TABLE attendance (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employee_id BIGINT NOT NULL,
  check_in_time DATETIME,
  check_out_time DATETIME,
  date DATE NOT NULL,
  status VARCHAR(50),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);
```

### Leave Requests Table
```sql
CREATE TABLE leave_request (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employee_id BIGINT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  leave_type VARCHAR(50),
  status VARCHAR(50),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);
```

---

## 🎨 Frontend Setup

### Project Structure
```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── api/              # API service layer
│   │   ├── apiClient.js
│   │   ├── authService.js
│   │   ├── employeeService.js
│   │   └── ...
│   ├── components/       # Reusable components
│   │   ├── forms/
│   │   ├── layout/
│   │   └── ui/
│   ├── context/          # React Context
│   │   └── AuthContext.jsx
│   ├── pages/            # Page components
│   │   ├── dashboard/
│   │   ├── employees/
│   │   ├── departments/
│   │   └── ...
│   ├── router/           # Routing configuration
│   │   └── AppRouter.jsx
│   └── styles/           # Global styles
├── .env                  # Environment variables
├── package.json
└── tailwind.config.js
```

### Available Scripts

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🧪 Testing

### Postman Testing

Refer to `POSTMAN_TESTING_GUIDE_COMPLETE.md` for detailed API testing instructions.

**Quick Test Flow:**
1. Login → Get JWT token
2. Create Departments
3. Create Employees
4. Test Attendance Check-in/Check-out
5. Test CRUD operations with different roles

### Manual Testing Checklist

- [ ] Application starts without errors
- [ ] Default admin account created
- [ ] Login successful
- [ ] Token authentication works
- [ ] CRUD operations for all entities
- [ ] Role-based access control
- [ ] Validation error messages
- [ ] Token expiration after 1 hour

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Application Won't Start

**Error:** `Cannot create PoolableConnectionFactory`

**Solution:**
- Verify MySQL is running
- Check database credentials in `application.properties`
- Ensure database `ems_db` exists

---

#### 2. Default Admin Not Created

**Error:** No admin user in database

**Solution:**
- Check console for errors
- Delete `target/` folder and rebuild
- Verify password validation (6-20 characters)

---

#### 3. 403 Forbidden on Login

**Error:** `403 Forbidden` when calling `/api/auth/login`

**Solution:**
- Verify endpoint URL: `POST http://localhost:8081/api/auth/login`
- Check SecurityConfig permits `/api/auth/**`
- Ensure no context path is set in `application.properties`

---

#### 4. Frontend Can't Connect

**Error:** `Network Error` or `CORS Error`

**Solution:**
- Verify backend is running on port 8081
- Check `.env` file has correct API URL
- Ensure CORS allows `http://localhost:3000` in SecurityConfig

---

#### 5. Token Not Working

**Error:** `401 Unauthorized` with valid token

**Solution:**
- Check token format: `Bearer {token}` (with space)
- Token might be expired (login again)
- Verify JWT secret matches in properties

---

#### 6. Password Validation Error

**Error:** `Password must be between 6 and 20 characters`

**Solution:**
- Ensure password is 6-20 characters
- This applies to raw password input, not BCrypt hash
- BCrypt hash (~60 chars) is stored in database

---

### Debug Mode

Enable debug logging in `application.properties`:
```properties
logging.level.com.bs23=DEBUG
logging.level.org.springframework.security=DEBUG
```

---

## 📊 Project Statistics

- **Backend LOC:** ~3000+ lines
- **Frontend LOC:** ~2000+ lines
- **API Endpoints:** 30+
- **Database Tables:** 6
- **Roles:** 3 (ADMIN, HR, USER)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**BS-23 Training Project**  
Date: November 2025

---

## 📞 Support

For issues and questions:
- Check `TROUBLESHOOTING.md`
- Review `POSTMAN_TESTING_GUIDE_COMPLETE.md`
- Check console logs for detailed errors

---

## 🎯 Future Enhancements

- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Unit and integration tests
- [ ] Performance monitoring
- [ ] File upload for employee documents
- [ ] Advanced reporting and analytics
- [ ] Mobile responsive improvements
- [ ] Email notifications
- [ ] Audit logging
- [ ] Multi-language support

---

**Happy Coding! 🚀**

