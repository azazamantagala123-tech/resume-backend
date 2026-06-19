import mongoose from 'mongoose';

const resumeSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  resumeTitle: {
    type: String,
    default: 'My Resume'
  },
  templateName: {
    type: String,
    default: "Modern"
  },
  targetJobRole: {
    type: String,
    default: ''
  },
  isFresher: {
    type: Boolean,
    default: false
  },
  personalInfo: {
    fullName: String,
    phone: String,
    city: String,
    state: String,
    linkedInUrl: String,
    githubUrl: String,
    summary: String
  },
  skills: [String],
  experience: [{
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    isCurrentJob: Boolean,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    startDate: String,
    endDate: String
  }],
  projects: [{
    title: String,
    link: String,
    description: String
  }]
}, { timestamps: true });

const Resume = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);

export default Resume;