export function cleanJSON(text: string): string {
  let cleaned = text.trim();
  
  const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (jsonMatch) {
    cleaned = jsonMatch[1];
  }
  
  cleaned = cleaned.replace(/```json\s*/gi, '').replace(/```\s*/gi, '');
  cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
  cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
  
  return cleaned;
}

export function extractJSON(text: string): unknown {
  try {
    const cleaned = cleanJSON(text);
    return JSON.parse(cleaned);
  } catch {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(cleanJSON(jsonMatch[1]));
      } catch {}
    }
    
    const bracketMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (bracketMatch) {
      try {
        return JSON.parse(cleanJSON(bracketMatch[1]));
      } catch {}
    }
  }
  throw new Error("No valid JSON found");
}

const HEBREW_REGEX = /[\u0590-\u05FF]/;

export function isHebrewDominant(text: string): boolean {
  if (!text || text.length === 0) return false;
  const hebrewChars = (text.match(HEBREW_REGEX) || []).length;
  return hebrewChars > text.length * 0.4;
}

export function isComprehensible(text: string): boolean {
  if (!text || text.length < 3) return false;
  
  const hebrewCount = (text.match(HEBREW_REGEX) || []).length;
  if (hebrewCount > text.length * 0.3) return false;
  
  const hasLetters = /[a-zA-Z]/.test(text);
  const hasNumbers = /[0-9]/.test(text);
  const isGibberish = /^[^a-zA-Z]*$/.test(text);
  
  if (!hasLetters && !hasNumbers) return false;
  if (isGibberish) return false;
  
  const words = text.split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return false;
  
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
  if (avgWordLength < 1.5 && words.length > 3) return false;
  
  return true;
}

// Real career goals validation
const REAL_CAREERS = [
  "software engineer", "machine learning engineer", "data scientist", "frontend developer",
  "backend developer", "full stack developer", "devops engineer", "cloud engineer",
  "cybersecurity analyst", "mobile developer", "ios developer", "android developer",
  "ux designer", "ui designer", "product manager", "data engineer", "ai engineer",
  "research scientist", "software developer", "web developer", "systems engineer",
  "network engineer", "database administrator", "security engineer", "site reliability engineer",
  "computer vision engineer", "nlp engineer", "quantitative analyst", "financial engineer",
  "biomedical engineer", "robotics engineer", "electrical engineer", "mechanical engineer",
  "civil engineer", "chemical engineer", " aerospace engineer", "automotive engineer",
  "consultant", "analyst", "architect", "researcher", "professor", "teacher",
  "doctor", "lawyer", "accountant", "marketer", "entrepreneur"
];

const FAKE_INDICATORS = [
  "asdf", "qwerty", "zxcv", "jkl;", "fakepath", "fake name", "test test",
  "asdfgh", "qwertyuiop", "zxcvbnm", "hjkl", "aaaa", "bbbb", "cccc",
  "xxx", "yyy", "zzz", "n/a", "na", "none", "nothing", "idk", "idc",
  "whatever", "asdasd", "qweqwe", "zxczxc", "111", "222", "333"
];

const REAL_SKILLS = [
  "python", "java", "javascript", "typescript", "c++", "c#", "ruby", "go", "rust",
  "swift", "kotlin", "scala", "r", "matlab", "sql", "html", "css", "react",
  "angular", "vue", "node", "django", "flask", "spring", "tensorflow", "pytorch",
  "keras", "scikit", "pandas", "numpy", "spark", "hadoop", "aws", "azure", "gcp",
  "docker", "kubernetes", "git", "linux", "bash", "powershell", "mongodb", "postgres",
  "mysql", "redis", "elasticsearch", "kafka", "graphql", "rest", "api",
  "machine learning", "deep learning", "nlp", "computer vision", "neural network",
  "data analysis", "data visualization", "statistics", "linear algebra", "calculus",
  "algorithm", "data structure", "agile", "scrum", "jira", "communication",
  "leadership", "problem solving", "teamwork", "project management"
];

export interface ValidationResult {
  isValid: boolean;
  field: string;
  message: string;
  emoji: string;
}

