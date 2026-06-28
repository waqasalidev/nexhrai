import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, UploadCloud, CheckCircle2, TrendingUp, AlertTriangle, 
  Sparkles, Calendar, Bell, Loader2, ArrowRight, Briefcase, BookOpen, UserCheck, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'sonner';
import { Cursor } from '@/components/nexhr/Cursor';
import { Navbar } from '@/components/nexhr/Navbar';

export const Route = createFileRoute('/dashboard/candidate')({
  component: CandidateDashboard,
});

function CandidateDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in or wrong role
  useEffect(() => {
    if (!token) {
      navigate({ to: '/login' });
    } else if (user && user.role !== 'candidate') {
      navigate({ to: '/' });
    }
  }, [token, user]);

  // Dashboard Data State
  const [metrics, setMetrics] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Resume Analyzer States
  const [uploading, setUploading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  // ATS Checker States
  const [jobDescription, setJobDescription] = useState('');
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  // Cover Letter & Interview Prep States
  const [generatingCL, setGeneratingCL] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [generatingPrep, setGeneratingPrep] = useState(false);
  const [prepQuestions, setPrepQuestions] = useState([]);
  const [generatingAdvice, setGeneratingAdvice] = useState(false);
  const [careerAdvice, setCareerAdvice] = useState('');
  const [openJobs, setOpenJobs] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applyCoverLetter, setApplyCoverLetter] = useState('');
  const [applyResume, setApplyResume] = useState(null);

  const handleGenerateCareerAdvice = async () => {
    try {
      setGeneratingAdvice(true);
      const res = await api.post('/ai/career-advice', {
        careerGoals: "General progression to lead engineer."
      });
      setCareerAdvice(res.data.advice);
      toast.success('Career advice generated!');
    } catch (err) {
      toast.error('Failed to generate career advice');
    } finally {
      setGeneratingAdvice(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob || !applyResume) {
      toast.error('Please upload a PDF resume');
      return;
    }

    const formData = new FormData();
    formData.append('jobId', selectedJob._id);
    formData.append('resume', applyResume);
    formData.append('coverLetter', applyCoverLetter);

    try {
      setApplying(true);
      toast.info('Submitting application and running ATS audit...');
      await api.post('/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(`Applied successfully for ${selectedJob.title}!`);
      setShowApplyModal(false);
      setApplyCoverLetter('');
      setApplyResume(null);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application submission failed');
    } finally {
      setApplying(false);
    }
  };

  // Fetch all initial dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [metricRes, interviewRes, notifyRes, jobRes] = await Promise.all([
        api.get('/users/dashboard'),
        api.get('/interviews'),
        api.get('/users/notifications'),
        api.get('/jobs')
      ]);
      setMetrics(metricRes.data);
      setInterviews(interviewRes.data);
      setNotifications(notifyRes.data);
      setOpenJobs(jobRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'candidate') {
      fetchDashboardData();
    }
  }, [user]);

  // Handle Resume Upload & Analyze
  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF resumes are supported');
      return;
    }

    setResumeFile(file);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      setUploading(true);
      toast.info('Parsing resume and triggering Gemini audit...');
      const res = await api.post('/ai/analyze-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(res.data);
      toast.success('Resume analyzed successfully!');
      fetchDashboardData(); // Refresh apps/averages
    } catch (err) {
      toast.error(err.response?.data?.message || 'Resume analysis failed');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // Run Job Match Analysis
  const handleJobMatch = async () => {
    if (!jobDescription) {
      toast.error('Please enter a job description to match');
      return;
    }
    if (!analysis) {
      toast.error('Please upload your resume first before running ATS match');
      return;
    }

    try {
      setMatching(true);
      toast.info('Running ATS match scoring via Gemini...');
      
      const res = await api.post('/ai/check-ats', {
        resumeText: analysis.summary,
        jobDescription,
      });
      
      setMatchResult(res.data);
      toast.success('ATS job compatibility calculated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'ATS match check failed');
    } finally {
      setMatching(false);
    }
  };

  // Generate Cover Letter
  const handleGenerateCoverLetter = async () => {
    if (!jobDescription) {
      toast.error('Please enter the target Job Description first');
      return;
    }

    try {
      setGeneratingCL(true);
      const res = await api.post('/ai/generate-cover-letter', { jobDescription });
      setCoverLetter(res.data.coverLetter);
      toast.success('Cover letter generated!');
    } catch (err) {
      toast.error('Cover letter generation failed');
    } finally {
      setGeneratingCL(false);
    }
  };

  // Generate Interview Questions
  const handleGenerateInterviewPrep = async () => {
    if (!jobDescription) {
      toast.error('Please enter the target Job Description first');
      return;
    }

    try {
      setGeneratingPrep(true);
      const res = await api.post('/ai/interview-prep', { jobDescription });
      setPrepQuestions(res.data.questions);
      toast.success('Interview questions generated!');
    } catch (err) {
      toast.error('Interview questions generation failed');
    } finally {
      setGeneratingPrep(false);
    }
  };

  // Mark notification as read
  const handleMarkRead = async (id) => {
    try {
      await api.put(`/users/notifications/${id}`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-violet-glow" />
          <span className="text-sm text-muted-foreground">Syncing dashboard data...</span>
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
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-violet-glow font-medium">Candidate Dashboard</div>
            <h1 className="text-3xl font-bold mt-1">Hello, <span className="text-gradient">{user.name}</span></h1>
            <p className="text-sm text-muted-foreground mt-1">Track applications, run resume optimizations, and prep for interview panels.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="glass-strong px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
              <Bell className="h-4 w-4 text-violet-glow" />
              <span className="text-xs font-semibold text-white">{notifications.filter(n => !n.isRead).length} Alerts</span>
            </div>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl glass-strong border border-white/5 p-6 relative overflow-hidden">
            <div className="absolute right-4 top-4 h-8 w-8 rounded-full bg-violet/10 flex items-center justify-center text-violet-glow">
              <Briefcase className="h-4 w-4" />
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Jobs Applied</div>
            <div className="text-3xl font-bold mt-2">{metrics?.applicationsCount || 0}</div>
            <div className="text-[10px] text-emerald-400 mt-1">Active Pipelines</div>
          </div>

          <div className="rounded-2xl glass-strong border border-white/5 p-6 relative overflow-hidden">
            <div className="absolute right-4 top-4 h-8 w-8 rounded-full bg-violet/10 flex items-center justify-center text-violet-glow">
              <Calendar className="h-4 w-4" />
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Interviews Scheduled</div>
            <div className="text-3xl font-bold mt-2">{metrics?.interviewsCount || 0}</div>
            <div className="text-[10px] text-violet-glow mt-1">Live invites awaiting</div>
          </div>

          <div className="rounded-2xl glass-strong border border-white/5 p-6 relative overflow-hidden">
            <div className="absolute right-4 top-4 h-8 w-8 rounded-full bg-violet/10 flex items-center justify-center text-violet-glow">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Average ATS Score</div>
            <div className="text-3xl font-bold mt-2">{analysis?.atsScore || metrics?.averageAtsScore || 0}%</div>
            <div className="text-[10px] text-emerald-400 mt-1">AI calculated average</div>
          </div>
        </div>

        {/* Main Interface Columns */}
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
          
          {/* Column Left: Resume Upload and Matcher */}
          <div className="space-y-8">
            
            {/* Uploader Card */}
            <div className="rounded-2xl glass-strong border border-white/10 p-6 relative">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-violet-glow" /> AI Resume Audit
              </h2>
              
              {!analysis ? (
                <div className="border border-dashed border-white/10 rounded-xl p-8 text-center flex flex-col items-center gap-4 bg-white/[0.01] hover:bg-white/[0.02] transition-colors relative">
                  <UploadCloud className="h-12 w-12 text-muted-foreground animate-pulse" />
                  <div>
                    <h3 className="font-semibold text-white">Upload your PDF Resume</h3>
                    <p className="text-xs text-muted-foreground mt-1">Gemini will extract skills, analyze ATS compliance, and suggest rewrites.</p>
                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleResumeChange}
                    disabled={uploading}
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-background/80 rounded-xl flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-violet-glow" />
                      <span className="text-xs text-white">Analyzing resume...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <UserCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-white">{resumeFile?.name || 'Parsed Profile'}</div>
                        <div className="text-xs text-muted-foreground">ATS Audit Complete</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setAnalysis(null)} 
                      className="text-xs text-red-400 hover:underline cursor-pointer"
                    >
                      Reset File
                    </button>
                  </div>

                  {/* Summary */}
                  <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl text-sm">
                    <h3 className="font-semibold text-white mb-2">Executive Summary</h3>
                    <p className="text-muted-foreground leading-relaxed">{analysis.summary}</p>
                  </div>

                  {/* Strengths / Weaknesses */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-emerald-500/[0.02] border border-emerald-500/10 p-4 rounded-xl">
                      <h4 className="text-xs uppercase font-semibold text-emerald-400 tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" /> Key Strengths
                      </h4>
                      <ul className="space-y-1.5 text-xs text-muted-foreground">
                        {analysis.strengths?.map((s, idx) => <li key={idx} className="flex items-start gap-1">• {s}</li>)}
                      </ul>
                    </div>

                    <div className="bg-amber-500/[0.02] border border-amber-500/10 p-4 rounded-xl">
                      <h4 className="text-xs uppercase font-semibold text-amber-400 tracking-wider mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4" /> Focus Areas
                      </h4>
                      <ul className="space-y-1.5 text-xs text-muted-foreground">
                        {analysis.weaknesses?.map((w, idx) => <li key={idx} className="flex items-start gap-1">• {w}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* Keyword Enhancements */}
                  <div className="bg-violet-glow/[0.02] border border-violet-glow/10 p-4 rounded-xl">
                    <h4 className="text-xs uppercase font-semibold text-violet-glow tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4" /> Suggested Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.optimizedKeywords?.map((kw, idx) => (
                        <span key={idx} className="px-2.5 py-1 text-xs rounded-lg bg-white/5 border border-white/10 text-white font-medium">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ATS Matcher Panel */}
            <div className="rounded-2xl glass-strong border border-white/10 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-glow" /> Job Description Matcher
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Paste a target job posting description to analyze alignment, compute matching percentage, and generate custom tools.
              </p>
              
              <textarea
                className="w-full h-40 p-4 rounded-xl bg-white/[0.02] border border-white/10 text-foreground placeholder-white/20 focus:outline-none focus:border-violet-glow transition-all text-sm mb-4 resize-none"
                placeholder="Paste Job Description / Requirements here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleJobMatch}
                  disabled={matching || !analysis}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-violet to-violet-glow text-white font-medium text-xs shadow-lg glow-violet hover:scale-[1.02] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
                >
                  {matching ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Run ATS Match'}
                </button>
                <button
                  onClick={handleGenerateCoverLetter}
                  disabled={generatingCL || !analysis || !jobDescription}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium text-xs transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
                >
                  {generatingCL ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Create Cover Letter'}
                </button>
                <button
                  onClick={handleGenerateInterviewPrep}
                  disabled={generatingPrep || !analysis || !jobDescription}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium text-xs transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
                >
                  {generatingPrep ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Create Interview Prep'}
                </button>
                <button
                  onClick={handleGenerateCareerAdvice}
                  disabled={generatingAdvice || !analysis}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium text-xs transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
                >
                  {generatingAdvice ? <Loader2 className="h-3 w-3 animate-spin" /> : 'AI Career Advice'}
                </button>
              </div>

              {/* ATS Match Result Output */}
              {matchResult && (
                <div className="mt-6 bg-white/5 border border-white/10 p-5 rounded-xl text-sm space-y-4">
                  <h3 className="font-semibold text-white flex items-center justify-between">
                    ATS Match Analysis
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet/20 text-violet-glow border border-violet/30">
                      Overall Match: {matchResult.matchPercentage || matchResult.atsScore || 0}%
                    </span>
                  </h3>
                  
                  <div className="text-xs text-muted-foreground bg-black/25 p-3 rounded-lg leading-relaxed">
                    <strong>AI Compatibility Fit:</strong> {matchResult.fitSummary}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Matching & Missing Skills */}
                    <div className="bg-emerald-500/[0.02] border border-emerald-500/10 p-3 rounded-lg">
                      <div className="text-[10px] uppercase font-semibold text-emerald-400 mb-1.5">Matching Skills</div>
                      <div className="flex flex-wrap gap-1">
                        {matchResult.skillMatch && matchResult.skillMatch.length > 0 ? (
                          matchResult.skillMatch.map((s, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-muted-foreground">None identified</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-red-500/[0.02] border border-red-500/10 p-3 rounded-lg">
                      <div className="text-[10px] uppercase font-semibold text-red-400 mb-1.5">Missing Skills (Gap Analysis)</div>
                      <div className="flex flex-wrap gap-1">
                        {matchResult.skillGaps && matchResult.skillGaps.length > 0 ? (
                          matchResult.skillGaps.map((s, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400 border border-red-500/10">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-muted-foreground">None identified</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Experience & Education Match */}
                  <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                      <div className="text-muted-foreground">Experience Match</div>
                      <div className="font-semibold text-white mt-1">Level: {matchResult.experienceLevel || 'N/A'} ({matchResult.yearsOfExperience || 'N/A'})</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                      <div className="text-muted-foreground">Education Match</div>
                      <div className="font-semibold text-white mt-1">{matchResult.education || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses (Skill Insights) */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-lg">
                      <div className="text-[10px] uppercase font-semibold text-white mb-1.5">Key Strengths</div>
                      <ul className="space-y-1 text-[11px] text-muted-foreground list-disc pl-3">
                        {matchResult.technicalSkills && matchResult.technicalSkills.slice(0, 3).map((s, i) => <li key={i}>Proficient in {s}</li>)}
                        {matchResult.projects && matchResult.projects.slice(0, 2).map((p, i) => <li key={i}>Hands-on project: {p}</li>)}
                      </ul>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-lg">
                      <div className="text-[10px] uppercase font-semibold text-white mb-1.5">Suggested Learning Path</div>
                      <ul className="space-y-1 text-[11px] text-muted-foreground list-disc pl-3">
                        {matchResult.suggestions && matchResult.suggestions.length > 0 ? (
                          matchResult.suggestions.map((s, i) => <li key={i}>{s}</li>)
                        ) : (
                          <li>Focus on bridging the missing skills listed above.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Cover Letter Output */}
              {coverLetter && (
                <div className="mt-6 bg-white/5 border border-white/10 p-5 rounded-xl text-sm relative">
                  <h3 className="font-semibold text-white mb-2 flex items-center justify-between">
                    Generated Cover Letter
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(coverLetter);
                        toast.success('Copied to clipboard');
                      }}
                      className="text-xs text-violet-glow hover:underline cursor-pointer"
                    >
                      Copy Text
                    </button>
                  </h3>
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed bg-black/25 p-3 rounded-lg max-h-60 overflow-y-auto">
                    {coverLetter}
                  </pre>
                </div>
              )}

              {/* Career Advice Output */}
              {careerAdvice && (
                <div className="mt-6 bg-white/5 border border-white/10 p-5 rounded-xl text-sm relative">
                  <h3 className="font-semibold text-white mb-2 flex items-center justify-between">
                    AI Career Advice
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(careerAdvice);
                        toast.success('Copied to clipboard');
                      }}
                      className="text-xs text-violet-glow hover:underline cursor-pointer"
                    >
                      Copy Text
                    </button>
                  </h3>
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed bg-black/25 p-3 rounded-lg max-h-60 overflow-y-auto font-sans">
                    {careerAdvice}
                  </pre>
                </div>
              )}

              {/* Interview Prep Questions */}
              {prepQuestions.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold text-white flex items-center gap-1.5 text-sm">
                    <BookOpen className="h-4 w-4 text-violet-glow" /> Recommended Interview Prep
                  </h3>
                  <div className="space-y-3">
                    {prepQuestions.map((q, i) => (
                      <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl text-xs space-y-2">
                        <div className="font-semibold text-white">Q{i+1}: {q.question}</div>
                        <div className="text-muted-foreground pl-3 border-l border-violet-glow/40 leading-relaxed">
                          <strong>Response Guidance:</strong> {q.suggestedAnswer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Explore Open Jobs */}
            <div className="rounded-2xl glass-strong border border-white/10 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-violet-glow" /> Explore Open Roles
              </h2>
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {openJobs.length > 0 ? (
                  openJobs.map((job) => (
                    <div key={job._id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="font-semibold text-sm text-white">{job.title}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{job.location} · {job.type}</div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setShowApplyModal(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-br from-violet to-violet-glow text-white text-xs font-semibold shadow hover:scale-[1.02] transition-transform cursor-pointer"
                      >
                        Apply Now
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-6">No open job listings currently.</p>
                )}
              </div>
            </div>

          </div>

          {/* Column Right: Pipelines, Schedules, Alerts */}
          <div className="space-y-8">
            
            {/* Pipelines (My Applications) */}
            <div className="rounded-2xl glass-strong border border-white/10 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-violet-glow" /> My Applications
              </h2>
              
              <div className="space-y-4">
                {metrics?.recentApplications && metrics.recentApplications.length > 0 ? (
                  metrics.recentApplications.map((app) => (
                    <div key={app._id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="font-semibold text-sm text-white">{app.job?.title || 'Unknown Role'}</div>
                        <div className="text-[10px] text-muted-foreground">{app.job?.location || 'Remote'} · {app.job?.type}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-semibold text-emerald-400">{app.atsScore}% Match</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-violet/20 text-violet-glow border border-violet/30">
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">No active applications currently.</p>
                )}
              </div>
            </div>

            {/* Interviews Scheduled */}
            <div className="rounded-2xl glass-strong border border-white/10 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-violet-glow" /> Scheduled Panels
              </h2>

              <div className="space-y-4">
                {interviews.length > 0 ? (
                  interviews.map((meet) => (
                    <div key={meet._id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-sm text-white">{meet.job?.title || 'Job Interview'}</div>
                          <div className="text-[10px] text-muted-foreground">Organizer: {meet.recruiter?.name}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {meet.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-muted-foreground bg-black/25 p-2 rounded">
                        <div><strong>Date:</strong> {new Date(meet.dateTime).toLocaleString()}</div>
                        <div><strong>Format:</strong> {meet.type}</div>
                        {meet.link && (
                          <div className="mt-1">
                            <strong>Link:</strong> <a href={meet.link} target="_blank" rel="noreferrer" className="text-violet-glow hover:underline truncate max-w-xs block">{meet.link}</a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">No interviews scheduled yet.</p>
                )}
              </div>
            </div>

            {/* Notifications / Alerts Feed */}
            <div className="rounded-2xl glass-strong border border-white/10 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5 text-violet-glow" /> System Alerts
              </h2>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n._id} 
                      onClick={() => !n.isRead && handleMarkRead(n._id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        n.isRead 
                          ? 'bg-white/[0.01] border-white/5 opacity-60' 
                          : 'bg-white/5 border-violet-glow/20 hover:border-violet-glow/40'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="font-semibold text-white">{n.title}</div>
                        <span className="text-[9px] text-muted-foreground">{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">No notifications present.</p>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* APPLY JOB MODAL */}
      <AnimatePresence>
        {showApplyModal && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md glass-strong border border-white/10 rounded-2xl p-6 shadow-2xl relative"
            >
              <button onClick={() => setShowApplyModal(false)} className="absolute right-4 top-4 text-white/40 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-xl font-bold mb-4 text-gradient">Apply for {selectedJob.title}</h2>
              <p className="text-xs text-muted-foreground mb-4">
                Recruiter: <span className="text-white">{selectedJob.recruiter?.name || 'Recruitment Team'}</span>
              </p>

              <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-muted-foreground mb-1.5 font-semibold">Upload PDF Resume</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    required
                    onChange={(e) => setApplyResume(e.target.files[0])}
                    className="w-full text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-violet/20 file:text-violet-glow hover:file:bg-violet/30 file:cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1.5 font-semibold">Cover Letter / Note (Optional)</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none resize-none"
                    placeholder="Introduce yourself to the recruiter..."
                    value={applyCoverLetter}
                    onChange={e => setApplyCoverLetter(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={applying}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-br from-violet to-violet-glow text-white font-medium shadow-lg glow-violet hover:scale-[1.02] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {applying ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Submit Application'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
