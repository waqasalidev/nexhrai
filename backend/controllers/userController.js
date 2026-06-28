import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Notification from '../models/Notification.js';
import AIHistory from '../models/AIHistory.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const { name, bio, skills, title, profileImage } = req.body;
      
      user.name = name || user.name;
      user.bio = bio || user.bio;
      user.title = title || user.title;
      user.profileImage = profileImage || user.profileImage;
      
      if (skills) {
        user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        title: updatedUser.title,
        profileImage: updatedUser.profileImage,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard metrics
// @route   GET /api/users/dashboard
// @access  Private
export const getDashboardMetrics = async (req, res) => {
  try {
    const role = req.user.role;

    if (role === 'candidate') {
      const applicationsCount = await Application.countDocuments({ candidate: req.user._id });
      const interviewsCount = await Interview.countDocuments({ candidate: req.user._id, status: 'Scheduled' });
      
      // Calculate average ATS Score
      const apps = await Application.find({ candidate: req.user._id });
      const avgAts = apps.length > 0 
        ? Math.round(apps.reduce((acc, curr) => acc + curr.atsScore, 0) / apps.length)
        : 0;

      // Find recently applied jobs
      const recentApps = await Application.find({ candidate: req.user._id })
        .populate('job', 'title location type')
        .sort({ createdAt: -1 })
        .limit(5);

      res.json({
        applicationsCount,
        interviewsCount,
        averageAtsScore: avgAts,
        recentApplications: recentApps,
      });
    } else if (role === 'recruiter') {
      const jobsCount = await Job.countDocuments({ recruiter: req.user._id });
      
      const jobs = await Job.find({ recruiter: req.user._id });
      const jobIds = jobs.map(j => j._id);
      
      const applicationsCount = await Application.countDocuments({ job: { $in: jobIds } });
      const interviewsCount = await Interview.countDocuments({ recruiter: req.user._id, status: 'Scheduled' });
      
      // Calculate recruiter's average ATS score
      const apps = await Application.find({ job: { $in: jobIds } });
      const avgAts = apps.length > 0
        ? Math.round(apps.reduce((acc, curr) => acc + curr.atsScore, 0) / apps.length)
        : 0;

      // Recent applicant activity
      const recentApplicants = await Application.find({ job: { $in: jobIds } })
        .populate('candidate', 'name email title')
        .populate('job', 'title')
        .sort({ createdAt: -1 })
        .limit(5);

      res.json({
        jobsCount,
        applicationsCount,
        interviewsCount,
        averageAtsScore: avgAts,
        recentApplicants,
      });
    } else if (role === 'admin') {
      const totalUsers = await User.countDocuments();
      const candidatesCount = await User.countDocuments({ role: 'candidate' });
      const recruitersCount = await User.countDocuments({ role: 'recruiter' });
      const totalJobs = await Job.countDocuments();
      const totalApplications = await Application.countDocuments();
      
      // Aggregate AI requests
      const aiUsageCount = await AIHistory.countDocuments();
      const usageLogs = await AIHistory.find()
        .populate('user', 'name role')
        .sort({ createdAt: -1 })
        .limit(10);

      res.json({
        totalUsers,
        candidatesCount,
        recruitersCount,
        totalJobs,
        totalApplications,
        aiUsageCount,
        recentAIUsage: usageLogs,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:id
// @access  Private
export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this notification' });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
