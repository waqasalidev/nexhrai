import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumePath: {
      type: String,
      required: [true, 'Please upload a resume for the application'],
    },
    atsScore: {
      type: Number,
      default: 0,
    },
    matchPercentage: {
      type: Number,
      default: 0,
    },
    analysis: {
      fitSummary: { type: String, default: '' },
      skillMatch: { type: [String], default: [] },
      skillGaps: { type: [String], default: [] },
      suggestions: { type: [String], default: [] },
      experienceLevel: { type: String, default: '' },
      yearsOfExperience: { type: String, default: '' },
      education: { type: String, default: '' },
      certifications: { type: [String], default: [] },
      projects: { type: [String], default: [] },
      technicalSkills: { type: [String], default: [] },
      softSkills: { type: [String], default: [] },
      recommendation: { type: String, default: 'Average Match' }, // Highly Recommended, Recommended, Average Match, Not Recommended
    },
    status: {
      type: String,
      enum: ['Applied', 'Screened', 'Interviewing', 'Offered', 'Rejected'],
      default: 'Applied',
    },
    coverLetter: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;
