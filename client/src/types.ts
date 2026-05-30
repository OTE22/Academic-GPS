export interface ValidationError {
  field: string;
  message: string;
}

export interface Props {
  errors: ValidationError[];
  onClose: () => void;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface YouTubeResult {
  title: string;
  videoId: string;
  thumbnail: string;
  channel: string;
  duration: string;
  url: string;
}

export interface Roadmap {
  careerGoal: string;
  recommendedCourses: Array<{
    code: string;
    name: string;
    semester: number;
    credits: number;
    rationale: string;
    links: SearchResult[];
    videos: YouTubeResult[];
  }>;
  skillGaps: Array<{
    skill: string;
    currentLevel: string;
    targetLevel: string;
    coursesToFill: string[];
    links: SearchResult[];
    videos: YouTubeResult[];
  }>;
  certifications: Array<{
    name: string;
    provider: string;
    timeline: string;
    priority: number;
    links: SearchResult[];
    videos: YouTubeResult[];
  }>;
  researchOpportunities: Array<{
    title: string;
    professor: string;
    institution: string;
    timeline: string;
    relevance: string;
    links: SearchResult[];
    videos: YouTubeResult[];
  }>;
  internshipTargets: Array<{
    company: string;
    role: string;
    timeline: string;
    requirements: string[];
    links: SearchResult[];
    videos: YouTubeResult[];
  }>;
  semesterRoadmap: Array<{
    semester: number;
    courses: string[];
    activities: string[];
    milestones: string[];
  }>;
  successProbability: number;
}
