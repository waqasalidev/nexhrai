import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Users, Calendar, TrendingUp, Plus, Loader2, Sparkles,
  FileText, CalendarDays, X, Check, Mail, Phone, AlertCircle, Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'sonner';
import { Cursor } from '@/components/nexhr/Cursor';
import { Navbar } from '@/components/nexhr/Navbar';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

export const Route = createFileRoute('/dashboard/recruiter')({
  component: RecruiterDashboard,
});

function RecruiterDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in or wrong role (allowing recruiter and admin roles)
  useEffect(() => {
    if (!token) {
      navigate({ to: '/login' });
    } else if (user && user.role !== 'recruiter' && user.role !== 'admin') {
      navigate({ to: '/' });
    }
  }, [token, user]);

  // Dashboard Data State
  const [metrics, setMetrics] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rankingPool, setRankingPool] = useState(false);

  // Search, Filter & Tabs state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('applicants'); // 'applicants' or 'analytics'

  // Modals & Drawers States
  const [showJobModal, setShowJobModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // New Job Form State
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobReqs, setJobReqs] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [jobSalary, setJobSalary] = useState('');
  const [jobSkills, setJobSkills] = useState('');
  const [postingJob, setPostingJob] = useState(false);
  const [generatingAIJobDesc, setGeneratingAIJobDesc] = useState(false);

  const handleAIGenerateJobDesc = async () => {
    if (!jobTitle) {
      toast.error('Please enter a Job Title first');
      return;
    }
    try {
      setGeneratingAIJobDesc(true);
      toast.info('Generating job description via Gemini...');
      const res = await api.post('/ai/generate-job-description', { title: jobTitle, keyRequirements: jobReqs });
      setJobDesc(res.data.description);
      setJobReqs(res.data.requirements);
      if (res.data.skills) {
        setJobSkills(res.data.skills.join(', '));
      }
      toast.success('Job description generated successfully!');
    } catch (err) {
      toast.error('Failed to generate job description via AI');
      console.error(err);
    } finally {
      setGeneratingAIJobDesc(false);
    }
  };

  // Schedule Interview Form State
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewType, setInterviewType] = useState('Virtual');
  const [meetingLink, setMeetingLink] = useState('');
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [scheduling, setScheduling] = useState(false);

  // Load recruiter dashboard metrics and jobs list
  const fetchRecruiterData = async () => {
    try {
      setLoading(true);
      const [metricRes, jobRes, appRes, interviewRes] = await Promise.all([
        api.get('/users/dashboard'),
        api.get('/jobs'), // Filtered inside controller or fetch all and filter
        api.get('/applications'),
        api.get('/interviews')
      ]);
      setMetrics(metricRes.data);
      setInterviews(interviewRes.data);
      
      // Filter jobs belonging to this recruiter (Admins see all jobs posted on the platform)
      const recruiterJobs = user?.role === 'admin'
        ? jobRes.data
        : jobRes.data.filter(j => j.recruiter?._id === user?._id || j.recruiter === user?._id);
      setJobs(recruiterJobs);

      if (recruiterJobs.length > 0) {
        const defaultJobId = recruiterJobs[0]._id;
        setSelectedJobId(defaultJobId);
        // Filter applications for the default job
        const jobApps = appRes.data.filter(app => app.job?._id === defaultJobId || app.job === defaultJobId);
        setApplicants(jobApps.sort((a, b) => b.atsScore - a.atsScore));
      } else {
        setApplicants([]);
      }
    } catch (err) {
      toast.error('Failed to load recruiter workspace metrics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'recruiter') {
      fetchRecruiterData();
    }
  }, [user]);

  // Handle selected job change
  const handleJobSelect = async (jobId) => {
    setSelectedJobId(jobId);
    setSearchQuery('');
    setStatusFilter('All');
    try {
      const appRes = await api.get('/applications');
      const filtered = appRes.data.filter(app => app.job?._id === jobId || app.job === jobId);
      setApplicants(filtered.sort((a, b) => b.atsScore - a.atsScore));
      setSelectedApplicant(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Post a Job
  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!jobTitle || !jobDesc || !jobLocation) {
      toast.error('Please enter Title, Description, and Location');
      return;
    }

    try {
      setPostingJob(true);
      const skillsArray = jobSkills.split(',').map(s => s.trim()).filter(Boolean);
      await api.post('/jobs', {
        title: jobTitle,
        description: jobDesc,
        requirements: jobReqs,
        location: jobLocation,
        type: jobType,
        salary: jobSalary,
        skillsRequired: skillsArray
      });

      toast.success('New job description published successfully!');
      setShowJobModal(false);
      
      // Reset form
      setJobTitle('');
      setJobDesc('');
      setJobReqs('');
      setJobLocation('');
      setJobSkills('');
      setJobSalary('');

      fetchRecruiterData();
    } catch (err) {
      toast.error('Failed to post job');
    } finally {
      setPostingJob(false);
    }
  };

  // Trigger Gemini AI Candidate Pool Ranking
  const handleAIRanking = async () => {
    if (!selectedJobId) return;

    try {
      setRankingPool(true);
      toast.info('Running AI re-ranking pool matching on candidates...');
      const res = await api.post(`/applications/job/${selectedJobId}/rank`);
      setApplicants(res.data);
      toast.success('Candidates ranked successfully!');
      fetchRecruiterData();
    } catch (err) {
      toast.error('AI ranking pool calculation failed');
    } finally {
      setRankingPool(false);
    }
  };

  // Schedule Interview
  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!selectedApplicant || !interviewDate) {
      toast.error('Please select an applicant and date/time');
      return;
    }

    try {
      setScheduling(true);
      await api.post('/interviews', {
        applicationId: selectedApplicant._id,
        dateTime: interviewDate,
        type: interviewType,
        link: meetingLink,
        notes: recruiterNotes,
      });

      toast.success(`Interview panel scheduled! Notification sent to ${selectedApplicant.candidate?.name}`);
      setShowInterviewModal(false);
      setInterviewDate('');
      setMeetingLink('');
      setRecruiterNotes('');
      
      // Refresh current job applications
      handleJobSelect(selectedJobId);
      fetchRecruiterData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule meeting');
    } finally {
      setScheduling(false);
    }
  };

  // Update applicant Status
  const handleStatusChange = async (appId, nextStatus) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, { status: nextStatus });
      toast.success(`Status updated to ${nextStatus}`);
      
      // Update local state
      setApplicants(prev => prev.map(a => a._id === appId ? { ...a, status: res.data.status } : a));
      if (selectedApplicant && selectedApplicant._id === appId) {
        setSelectedApplicant(prev => ({ ...prev, status: res.data.status }));
      }
    } catch (err) {
      toast.error('Failed to update applicant status');
    }
  };

  const exportReportPDF = (applicant) => {
    if (!applicant) return;
    
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Popup blocked! Please allow popups to export the PDF.");
      return;
    }

    const title = `Evaluation_Report_${applicant.candidate?.name?.replace(/\\s+/g, '_')}`;

    const htmlContent = `
      <html>
        <head>
          <title>\${title}</title>
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              color: #1e293b;
              margin: 40px;
              line-height: 1.6;
            }
            .header {
              border-bottom: 2px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .brand {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
            }
            .report-title {
              font-size: 18px;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 30px;
              background: #f8fafc;
              padding: 20px;
              border-radius: 12px;
              border: 1px solid #e2e8f0;
            }
            .meta-item strong {
              color: #475569;
            }
            .badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 9999px;
              font-size: 12px;
              font-weight: 600;
            }
            .badge-recommended {
              background: #dcfce7;
              color: #15803d;
            }
            .badge-highly {
              background: #dbeafe;
              color: #1d4ed8;
            }
            .badge-average {
              background: #fef9c3;
              color: #a16207;
            }
            .badge-not {
              background: #fee2e2;
              color: #b91c1c;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #0f172a;
              border-left: 4px solid #2563eb;
              padding-left: 10px;
              margin-bottom: 15px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .score-circle {
              background: #2563eb;
              color: white;
              width: 60px;
              height: 60px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
              font-weight: bold;
            }
            .list-item {
              margin-bottom: 8px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">NexHR AI</div>
            <div class="report-title">Candidate Evaluation Report</div>
          </div>

          <div class="meta-grid">
            <div class="meta-item"><strong>Candidate Name:</strong> \${applicant.candidate?.name || 'N/A'}</div>
            <div class="meta-item"><strong>Job Position:</strong> \${applicant.job?.title || 'N/A'}</div>
            <div class="meta-item"><strong>Candidate Email:</strong> \${applicant.candidate?.email || 'N/A'}</div>
            <div class="meta-item"><strong>Application Date:</strong> \${new Date(applicant.createdAt).toLocaleDateString()}</div>
            <div class="meta-item"><strong>AI Recommendation:</strong> 
              <span class="badge \${
                applicant.analysis?.recommendation === 'Highly Recommended' ? 'badge-highly' :
                applicant.analysis?.recommendation === 'Recommended' ? 'badge-recommended' :
                applicant.analysis?.recommendation === 'Not Recommended' ? 'badge-not' : 'badge-average'
              }">\${applicant.analysis?.recommendation || 'Average Match'}</span>
            </div>
            <div class="meta-item" style="display: flex; align-items: center; gap: 10px;">
              <strong>ATS Compatibility Score:</strong>
              <div class="score-circle">\${applicant.atsScore || 0}%</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Applicant Summary</div>
            <p>\${applicant.analysis?.fitSummary || 'Evaluation pending.'}</p>
          </div>

          <div class="section">
            <div class="section-title">Resume Analysis & Strengths</div>
            <ul>
              \${(applicant.analysis?.skillMatch || []).length > 0
                ? applicant.analysis.skillMatch.map(s => '<li class="list-item">Strong match in skill: <strong>' + s + '</strong></li>').join("")
                : '<li class="list-item">No core matching skills highlighted.</li>'
              }
            </ul>
          </div>

          <div class="section">
            <div class="section-title">Hiring Recommendation & Areas of Improvement</div>
            <ul>
              \${(applicant.analysis?.skillGaps || []).length > 0
                ? applicant.analysis.skillGaps.map(s => '<li class="list-item">Identified gap in skill: <strong>' + s + '</strong></li>').join("")
                : '<li class="list-item">No significant skill gaps identified.</li>'
              }
            </ul>
          </div>

          <div class="section">
            <div class="section-title">Suggested Recruiter Actions</div>
            <ul>
              \${(applicant.analysis?.suggestions || []).length > 0
                ? applicant.analysis.suggestions.map(s => '<li class="list-item">' + s + '</li>').join("")
                : '<li class="list-item">No suggestions logged.</li>'
              }
            </ul>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-violet-glow" />
          <span className="text-sm text-muted-foreground">Syncing recruiter panel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden pb-16">
      {/* Background gradients */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-30 bg-aurora opacity-70" />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-30 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <Cursor />
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pt-28 space-y-8">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-violet-glow font-medium">Recruiter Workspace</div>
            <h1 className="text-3xl font-bold mt-1">Hey, <span className="text-gradient">{user.name}</span></h1>
            <p className="text-sm text-muted-foreground mt-1">Post roles, evaluate resumes, and run AI-powered pool matchings.</p>
          </div>

          <button
            onClick={() => setShowJobModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-violet to-violet-glow text-white text-xs font-semibold glow-violet hover:scale-[1.03] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Publish New Job
          </button>
        </div>

        {/* KPIs Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl glass-strong border border-white/5 p-5 relative overflow-hidden">
            <Briefcase className="absolute right-4 top-4 h-5 w-5 text-violet-glow opacity-50" />
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Jobs Posted</div>
            <div className="text-2xl font-bold mt-1">{metrics?.jobsCount || 0}</div>
          </div>
          
          <div className="rounded-2xl glass-strong border border-white/5 p-5 relative overflow-hidden">
            <Users className="absolute right-4 top-4 h-5 w-5 text-violet-glow opacity-50" />
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Applicants Received</div>
            <div className="text-2xl font-bold mt-1">{metrics?.applicationsCount || 0}</div>
          </div>

          <div className="rounded-2xl glass-strong border border-white/5 p-5 relative overflow-hidden">
            <Calendar className="absolute right-4 top-4 h-5 w-5 text-violet-glow opacity-50" />
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Live Scheduled Panels</div>
            <div className="text-2xl font-bold mt-1">{metrics?.interviewsCount || 0}</div>
          </div>

          <div className="rounded-2xl glass-strong border border-white/5 p-5 relative overflow-hidden">
            <TrendingUp className="absolute right-4 top-4 h-5 w-5 text-violet-glow opacity-50" />
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Pool Average match</div>
            <div className="text-2xl font-bold mt-1">{metrics?.averageATSScore || metrics?.averageAtsScore || 0}%</div>
          </div>
        </div>

        {/* Main recruitment flow */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
          
          {/* Posted Job Listings Column */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-violet-glow" /> Published Roles ({jobs.length})
            </h2>

            <div className="space-y-3">
              {jobs.length > 0 ? (
                jobs.map(job => (
                  <div
                    key={job._id}
                    onClick={() => handleJobSelect(job._id)}
                    className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedJobId === job._id
                        ? 'border-violet-glow bg-violet/10'
                        : 'border-white/5 bg-white/[0.01] hover:border-white/10'
                    }`}
                  >
                    <div className="font-semibold text-white text-sm">{job.title}</div>
                    <div className="text-muted-foreground mt-1">{job.location} · {job.type}</div>
                    <div className="text-[10px] text-violet-glow mt-2">Salary: {job.salary || 'Unspecified'}</div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground text-center py-6">No jobs published yet.</p>
              )}
            </div>
          </div>
          {/* Applicants Pool Column */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-violet-glow" /> Candidates Evaluation Pool ({applicants.length})
              </h2>

              <div className="flex items-center gap-2">
                {applicants.length > 0 && (
                  <button
                    onClick={handleAIRanking}
                    disabled={rankingPool}
                    className="px-4 py-2 rounded-lg bg-gradient-to-br from-violet to-violet-glow text-white text-xs font-medium glow-violet transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {rankingPool ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                    Gemini Pool Match
                  </button>
                )}
              </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex border-b border-white/5 mb-4">
              <button
                onClick={() => setActiveTab('applicants')}
                className={`px-4 py-2 text-xs font-semibold border-b-2 cursor-pointer transition-all ${
                  activeTab === 'applicants'
                    ? 'border-violet-glow text-white'
                    : 'border-transparent text-muted-foreground hover:text-white'
                }`}
              >
                Applicants List ({applicants.length})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 text-xs font-semibold border-b-2 cursor-pointer transition-all ${
                  activeTab === 'analytics'
                    ? 'border-violet-glow text-white'
                    : 'border-transparent text-muted-foreground hover:text-white'
                }`}
              >
                AI Analytics Insights
              </button>
            </div>

            {activeTab === 'applicants' ? (
              <div className="space-y-4">
                {/* Search, Filter, Export Controls */}
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Search by name/email..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-foreground focus:outline-none focus:border-violet-glow"
                  />
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-foreground focus:outline-none focus:border-violet-glow"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Applied">Applied</option>
                    <option value="Screened">Shortlisted</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button
                    onClick={() => {
                      if (applicants.length === 0) {
                        toast.error('No applicants to export');
                        return;
                      }
                      const headers = ['Name', 'Email', 'ATS Score', 'Status', 'Applied Date'];
                      const rows = applicants.map(app => [
                        app.candidate?.name || '',
                        app.candidate?.email || '',
                        `${app.atsScore}%`,
                        app.status || '',
                        new Date(app.createdAt).toLocaleDateString()
                      ]);
                      const csvContent = "data:text/csv;charset=utf-8," 
                        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `Applicants_Export_${selectedJobId}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      toast.success('Applicants exported as CSV!');
                    }}
                    className="px-3 py-1.5 bg-violet/10 border border-violet/20 hover:bg-violet/20 text-violet-glow rounded-lg text-xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <FileText className="h-3 w-3" /> Export CSV
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Applicants list */}
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {applicants.filter(app => {
                      const nameMatch = app.candidate?.name?.toLowerCase().includes(searchQuery.toLowerCase());
                      const emailMatch = app.candidate?.email?.toLowerCase().includes(searchQuery.toLowerCase());
                      const statusMatch = statusFilter === 'All' || app.status === statusFilter;
                      return (nameMatch || emailMatch) && statusMatch;
                    }).length > 0 ? (
                      applicants.filter(app => {
                        const nameMatch = app.candidate?.name?.toLowerCase().includes(searchQuery.toLowerCase());
                        const emailMatch = app.candidate?.email?.toLowerCase().includes(searchQuery.toLowerCase());
                        const statusMatch = statusFilter === 'All' || app.status === statusFilter;
                        return (nameMatch || emailMatch) && statusMatch;
                      }).map(app => (
                        <div
                          key={app._id}
                          onClick={() => setSelectedApplicant(app)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                            selectedApplicant?._id === app._id
                              ? 'border-violet-glow bg-violet/10'
                              : 'border-white/5 bg-white/[0.01] hover:border-white/10'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <div className="font-semibold text-white text-sm">{app.candidate?.name || 'Applicant'}</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[150px]">{app.candidate?.email}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-violet-glow text-sm">{app.atsScore}% Match</div>
                              <div className="text-[8px] text-muted-foreground mt-0.5">AI Rating</div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[10px]">
                            <span className="px-2 py-0.5 rounded bg-white/5 text-muted-foreground border border-white/5">
                              {app.status === 'Screened' ? 'Shortlisted' : app.status}
                            </span>
                            <span className="text-muted-foreground">{new Date(app.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-12">No candidates match the filter parameters.</p>
                    )}
                  </div>

                  {/* Applicant Detail Drawer */}
                  <div className="rounded-2xl glass-strong border border-white/5 p-5 min-h-[400px]">
                    {selectedApplicant ? (() => {
                      const appInterview = interviews.find(i => 
                        i.application === selectedApplicant._id || 
                        (i.application && typeof i.application === 'object' && i.application._id === selectedApplicant._id)
                      );
                      return (
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-bold text-lg text-white">{selectedApplicant.candidate?.name}</h3>
                            <p className="text-xs text-muted-foreground">{selectedApplicant.candidate?.title || 'Software Professional'}</p>
                          </div>

                          {/* Contacts */}
                          <div className="text-[11px] text-muted-foreground space-y-1.5">
                            <div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-violet-glow" /> {selectedApplicant.candidate?.email}</div>
                            {selectedApplicant.resumePath && (
                              <button
                                onClick={() => {
                                  const cleanPath = selectedApplicant.resumePath.startsWith('/') 
                                    ? selectedApplicant.resumePath.slice(1) 
                                    : selectedApplicant.resumePath;
                                  window.open(`${api.defaults.baseURL.replace('/api', '')}/${cleanPath}`, '_blank');
                                }}
                                className="flex items-center gap-1.5 text-violet-glow hover:underline text-left cursor-pointer"
                              >
                                <Download className="h-3.5 w-3.5" /> Download Candidate Resume
                              </button>
                            )}
                          </div>

                          {selectedApplicant.candidate?.skills && selectedApplicant.candidate?.skills.length > 0 && (
                            <div className="pt-1">
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Candidate Profile Skills</div>
                              <div className="flex flex-wrap gap-1 max-h-[70px] overflow-y-auto pr-1">
                                {selectedApplicant.candidate.skills.map((skill, index) => (
                                  <span key={index} className="px-2 py-0.5 rounded text-[9px] bg-white/5 border border-white/5 text-muted-foreground">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <hr className="border-white/5" />

                          {/* ATS Scoring */}
                          <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-center">
                            <div>
                              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">ATS compatibility</div>
                              <div className="text-xl font-bold text-white mt-0.5">{selectedApplicant.atsScore}%</div>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet/20 text-violet-glow border border-violet/30">
                              {selectedApplicant.status === 'Screened' ? 'Shortlisted' : selectedApplicant.status}
                            </span>
                          </div>

                          {/* Interview tracking panel */}
                          {appInterview && (
                            <div className="bg-violet/5 p-3 rounded-xl border border-violet/20/40 space-y-2 mt-2 text-xs">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] uppercase tracking-wider text-violet-glow font-semibold flex items-center gap-1">
                                  <CalendarDays className="h-3 w-3" /> Scheduled panel
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                                  appInterview.status === 'Scheduled' ? 'bg-violet/20 text-violet-glow border border-violet/30' :
                                  appInterview.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                  'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                  {appInterview.status}
                                </span>
                              </div>
                              <div className="text-[11px] text-white">
                                <strong>Date/Time:</strong> {new Date(appInterview.dateTime).toLocaleString()}
                              </div>
                              {appInterview.link && (
                                <div className="text-[10px] text-muted-foreground">
                                  <strong>Link:</strong> <a href={appInterview.link} target="_blank" rel="noreferrer" className="text-violet-glow underline hover:text-white transition-colors">Join Meeting</a>
                                </div>
                              )}
                              {appInterview.notes && (
                                <div className="text-[10px] text-muted-foreground italic truncate">
                                  "{appInterview.notes}"
                                </div>
                              )}
                              <div className="flex gap-2 pt-1">
                                <select
                                  value={appInterview.status}
                                  onChange={async (e) => {
                                    try {
                                      await api.put(`/interviews/${appInterview._id}`, { status: e.target.value });
                                      toast.success(`Interview status updated to ${e.target.value}`);
                                      fetchRecruiterData();
                                    } catch (err) {
                                      toast.error("Failed to update status");
                                    }
                                  }}
                                  className="bg-black/40 border border-white/10 rounded px-2 py-1 text-[10px] text-white focus:outline-none w-full cursor-pointer"
                                >
                                  <option value="Scheduled">Scheduled</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>
                            </div>
                          )}

                          {/* Fit summary */}
                          <div className="text-xs leading-relaxed text-muted-foreground bg-black/20 p-3 rounded-lg max-h-[160px] overflow-y-auto">
                            <div className="font-semibold text-white text-[11px] mb-1">AI Recommendation summary:</div>
                            {selectedApplicant.analysis?.fitSummary || 'No evaluation summaries computed. Click Gemini Pool Match to analyze.'}
                          </div>

                          {/* Actions */}
                          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                            <button
                              onClick={() => handleStatusChange(selectedApplicant._id, 'Screened')}
                              className="py-2 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer font-semibold"
                            >
                              <Check className="h-3.5 w-3.5" /> Shortlist
                            </button>
                            <button
                              onClick={() => setShowInterviewModal(true)}
                              className="py-2 bg-violet/10 border border-violet/20 hover:bg-violet/20 text-violet-glow rounded-lg flex items-center justify-center gap-1.5 cursor-pointer font-semibold"
                            >
                              <CalendarDays className="h-3.5 w-3.5" /> Interview
                            </button>
                            <button
                              onClick={() => handleStatusChange(selectedApplicant._id, 'Rejected')}
                              className="col-span-2 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer font-semibold"
                            >
                              <X className="h-3.5 w-3.5" /> Reject Candidate
                            </button>
                            <button
                              onClick={() => exportReportPDF(selectedApplicant)}
                              className="col-span-2 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg flex items-center justify-center gap-1.5 cursor-pointer font-semibold"
                            >
                              <FileText className="h-3.5 w-3.5" /> Export PDF Evaluation Report
                            </button>
                          </div>
                        </div>
                      );
                    })() : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4">
                        <AlertCircle className="h-10 w-10 text-muted-foreground/40 mb-2" />
                        <span className="text-xs text-muted-foreground">Select a candidate on the left to review metrics</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // AI ANALYTICS CHARTS TAB VIEW
              <div className="grid sm:grid-cols-2 gap-6 pt-2">
                {/* 1. Pipeline chart */}
                <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 space-y-3">
                  <div className="text-xs font-semibold text-white">Recruitment Hiring Pipeline</div>
                  <div className="h-[180px] w-full text-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Applied', value: applicants.filter(a => a.status === 'Applied').length },
                        { name: 'Shortlisted', value: applicants.filter(a => a.status === 'Screened').length },
                        { name: 'Interview', value: applicants.filter(a => a.status === 'Interviewing').length },
                        { name: 'Offered', value: applicants.filter(a => a.status === 'Offered').length },
                        { name: 'Rejected', value: applicants.filter(a => a.status === 'Rejected').length },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#666" />
                        <YAxis stroke="#666" allowDecimals={false} />
                        <Tooltip contentStyle={{ background: '#121212', borderColor: '#333', color: '#fff' }} />
                        <Bar dataKey="value" fill="#8884d8">
                          { [0,1,2,3,4].map((e, index) => {
                            const colors = ['#a78bfa', '#34d399', '#60a5fa', '#f59e0b', '#f87171'];
                            return <Cell key={`cell-${index}`} fill={colors[index]} />;
                          }) }
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Trends chart */}
                <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 space-y-3">
                  <div className="text-xs font-semibold text-white">Application Trends Over Time</div>
                  <div className="h-[180px] w-full text-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={(() => {
                        const trendsMap = {};
                        applicants.forEach(app => {
                          const dateStr = new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                          trendsMap[dateStr] = (trendsMap[dateStr] || 0) + 1;
                        });
                        return Object.keys(trendsMap).map(k => ({ date: k, applicants: trendsMap[k] })).reverse().slice(-7);
                      })()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" stroke="#666" />
                        <YAxis stroke="#666" allowDecimals={false} />
                        <Tooltip contentStyle={{ background: '#121212', borderColor: '#333', color: '#fff' }} />
                        <Line type="monotone" dataKey="applicants" stroke="#a78bfa" strokeWidth={2} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. Top skills chart */}
                <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 space-y-3">
                  <div className="text-xs font-semibold text-white">Top Candidate Skills In Pool</div>
                  <div className="h-[180px] w-full text-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={(() => {
                        const skillsMap = {};
                        applicants.forEach(app => {
                          const skills = app.candidate?.skills || [];
                          skills.forEach(s => {
                            const cleanSkill = s.trim();
                            if (cleanSkill) skillsMap[cleanSkill] = (skillsMap[cleanSkill] || 0) + 1;
                          });
                        });
                        return Object.keys(skillsMap)
                          .map(k => ({ skill: k, count: skillsMap[k] }))
                          .sort((a, b) => b.count - a.count)
                          .slice(0, 5);
                      })()} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis type="number" stroke="#666" allowDecimals={false} />
                        <YAxis dataKey="skill" type="category" stroke="#666" width={60} />
                        <Tooltip contentStyle={{ background: '#121212', borderColor: '#333', color: '#fff' }} />
                        <Bar dataKey="count" fill="#38bdf8" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 4. Score Distribution */}
                <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 space-y-3">
                  <div className="text-xs font-semibold text-white">ATS Score Distribution Profile</div>
                  <div className="h-[180px] w-full text-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { range: '0-50', count: applicants.filter(a => a.atsScore <= 50).length },
                        { range: '51-70', count: applicants.filter(a => a.atsScore > 50 && a.atsScore <= 70).length },
                        { range: '71-85', count: applicants.filter(a => a.atsScore > 70 && a.atsScore <= 85).length },
                        { range: '86-100', count: applicants.filter(a => a.atsScore > 85).length },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="range" stroke="#666" />
                        <YAxis stroke="#666" allowDecimals={false} />
                        <Tooltip contentStyle={{ background: '#121212', borderColor: '#333', color: '#fff' }} />
                        <Area type="monotone" dataKey="count" stroke="#a78bfa" fill="rgba(167, 139, 250, 0.15)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 5. Applicant Sources Pie */}
                <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 space-y-3">
                  <div className="text-xs font-semibold text-white">Simulated Candidate Pipeline Sources</div>
                  <div className="h-[180px] w-full text-[10px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={(() => {
                            const sourcesMap = { 'LinkedIn': 0, 'Indeed': 0, 'Referral': 0, 'Glassdoor': 0, 'Direct': 0 };
                            applicants.forEach(app => {
                              const hash = (app.candidate?.name || '').length % 5;
                              const sources = ['LinkedIn', 'Indeed', 'Referral', 'Glassdoor', 'Direct'];
                              sourcesMap[sources[hash]] += 1;
                            });
                            return Object.keys(sourcesMap).map(k => ({ name: k, value: sourcesMap[k] })).filter(d => d.value > 0);
                          })()}
                          cx="50%"
                          cy="50%"
                          outerRadius={55}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          { [0,1,2,3,4].map((e, index) => {
                            const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
                            return <Cell key={`cell-${index}`} fill={colors[index]} />;
                          }) }
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 6. Match distribution */}
                <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 space-y-3">
                  <div className="text-xs font-semibold text-white">Job Match Percentage Distribution</div>
                  <div className="h-[180px] w-full text-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { range: '0-50%', count: applicants.filter(a => a.matchPercentage <= 50).length },
                        { range: '51-70%', count: applicants.filter(a => a.matchPercentage > 50 && a.matchPercentage <= 70).length },
                        { range: '71-85%', count: applicants.filter(a => a.matchPercentage > 70 && a.matchPercentage <= 85).length },
                        { range: '86-100%', count: applicants.filter(a => a.matchPercentage > 85).length },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="range" stroke="#666" />
                        <YAxis stroke="#666" allowDecimals={false} />
                        <Tooltip contentStyle={{ background: '#121212', borderColor: '#333', color: '#fff' }} />
                        <Area type="monotone" dataKey="count" stroke="#10b981" fill="rgba(16, 185, 129, 0.15)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* JOB CREATION MODAL */}
      <AnimatePresence>
        {showJobModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xl glass-strong border border-white/10 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setShowJobModal(false)} className="absolute right-4 top-4 text-white/40 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
              
              <h2 className="text-xl font-bold mb-4 text-gradient">Publish Job Listing</h2>
              
              <form onSubmit={handlePostJob} className="space-y-4 text-xs">
                <div>
                  <label className="block text-muted-foreground mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-violet-glow"
                    placeholder="e.g. Lead React Developer"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-muted-foreground mb-1">Location</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none"
                      placeholder="e.g. Remote / New York"
                      value={jobLocation}
                      onChange={e => setJobLocation(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1">Job Type</label>
                    <select
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none"
                      value={jobType}
                      onChange={e => setJobType(e.target.value)}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-muted-foreground mb-1">Expected Salary</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none"
                      placeholder="e.g. $120,000 - $140,000"
                      value={jobSalary}
                      onChange={e => setJobSalary(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1">Core Required Skills (comma separated)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none"
                      placeholder="e.g. React, Node, WebGL"
                      value={jobSkills}
                      onChange={e => setJobSkills(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-muted-foreground">Job Description</label>
                    <button
                      type="button"
                      onClick={handleAIGenerateJobDesc}
                      disabled={generatingAIJobDesc || !jobTitle}
                      className="text-[10px] text-violet-glow hover:underline cursor-pointer flex items-center gap-1 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {generatingAIJobDesc ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                      AI Auto-write
                    </button>
                  </div>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none resize-none"
                    placeholder="Provide details on scope, expectations, etc. (Or click AI Auto-write after typing Title)"
                    value={jobDesc}
                    onChange={e => setJobDesc(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1">Minimum Job Requirements</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none resize-none"
                    placeholder="e.g. 5+ years React, Bachelors in CS"
                    value={jobReqs}
                    onChange={e => setJobReqs(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={postingJob}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-br from-violet to-violet-glow text-white font-medium shadow-lg glow-violet hover:scale-[1.02] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {postingJob ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Publish Listing'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INTERVIEW SCHEDULER MODAL */}
      <AnimatePresence>
        {showInterviewModal && selectedApplicant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md glass-strong border border-white/10 rounded-2xl p-6 shadow-2xl relative"
            >
              <button onClick={() => setShowInterviewModal(false)} className="absolute right-4 top-4 text-white/40 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-xl font-bold mb-4 text-gradient">Schedule Interview</h2>
              <p className="text-xs text-muted-foreground mb-4">
                Booking a panel date for <strong className="text-white">{selectedApplicant.candidate?.name}</strong>. Candidate will receive a Nodemailer invite.
              </p>

              <form onSubmit={handleScheduleInterview} className="space-y-4 text-xs">
                <div>
                  <label className="block text-muted-foreground mb-1">Interview Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none"
                    value={interviewDate}
                    onChange={e => setInterviewDate(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-muted-foreground mb-1">Interview Type</label>
                    <select
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none"
                      value={interviewType}
                      onChange={e => setInterviewType(e.target.value)}
                    >
                      <option value="Virtual">Virtual Meeting</option>
                      <option value="Phone">Phone Screen</option>
                      <option value="In-Person">In-Person Office</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1">Meeting Link (e.g. Meet/Zoom)</label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none"
                      placeholder="https://meet.google.com/..."
                      value={meetingLink}
                      onChange={e => setMeetingLink(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1">Candidate Preparation Notes</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none resize-none"
                    placeholder="Brief agenda or requirements for the interview..."
                    value={recruiterNotes}
                    onChange={e => setRecruiterNotes(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={scheduling}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-br from-violet to-violet-glow text-white font-medium shadow-lg glow-violet hover:scale-[1.02] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {scheduling ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Confirm Interview'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