export function validateCareerGoal(careerGoal: string): ValidationResult {
  const lower = careerGoal.toLowerCase().trim();
  
  if (lower.length < 5) {
    return { isValid: false, field: "careerGoal", message: "Career goal is too short. Please provide a real career objective.", emoji: "😤" };
  }
  
  // Check for fake indicators
  for (const fake of FAKE_INDICATORS) {
    if (lower.includes(fake)) {
      return { isValid: false, field: "careerGoal", message: "Please enter a REAL career goal, not fake data like '" + careerGoal + "'", emoji: "😠" };
    }
  }
  
  // Check if it's gibberish (repeated chars)
  if (/(.)\1{3,}/.test(lower)) {
    return { isValid: false, field: "careerGoal", message: "That doesn't look like a real career goal. Please be serious!", emoji: "🤨" };
  }
  
  // Check minimum meaningful words
  const words = lower.split(/\s+/).filter(w => w.length >= 2);
  if (words.length < 2) {
    return { isValid: false, field: "careerGoal", message: "Please provide a more detailed career goal.", emoji: "😤" };
  }
  
  // Check if it matches any real career pattern
  const matchesRealCareer = REAL_CAREERS.some(career => lower.includes(career));
  if (!matchesRealCareer) {
    return { isValid: false, field: "careerGoal", message: "Please enter a recognized career like 'Software Engineer', 'Data Scientist', 'Machine Learning Engineer', etc.", emoji: "🎯" };
  }
  
  return { isValid: true, field: "", message: "", emoji: "" };
}

export function validateSkills(skills: string): ValidationResult {
  const lower = skills.toLowerCase().trim();
  
  if (lower.length < 3) {
    return { isValid: false, field: "currentSkills", message: "Please list your actual skills.", emoji: "😤" };
  }
  
  // Check for fake indicators
  for (const fake of FAKE_INDICATORS) {
    if (lower.includes(fake)) {
      return { isValid: false, field: "currentSkills", message: "Please list your REAL skills, not fake data!", emoji: "😠" };
    }
  }
  
  // Check if it contains any real skills
  const hasRealSkill = REAL_SKILLS.some(skill => lower.includes(skill));
  if (!hasRealSkill) {
    return { isValid: false, field: "currentSkills", message: "Please list real technical skills like 'Python', 'JavaScript', 'Machine Learning', etc.", emoji: "💻" };
  }
  
  // Check for gibberish
  if (/(.)\1{3,}/.test(lower)) {
    return { isValid: false, field: "currentSkills", message: "That doesn't look like real skills. Please be serious!", emoji: "🤨" };
  }
  
  return { isValid: true, field: "", message: "", emoji: "" };
}

export function validateInterests(interests: string): ValidationResult {
  const lower = interests.toLowerCase().trim();
  
  if (lower.length < 3) {
    return { isValid: false, field: "interests", message: "Please share your real interests.", emoji: "😤" };
  }
  
  // Check for fake indicators
  for (const fake of FAKE_INDICATORS) {
    if (lower.includes(fake)) {
      return { isValid: false, field: "interests", message: "Please share your REAL interests!", emoji: "😠" };
    }
  }
  
  // Check for gibberish
  if (/(.)\1{3,}/.test(lower)) {
    return { isValid: false, field: "interests", message: "That's not a real interest. Please be honest!", emoji: "🤨" };
  }
  
  // At least 2 meaningful words
  const words = lower.split(/\s+/).filter(w => w.length >= 2);
  if (words.length < 2) {
    return { isValid: false, field: "interests", message: "Please provide more specific interests.", emoji: "🎯" };
  }
  
  return { isValid: true, field: "", message: "", emoji: "" };
}

export function validateGPA(gpa: number): ValidationResult {
  if (isNaN(gpa) || gpa < 0 || gpa > 4) {
    return { isValid: false, field: "gpa", message: "Please enter a valid GPA between 0 and 4.0", emoji: "📊" };
  }
  
  // Check for obviously fake GPAs like 0, 4, or very round numbers
  if (gpa === 0) {
    return { isValid: false, field: "gpa", message: "A GPA of 0? Please enter your real GPA.", emoji: "😤" };
  }
  
  return { isValid: true, field: "", message: "", emoji: "" };
}
