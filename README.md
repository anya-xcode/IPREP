# IPREP - Interview Preparation & Experience Share

IPREP is a comprehensive, community-driven platform designed to help students and professionals prepare for technical and behavioral interviews. It allows users to browse real interview questions, share their own interview experiences, and access curated preparation resources.

---

## Key Features

### For Users
* **Experience Sharing**: A detailed, user-friendly form to submit questions faced during recent interviews, including specific roles, rounds (e.g., Technical, HR), and associated tech stacks.
* **Question Dashboard**: Browse a rich database of approved interview questions. Features include dynamic search, interactive upvoting (to highlight important questions), and personal bookmarks (saved locally).
* **HR & Behavioral Section**: A dedicated space focused entirely on non-technical, behavioral, and HR-related interview questions.
* **Curated Resources**: Access to categorized links, guides, and materials to aid in interview preparation.
* **Dark/Light Mode**: Full theme customization for comfortable reading.
* **Live Placement Tracker**: A dynamic navbar widget creating a sense of community momentum by displaying real-time placement statistics.

### For Administrators
* **Moderation Queue**: A secure, password-protected admin dashboard to review, approve, or reject user-submitted questions.
* **Direct Question Entry**: A synchronized manual entry form (mirroring the user "Share Experience" form) allowing admins to rapidly add and categorize questions that are instantly published.
* **Resource Management**: Admins can add, edit, or remove preparation links and materials directly from the UI.
* **Platform Configurations**: Tools to easily update global platform statistics, such as the "Placement Tracker" numbers shown to all users.

---

## Tech Stack

**IPREP** is built on the robust **MERN** stack, utilizing modern tools for speed and scalability.

* **Frontend**:
  * [React](https://react.dev/) (v19) with [Vite](https://vitejs.dev/)
  * [Tailwind CSS](https://tailwindcss.com/) (v4) for rapid UI styling
  * [React Router Dom](https://reactrouter.com/) for navigation
* **Backend**:
  * [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
  * [Prisma ORM](https://www.prisma.io/) for type-safe database access
  * [Socket.io](https://socket.io/) for real-time capabilities
* **Database**:
  * [MongoDB](https://www.mongodb.com/) (hosted via MongoDB Atlas)

---

## Project Structure

```text
IPREP/
├── backend/                  # Express.js REST API
│   ├── controllers/          # Business logic handling requests
│   ├── prisma/               # Database schema & migrations
│   ├── routes/               # API endpoint definitions
│   └── server/               # Express server entry point
└── frontend/                 # React frontend application
    ├── src/
    │   ├── api/              # Axios configurations
    │   ├── components/       # Reusable UI components (Navbar, StatusModal)
    │   ├── context/          # React Context (e.g., ThemeContext)
    │   └── pages/            # Main views (Home, Upload, AdminPanel, etc.)
```

---

## Getting Started

### Prerequisites
* Node.js (v18+ recommended)
* A MongoDB instance (Local or Atlas)

### 1. Clone & Install Dependencies
Navigate into both the frontend and backend directories to install their respective packages:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
You will need to create `.env` files in both the `backend` and `frontend` directories.

**`backend/.env`**
```env
# MongoDB Connection String
DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/your-db"
# URLs allowed by CORS
FRONTEND_URL="http://localhost:5173"
# Admin authentication (if applicable)
ADMIN_PASSWORD="your_secure_password"
```

**`frontend/.env`**
```env
# Make sure to prefix Vite env variables with VITE_
VITE_API_URL="http://localhost:5000"
```

*(Note: The `backend/.env` is required for Prisma to connect to your database.)*

### 3. Database Setup (Prisma)
Ensure your MongoDB URL is correct, then sync your Prisma schema to the database:

```bash
cd backend
npx prisma generate
npx prisma db push
```

### 4. Running the Application
You can run the backend and frontend development servers concurrently in two separate terminal windows.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The application should now be running. The frontend will typically be accessible at `http://localhost:5173` and the backend at `http://localhost:5000`.

---

## Administration Access
To access the `/admin` moderation panel, you must authenticate using the configured Admin Password. By default, ensure your backend `.env` variables and `AdminSettings` in the database are synced to allow secure entry.
