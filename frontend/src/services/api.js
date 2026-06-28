import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request Interceptor: Attach token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request - clearing token');
      localStorage.removeItem('token');
      // We can trigger a window redirect or state update if needed
    }
    return Promise.reject(error);
  }
);

export default api;

/* ==========================================================================
   API METHODS
   ========================================================================== */

// Auth APIs (Optional shortcuts, raw axios also works in context)
export const getProfile = () => api.get('/auth/me');

// Jobs APIs
export const fetchAllJobs = () => api.get('/jobs');
export const fetchJobDetails = (id) => api.get(`/jobs/${id}`);
export const postJob = (jobData) => api.post('/jobs', jobData);
export const updateJob = (id, jobData) => api.put(`/jobs/${id}`, jobData);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);

// Applications APIs
export const applyJob = (formData) => api.post('/applications', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const fetchApplications = () => api.get('/applications');
export const fetchApplicationById = (id) => api.get(`/applications/${id}`);
export const updateAppStatus = (id, status) => api.put(`/applications/${id}/status`, { status });
export const rankJobApplicants = (jobId) => api.post(`/applications/job/${jobId}/rank`);

// Standalone AI APIs
export const analyzeResumeFile = (formData) => api.post('/ai/analyze-resume', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const analyzeResumeText = (resumeText) => api.post('/ai/analyze-resume', { resumeText });
export const checkATSMatch = (resumeText, jobDescription) => api.post('/ai/check-ats', { resumeText, jobDescription });
export const getCoverLetter = (jobDescription, resumeText = "") => api.post('/ai/generate-cover-letter', { jobDescription, resumeText });
export const getInterviewPrep = (jobDescription, resumeText = "") => api.post('/ai/interview-prep', { jobDescription, resumeText });
export const getCareerAdvice = (careerGoals, resumeText = "") => api.post('/ai/career-advice', { careerGoals, resumeText });
export const generateJobDescription = (title, keyRequirements = "") => api.post('/ai/generate-job-description', { title, keyRequirements });


// Interview APIs
export const scheduleMeeting = (meetingData) => api.post('/interviews', meetingData);
export const fetchInterviews = () => api.get('/interviews');
export const updateMeetingStatus = (id, meetingData) => api.put(`/interviews/${id}`, meetingData);

// Users Dashboard / Notifications
export const fetchDashboardMetrics = () => api.get('/users/dashboard');
export const fetchNotifications = () => api.get('/users/notifications');
export const markNotificationAsRead = (id) => api.put(`/users/notifications/${id}`);

// Admin Only APIs
export const fetchAllUsers = () => api.get('/users');
export const deleteUserByAdmin = (id) => api.delete(`/users/${id}`);
