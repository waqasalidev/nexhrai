# NexHR AI — Hire Smarter, Not Harder

NexHR AI is a next-generation, production-ready MERN stack application that leverages Google Gemini AI and MongoDB Atlas to provide an automated, intelligence-driven recruitment pipeline.

---

## Features

### 1. Advanced Recruiter AI Features
* **AI Resume Screening:** Automatically parses uploaded PDF resumes when candidates apply, extracts structured properties, and computes ATS Compatibility Scores (0-100) and Job match metrics.
* **AI Recommendation Engines:** Automatically segments candidates as *Highly Recommended*, *Recommended*, *Average Match*, or *Not Recommended*.
* **AI Candidate Pool Ranking:** Evaluates a pool of candidates applying to a job and ranks them descending based on qualifications, experience, education, and skill match.
* **AI Job Description Analyzer:** Prefills jobs with improved wording, missing requirements, recommended salary ranges, and market availability estimations.

### 2. Recruiter & Admin Workspace
* **KPI Workspace Metrics:** Tracks total applicants, new applications, shortlists, rejects, and panels scheduled.
* **Filter, Search & Export:** Real-time search and status filtering of the candidate pool with client-side CSV exporters.
* **AI Dashboard Analytics:** Renders interactive charts showing hiring trends, pipeline bottlenecks, top skills, applicant sources, and ATS distribution scores.
* **Auditing Controls:** Admin desk permissions to view platforms registries, delete users, access recruiter workspaces, and review Gemini API request histories.

### 3. Candidate Experience Dashboard
* **Application Tracker:** Monitor application status changes from Applied to Interviewing, Offered, or Rejected.
* **AI Tools Panel:** Audit ATS resume compatibility, generate tailored cover letters, and output personalized interview prep sheets.

---

## Tech Stack

* **Frontend:** React.js, Tailwind CSS, TanStack Router, Recharts, Lucide Icons, Framer Motion
* **Backend:** Node.js, Express.js, Multer
* **Database:** MongoDB Atlas (Mongoose ODM)
* **AI Engine:** Google Generative AI (Gemini 2.5 Flash Model)

---

## Folder Structure

```
NexHRAI/
├── backend/
│   ├── config/            # Database and API connections
│   ├── controllers/       # Route action logic handlers
│   ├── middleware/        # JWT Auth, file upload filters
│   ├── models/            # Mongoose Schema Definitions
│   ├── routes/            # Express router endpoints
│   ├── services/          # Gemini AI API and Email integrations
│   └── server.js          # Express app listener
├── frontend/
│   ├── src/
│   │   ├── components/    # Shared glassmorphic UI elements
│   │   ├── context/       # Auth state handlers
│   │   ├── routes/        # App routing pages
│   │   └── services/      # Client-side Axios endpoints
│   └── vite.config.js     # Dev proxy ports
```

---

## Installation & Setup

### Prerequisites
* Node.js (v18+)
* MongoDB Atlas Cluster
* Gemini AI API Key

### Local Installation

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd NexHRAI
   ```

2. **Setup Backend Environment:**
   Navigate to the backend directory, install packages, and create a `.env` file:
   ```bash
   cd backend
   npm install
   ```

3. **Configure Backend Environment Variables:**
   Create a `backend/.env` configuration file containing variables for `PORT`, `MONGO_URI` (database connection), `JWT_SECRET` (session validation), `GEMINI_API_KEY` (Gemini model interface), and `NODE_ENV`.


4. **Setup Frontend:**
   Navigate to the frontend directory and install packages:
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start Dev Servers:**
   Run backend and frontend dev servers concurrently:
   * Backend (from `backend/` folder): `npm run dev`
   * Frontend (from `frontend/` folder): `npm run dev`

---

## API Routes

### Authentication
* `POST /api/auth/signup` - Register a candidate/recruiter account.
* `POST /api/auth/login` - Login to retrieve JWT session tokens.

### Jobs
* `GET /api/jobs` - Retrieve all open listings.
* `POST /api/jobs` - Create a job (Recruiter/Admin).
* `DELETE /api/jobs/:id` - Remove a job (Recruiter/Admin).

### Applications
* `POST /api/applications` - Submit candidate application with resume upload.
* `GET /api/applications` - Retrieve candidate or recruiter applications.
* `PUT /api/applications/:id/status` - Shortlist/Reject candidates.
* `POST /api/applications/job/:jobId/rank` - Execute candidate pool ranking.

### AI Endpoints
* `POST /api/ai/analyze-resume` - Audit resume and extract profile details.
* `POST /api/ai/generate-cover-letter` - Write cover letter.
* `POST /api/ai/generate-job-description` - Write optimized job description.

---

## Deployment Guide

### Backend (Render)
1. Link your GitHub repository to Render.
2. Select Web Service as the build type.
3. Configure settings:
   * Build Command: `npm install`
   * Start Command: `node server.js`
4. Add all `.env` variables under **Environment** settings.

### Frontend (Vercel)
1. Connect your repo to Vercel and create a new project.
2. Select **Vite** as the framework preset.
3. Set Environment Variable:
   * `VITE_API_URL` to your Render backend web service URL (e.g. `https://nexhr-backend.onrender.com`).
4. Click deploy.

---

## License

This project is licensed under the MIT License.
