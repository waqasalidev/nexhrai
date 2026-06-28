import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import { sendInterviewInvitation } from '../services/emailService.js';

// @desc    Schedule a new interview
// @route   POST /api/interviews
// @access  Private/Recruiter/Admin
export const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, dateTime, type, link, notes } = req.body;

    if (!applicationId || !dateTime) {
      return res.status(400).json({ message: 'Please provide applicationId and dateTime' });
    }

    const application = await Application.findById(applicationId)
      .populate('job')
      .populate('candidate');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify job belongs to recruiter
    if (application.job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to schedule interview for this job' });
    }

    // Create Interview
    const interview = await Interview.create({
      application: applicationId,
      candidate: application.candidate._id,
      recruiter: req.user._id,
      job: application.job._id,
      dateTime,
      type: type || 'Virtual',
      link: link || '',
      notes: notes || '',
    });

    // Update Application Status
    application.status = 'Interviewing';
    await application.save();

    // Create Notifications
    await Notification.create({
      user: application.candidate._id,
      title: 'Interview Scheduled',
      message: `An interview has been scheduled for "${application.job.title}" on ${new Date(dateTime).toLocaleString()}`,
      type: 'interview',
    });

    // Send email to candidate (non-blocking)
    sendInterviewInvitation(application.candidate, req.user, application.job, interview)
      .catch(err => console.error(`Failed to send interview invitation email: ${err.message}`));

    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get interviews
// @route   GET /api/interviews
// @access  Private
export const getInterviews = async (req, res) => {
  try {
    let interviews;

    if (req.user.role === 'candidate') {
      interviews = await Interview.find({ candidate: req.user._id })
        .populate('job', 'title location')
        .populate('recruiter', 'name email');
    } else if (req.user.role === 'recruiter') {
      interviews = await Interview.find({ recruiter: req.user._id })
        .populate('job', 'title location')
        .populate('candidate', 'name email');
    } else if (req.user.role === 'admin') {
      interviews = await Interview.find()
        .populate('job', 'title location')
        .populate('candidate', 'name email')
        .populate('recruiter', 'name email');
    }

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update interview status
// @route   PUT /api/interviews/:id
// @access  Private/Recruiter/Admin
export const updateInterview = async (req, res) => {
  try {
    const { status, dateTime, link, notes } = req.body;
    const interview = await Interview.findById(req.params.id)
      .populate('job', 'title')
      .populate('candidate', 'name email');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Verify recruiter
    if (interview.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to modify this interview' });
    }

    interview.status = status || interview.status;
    interview.dateTime = dateTime || interview.dateTime;
    interview.link = link !== undefined ? link : interview.link;
    interview.notes = notes !== undefined ? notes : interview.notes;

    const updatedInterview = await interview.save();

    // Notify candidate
    await Notification.create({
      user: interview.candidate._id,
      title: 'Interview Details Updated',
      message: `The interview for "${interview.job.title}" has been updated. Status: ${interview.status}`,
      type: 'interview',
    });

    res.json(updatedInterview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
