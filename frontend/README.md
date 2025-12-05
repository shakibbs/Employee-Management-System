BS23 Employee Management System - Frontend (React + Tailwind)
-----------------------------------------------------------

This is a scaffolded frontend for the BS23 EMS. To run locally:

1. Move into the folder:
   cd bs23_frontend

2. Install dependencies:
   npm install

3. Start the dev server:
   npm start

Tailwind is already configured (you will need to have Node.js installed).

Backend API base is set to http://localhost:8081/api by default in src/services/apiConfig.js.
Update if your backend runs on a different host/port.

Files of interest:
- src/components/Navbar.js, Sidebar.js, ThemeToggle.js
- src/pages/Dashboard.js, EmployeeList.js, EmployeeAdd.js, Login.js
- src/services/*Service.js

The project is intentionally lightweight; adjust styles and add components as you like.
