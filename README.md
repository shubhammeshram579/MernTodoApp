# TaskFlow — MERN Todo App

A full-stack Todo application built with the MERN stack demonstrating clean architecture, JWT authentication, Redux state management, and Zod form validation.

---

## Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Frontend   | React 18, Vite, React Router v6                     |
| State      | Redux Toolkit, React Redux                          |
| Forms      | React Hook Form, Zod (schema validation)            |
| Icons      | Lucide React                                        |
| Styling    | Tailwind CSS v3                                     |
| Backend    | Node.js, Express.js                                 |
| Database   | MongoDB, Mongoose                                   |
| Auth       | JWT (jsonwebtoken), bcryptjs ,cookie-parser         |
| HTTP       | Axios (with request/response interceptors)          |

---

## Project Structure

```
todo-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js     # register, login, getMe handlers
│   │   │   └── task.controller.js     # createTask, getTasks, updateTask, deleteTask
│   │   ├── db/
│   │   │   └── index.js               # MongoDB connection (connectDB)
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js     # JWT protect middleware
│   │   │   └── error.middleware.js    # Global error handler
│   │   ├── models/
│   │   │   ├── user.model.js          # User schema — name, email, password (hashed)
│   │   │   └── task.model.js          # Task schema — title, description, status, userId
│   │   ├── routes/
│   │   │   ├── auth.routes.js         # /api/auth/register, /login, /me
│   │   │   └── task.routes.js         # /api/tasks (all routes protected)
│   │   ├── utils/
│   │   │   ├── ApiError.js            # Custom error class with statusCode
│   │   │   ├── ApiResponse.js         # Consistent success response shape
│   │   │   └── asyncHandler.js        # Eliminates try/catch in controllers
│   │   ├── app.js                     # Express setup — CORS, routes, error handler
│   │   └── index.js                   # Entry point — connects DB then starts server
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx             # Brand + user info + logout button
    │   │   ├── ProtectedRoute.jsx     # Redirects unauthenticated users to /login
    │   │   ├── TaskCard.jsx           # Single task display with edit/delete actions
    │   │   └── TaskModal.jsx          # Reusable create/edit modal with RHF + Zod
    │   ├── hooks/
    │   │   └── useTasks.js            # Task CRUD — calls API and dispatches to Redux
    │   ├── pages/
    │   │   ├── LoginPage.jsx          # Login form — React Hook Form + Zod
    │   │   ├── RegisterPage.jsx       # Register form — React Hook Form + Zod
    │   │   └── TasksPage.jsx          # Dashboard — stats, filter tabs, task grid
    │   ├── services/
    │   │   ├── api.js                 # Axios instance with JWT + 401 interceptors
    │   │   ├── auth.service.js        # API calls: register, login, getMe
    │   │   └── task.service.js        # API calls: fetchTasks, createTask, updateTask, deleteTask
    │   ├── store/
    │   │   ├── store.js               # Redux store — combines authSlice + taskSlice
    │   │   └── slices/
    │   │       ├── authSlice.js       # Auth state — user, token, isAuthenticated
    │   │       └── taskSlice.js       # Task state — tasks[], loading, filter
    │   ├── utils/
    │   │   └── validationSchemas.js   # Zod schemas — loginSchema, registerSchema, taskSchema
    │   ├── App.jsx                    # React Router route definitions
    │   ├── main.jsx                   # Entry point — wraps app in Redux <Provider>
    │   └── index.css                  # Tailwind directives + component layer styles
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    └── package.json
```

---

## Prerequisites

Before running this project make sure you have the following installed:

- **Node.js** v18 or higher — https://nodejs.org
- **npm** v9 or higher (comes with Node.js)
- **MongoDB** running locally on port 27017, or a free MongoDB Atlas cluster URI

---

## Setup & Running

### Step 1 — Clone or extract the project

```bash
# If cloning from git
git clone <your-repo-url>
cd todo-app

# Or just unzip the downloaded file
unzip todo-app.zip
cd todo-app
```

### Step 2 — Backend Setup

```bash
# Navigate to the backend folder
cd backend

# Copy the example env file
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo-app

JWT_SECRET=your_access_token_secret_here
JWT_EXPIRES_IN=15m

JWT_REFRESH_SECRET=your_refresh_token_secret_here
JWT_REFRESH_EXPIRES_IN=7d

NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

> **Tip:** Generate a strong JWT_SECRET with:
> `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

```bash
# Install dependencies
npm install

# Start the development server (nodemon — auto-restarts on changes)
npm run dev
```

Backend will start on **http://localhost:5000**

You should see:
```
✅ MongoDB Connected! Host: localhost
🚀 Server running on http://localhost:5000
```

---

### Step 3 — Frontend Setup

Open a **new terminal**, then:

```bash
# From the project root
cd frontend

# Copy the example env file
cp .env.example .env
```

Default `.env` works out of the box if your backend runs on port 5000:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

```bash
# Install all dependencies
# (React, Redux Toolkit, Tailwind CSS, lucide-react, React Hook Form, Zod, Axios...)
npm install

# Start the Vite dev server
npm run dev
```

Frontend will start on **http://localhost:5173**

---

### Step 4 — Open the app

Visit **http://localhost:5173** in your browser.

| Page        | Route       | Access   |
|-------------|-------------|----------|
| Register    | /register   | Public   |
| Login       | /login      | Public   |
| Task Dashboard | /tasks   | Protected |

---

## API Endpoints

### Auth

| Method | Route               | Access  | Description                      |
|--------|---------------------|---------|----------------------------------|
| POST   | /api/auth/register  | Public  | Create a new user account        |
| POST   | /api/auth/login     | Public  | Login and receive a JWT token    |
| GET    | /api/auth/me        | Private | Get the currently logged-in user |

### Tasks

| Method | Route             | Access  | Description                           |
|--------|-------------------|---------|---------------------------------------|
| GET    | /api/tasks        | Private | Get all tasks for the logged-in user  |
| POST   | /api/tasks        | Private | Create a new task                     |
| PUT    | /api/tasks/:id    | Private | Update a task by ID                   |
| DELETE | /api/tasks/:id    | Private | Delete a task by ID                   |

> All `/api/tasks` routes require the header: `Authorization: Bearer <token>`

---

## Key Design Decisions

### Backend

- **`asyncHandler`** — wraps every controller so errors automatically reach the Express error handler, removing try/catch from every function
- **`ApiError` / `ApiResponse`** — every endpoint returns a consistent JSON shape: `{ success, statusCode, message, data }`
- **`select: false` on password** — the password field is never returned in any query unless explicitly opted in
- **Ownership check on update/delete** — tasks are filtered by both `_id` and `userId` so a user can never modify another user's tasks
- **Global error middleware** — automatically handles Mongoose `CastError` (bad ObjectId), duplicate key `11000` (email taken), and `ValidationError`

### Frontend

- **Redux Toolkit** — `authSlice` manages user/token and syncs with `localStorage`; `taskSlice` manages the task list and active status filter
- **`<Provider>` in `main.jsx`** — the Redux store is available to every component without prop drilling or wrapping individual pages
- **React Hook Form + Zod** — all three forms use `useForm({ resolver: zodResolver(schema) })`; all validation rules are defined once in `validationSchemas.js`
- **Axios interceptors** — request interceptor auto-attaches the JWT; response interceptor catches 401 globally and redirects to `/login`
- **`useTasks` custom hook** — keeps all task API calls and Redux dispatches in one place so `TasksPage` stays clean and only handles rendering
- **lucide-react icons** — used consistently across Navbar, TaskCard, TaskModal, and all page forms for a uniform visual language