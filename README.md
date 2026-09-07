# NexHR AI — AI-Powered Recruitment Platform

NexHR AI is a full-stack MERN recruitment platform that uses **Google Gemini AI** to automate resume screening, candidate matching, job description analysis, and recruitment workflows.

The platform provides dedicated experiences for **recruiters, administrators, and candidates**, helping streamline the hiring pipeline from job creation to candidate evaluation and application tracking.

---

## ✨ Core Features

### 🤖 AI-Powered Recruitment

* **AI Resume Screening**

  * Processes uploaded PDF resumes
  * Extracts structured candidate information
  * Generates ATS compatibility scores
  * Evaluates candidate-to-job matching

* **AI Candidate Recommendations**

  * Categorizes candidates based on job compatibility
  * Supports qualification, experience, education, and skill matching

* **Candidate Pool Ranking**

  * Ranks applicants for a specific job
  * Helps recruiters quickly identify the strongest candidates

* **AI Job Description Analyzer**

  * Improves job descriptions
  * Identifies missing requirements
  * Suggests relevant qualifications
  * Provides salary-range and market-availability insights

---

## 👨‍💼 Recruiter & Admin Workspace

### Recruitment Dashboard

Recruiters can monitor important hiring metrics including:

* Total applicants
* New applications
* Shortlisted candidates
* Rejected candidates
* Scheduled interviews/panels

### Candidate Management

* Search and filter candidates
* Filter applications by status
* Review AI-generated candidate insights
* Export candidate data as CSV
* Manage recruitment pipeline

### AI Analytics

Interactive dashboards provide insights into:

* Hiring trends
* Recruitment pipeline bottlenecks
* Top candidate skills
* Applicant sources
* ATS score distribution

### Administrative Controls

Administrators can:

* Manage platform users
* Access recruiter workspaces
* Review platform activity
* Review Gemini AI request history
* Manage user permissions

---

## 👤 Candidate Dashboard

Candidates receive a dedicated workspace for managing their applications.

### Application Tracking

Track application progress through stages such as:

`Applied → Interviewing → Offered / Rejected`

### AI Career Tools

Candidates can use AI-powered tools to:

* Analyze resume ATS compatibility
* Generate tailored cover letters
* Prepare personalized interview preparation material

---

## 🏗️ Architecture

```text
┌──────────────────────────────┐
│       React Frontend         │
│  Tailwind • Router • Charts  │
└──────────────┬───────────────┘
               │ REST API
               ▼
┌──────────────────────────────┐
│      Node.js + Express       │
│ Auth • Jobs • Applications   │
│ AI Services • Admin          │
└───────┬──────────────┬───────┘
        │              │
        ▼              ▼
┌──────────────┐  ┌────────────────┐
│ MongoDB Atlas│  │ Google Gemini  │
│  Mongoose    │  │   AI Engine    │
└──────────────┘  └────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* TanStack Router
* Recharts
* Lucide Icons
* Framer Motion

### Backend

* Node.js
* Express.js
* Multer
* JWT Authentication

### Database

* MongoDB Atlas
* Mongoose

### AI

* Google Gemini
* Google Generative AI API

---

## 📁 Project Structure

```text
NexHRAI/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── routes/
│   │   └── services/
│   │
│   └── vite.config.js
│
└── README.md
```

---

## 🔄 AI Recruitment Flow

```text
Candidate Applies
       │
       ▼
Resume Upload
       │
       ▼
Resume Processing
       │
       ▼
Gemini AI Analysis
       │
       ├── Candidate Profile
       ├── Skills
       ├── Experience
       ├── ATS Score
       └── Job Match
              │
              ▼
      Candidate Evaluation
              │
              ▼
      Recruiter Dashboard
```

---

## 🔐 Authentication & Authorization

NexHR AI uses JWT-based authentication to separate access between different platform roles.

### Candidate

* Apply for jobs
* Track applications
* Access AI career tools
* Manage profile information

### Recruiter

* Create and manage jobs
* Review applications
* Evaluate candidates
* Rank candidate pools
* Access recruitment analytics

### Admin

* Manage platform users
* Monitor recruitment workspaces
* Access administrative analytics
* Review AI activity

---

## 🚀 Installation & Setup

### Prerequisites

Make sure you have:

* Node.js 18+
* MongoDB Atlas account
* Google Gemini API key
* Git

### 1. Clone Repository

```bash
git clone <repository-url>
cd NexHRAI
```

### 2. Install Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

> Never commit `.env` files or API credentials to GitHub.

### 3. Install Frontend

```bash
cd ../frontend
npm install
```

Configure the frontend API URL if your project uses an environment variable such as:

```env
VITE_API_URL=your_backend_url
```

### 4. Start Development Servers

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

---

## 🔌 API Overview

### Authentication

```text
POST /api/auth/signup
POST /api/auth/login
```

### Jobs

```text
GET    /api/jobs
POST   /api/jobs
DELETE /api/jobs/:id
```

### Applications

```text
POST /api/applications
GET  /api/applications
PUT  /api/applications/:id/status
POST /api/applications/job/:jobId/rank
```

### AI Services

```text
POST /api/ai/analyze-resume
POST /api/ai/generate-cover-letter
POST /api/ai/generate-job-description
```

---

## ☁️ Deployment

### Backend

The backend can be deployed as a Node.js web service on platforms such as Render.

Typical configuration:

```text
Build Command:
npm install

Start Command:
node server.js
```

Configure the required environment variables in the deployment platform.

### Frontend

The React/Vite frontend can be deployed to Vercel or another static hosting platform.

Configure:

```env
VITE_API_URL=your_backend_api_url
```

The frontend then communicates with the deployed Express API.

---

## 💡 Engineering Highlights

* Full-stack MERN architecture
* AI integration using Google Gemini
* Automated resume analysis
* ATS compatibility scoring
* AI-based candidate ranking
* Role-based recruitment workflows
* JWT authentication
* MongoDB Atlas integration
* Resume file upload handling
* Interactive analytics dashboards
* CSV candidate export
* Responsive recruiter and candidate interfaces
* Modular Express API architecture

---

## 🔮 Future Improvements

Potential improvements include:

* Advanced semantic candidate-job matching
* Vector database integration
* Resume-to-job similarity search
* Interview scheduling automation
* Email and notification automation
* Advanced recruiter collaboration
* Real-time application updates
* Recruitment funnel analytics
* AI-powered interview evaluation
* Cloud-based resume storage
* Production-grade observability and monitoring

---

## 🎯 Project Purpose

NexHR AI was built to explore how **AI can automate and improve modern recruitment workflows**.

The project combines full-stack web development with generative AI to solve practical recruitment problems such as resume screening, candidate matching, job analysis, and application management.

---

## 👨‍💻 Developer

**Waqas Ali**

Full Stack MERN Developer focused on building modern web applications, AI-powered systems, and scalable digital products.

### Core Technologies

`React.js` · `Node.js` · `Express.js` · `MongoDB` · `TypeScript` · `JavaScript` · `AI Integration`

---

## 📄 License

This project is licensed under the **MIT License**.

