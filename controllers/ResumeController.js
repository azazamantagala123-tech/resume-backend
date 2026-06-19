import Resume from '../models/Resume.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const createResume = catchAsync(async (req, res, next) => {
  const { email, resumeTitle, templateName, targetJobRole, isFresher, personalInfo, skills, experience, education, projects } = req.body;
  
  if (!email) {
    return next(new AppError('Email is required to create a resume', 400));
  }
  
  const newResume = await Resume.create({
    email,
    resumeTitle: resumeTitle || 'My Resume',
    templateName: templateName || 'Modern',
    targetJobRole: targetJobRole || '',
    isFresher: isFresher || false,
    personalInfo: personalInfo || {},
    skills: skills || [],
    experience: experience || [],
    education: education || [],
    projects: projects || []
  });
  
  res.status(201).json({
    success: true,
    message: 'Resume created successfully!',
    data: newResume
  });
});

export const getUserResumes = catchAsync(async (req, res, next) => {
  const { email } = req.params;
  
  if (!email) {
    return next(new AppError('Email is required', 400));
  }
  
  const resumes = await Resume.find({ email }).sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: resumes.length,
    data: resumes
  });
});

export const getResumeById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const resume = await Resume.findById(id);
  
  if (!resume) {
    return next(new AppError('Resume not found', 404));
  }
  
  res.json({
    success: true,
    data: resume
  });
});

export const updateResume = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { email, ...updateData } = req.body;
  
  const resume = await Resume.findById(id);
  
  if (!resume) {
    return next(new AppError('Resume not found', 404));
  }
  
  const updatedResume = await Resume.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );
  
  res.json({
    success: true,
    message: 'Resume updated successfully!',
    data: updatedResume
  });
});

export const deleteResume = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const resume = await Resume.findByIdAndDelete(id);
  
  if (!resume) {
    return next(new AppError('Resume not found', 404));
  }
  
  res.json({
    success: true,
    message: 'Resume deleted successfully!'
  });
});

export const generateSummary = catchAsync(async (req, res, next) => {
  const { targetJobRole, isFresher } = req.body;

  if (!targetJobRole) {
    return next(new AppError("Target job role is required", 400));
  }

  const summary = generateSmartSummary(targetJobRole, isFresher);
  
  res.json({
    success: true,
    summary: summary
  });
});

function generateSmartSummary(targetJobRole, isFresher) {
  const role = targetJobRole.toLowerCase();
  
  let skills = [];
  let traits = [];
  let achievements = [];
  
  if (role.includes('developer') || role.includes('engineer')) {
    skills = ['full-stack development', 'API integration', 'database management', 'cloud deployment'];
    traits = ['analytical', 'detail-oriented', 'problem-solver'];
    achievements = ['optimized application performance', 'reduced load times by 40%', 'implemented CI/CD pipelines'];
  } else if (role.includes('designer') || role.includes('ui') || role.includes('ux')) {
    skills = ['user research', 'prototyping', 'wireframing', 'design systems'];
    traits = ['creative', 'empathetic', 'visual thinker'];
    achievements = ['increased user engagement', 'redesigned core features', 'created design libraries'];
  } else if (role.includes('data')) {
    skills = ['data analysis', 'statistical modeling', 'data visualization', 'SQL'];
    traits = ['analytical', 'methodical', 'detail-oriented'];
    achievements = ['improved data accuracy', 'automated reporting', 'identified key insights'];
  } else if (role.includes('marketing')) {
    skills = ['campaign management', 'content strategy', 'SEO/SEM', 'social media'];
    traits = ['creative', 'strategic', 'results-driven'];
    achievements = ['increased engagement by 50%', 'managed $100k+ budgets', 'grew social following'];
  } else if (role.includes('sales')) {
    skills = ['negotiation', 'client relations', 'lead generation', 'CRM management'];
    traits = ['persuasive', 'resilient', 'goal-oriented'];
    achievements = ['exceeded quotas by 30%', 'closed major accounts', 'expanded territory'];
  } else if (role.includes('project')) {
    skills = ['agile methodology', 'risk management', 'stakeholder communication', 'budgeting'];
    traits = ['organized', 'leadership', 'adaptable'];
    achievements = ['delivered projects on time', 'reduced costs by 25%', 'led cross-functional teams'];
  } else {
    skills = ['communication', 'team collaboration', 'time management', 'critical thinking'];
    traits = ['dedicated', 'proactive', 'reliable'];
    achievements = ['improved team efficiency', 'recognized for excellence', 'implemented new processes'];
  }
  
  const randomSkills = skills.slice(0, 3).join(', ');
  const randomTraits = traits.slice(0, 2).join(' and ');
  const randomAchievement = achievements[Math.floor(Math.random() * achievements.length)];
  
  const templates = [
    `Results-driven ${isFresher ? 'emerging talent' : 'professional'} with strong foundation in ${targetJobRole}. Expertise in ${randomSkills}. Known for being ${randomTraits} with proven track record of ${randomAchievement}. ${isFresher ? 'Eager to apply academic knowledge and fresh perspectives' : 'Consistently delivers high-quality results'} in fast-paced environments. Ready to contribute immediately and drive organizational success.`,
    `Dedicated ${isFresher ? 'individual' : 'practitioner'} specializing in ${targetJobRole}. Demonstrates proficiency in ${randomSkills}. Brings ${randomTraits} approach to work. ${isFresher ? 'Quick learner with strong foundational knowledge and project experience' : `Successfully ${randomAchievement.toLowerCase()} while maintaining high standards`}. Committed to excellence and continuous professional growth.`,
    `Strategic ${isFresher ? 'thinker' : 'leader'} with expertise in ${targetJobRole}. Mastery of ${randomSkills} delivers exceptional results. Natural ${randomTraits} abilities drive success. ${isFresher ? 'Award-winning academic background with practical experience' : `Proven ability to ${randomAchievement.toLowerCase()}`}. Ready to bring value and innovation to forward-thinking teams.`,
    `Ambitious ${isFresher ? 'learner' : 'executor'} focused on ${targetJobRole}. Proficient in ${randomSkills}. Combines ${randomTraits} qualities with strong work ethic. ${isFresher ? 'Internship and project experience prepared for real challenges' : `History of ${randomAchievement.toLowerCase()}`}. Eager to leverage skills for mutual growth and organizational success.`,
    `Enthusiastic ${isFresher ? 'candidate' : 'expert'} passionate about ${targetJobRole}. Strong capabilities in ${randomSkills}. Recognized for ${randomTraits} mindset. ${isFresher ? 'Academic projects demonstrate practical application of skills' : `Achieved ${randomAchievement.toLowerCase()} through dedication and expertise`}. Seeking opportunities to make meaningful contributions and excel professionally.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}