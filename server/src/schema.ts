import { z } from "zod";

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return value.split(",").map(s => s.trim()).filter(Boolean);
  if (typeof value === "number") return [String(value)];
  return [];
}

function toNumber(value: unknown): number {
  if (typeof value === "number" && !isNaN(value)) return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) return parsed;
  }
  return 0;
}

const RawRoadmapSchema = z.object({
  careerGoal: z.union([z.string(), z.number()]),
  recommendedCourses: z.union([
    z.array(z.object({
      code: z.union([z.string(), z.number()]),
      name: z.union([z.string(), z.number()]),
      semester: z.union([z.string(), z.number()]),
      credits: z.union([z.string(), z.number()]),
      rationale: z.union([z.string(), z.number()])
    })),
    z.string()
  ]),
  skillGaps: z.union([
    z.array(z.object({
      skill: z.union([z.string(), z.number()]),
      currentLevel: z.union([z.string(), z.number()]),
      targetLevel: z.union([z.string(), z.number()]),
      coursesToFill: z.union([z.array(z.union([z.string(), z.number()])), z.string(), z.number()])
    })),
    z.string()
  ]),
  certifications: z.union([
    z.array(z.object({
      name: z.union([z.string(), z.number()]),
      provider: z.union([z.string(), z.number()]),
      timeline: z.union([z.string(), z.number()]),
      priority: z.union([z.string(), z.number()])
    })),
    z.string()
  ]),
  researchOpportunities: z.union([
    z.array(z.object({
      title: z.union([z.string(), z.number()]),
      professor: z.union([z.string(), z.number()]),
      institution: z.union([z.string(), z.number()]),
      timeline: z.union([z.string(), z.number()]),
      relevance: z.union([z.string(), z.number()])
    })),
    z.string()
  ]),
  internshipTargets: z.union([
    z.array(z.object({
      company: z.union([z.string(), z.number()]),
      role: z.union([z.string(), z.number()]),
      timeline: z.union([z.string(), z.number()]),
      requirements: z.union([z.array(z.union([z.string(), z.number()])), z.string(), z.number()])
    })),
    z.string()
  ]),
  semesterRoadmap: z.union([
    z.array(z.object({
      semester: z.union([z.string(), z.number()]),
      courses: z.union([z.array(z.union([z.string(), z.number()])), z.string(), z.number()]),
      activities: z.union([z.array(z.union([z.string(), z.number()])), z.string(), z.number()]),
      milestones: z.union([z.array(z.union([z.string(), z.number()])), z.string(), z.number()])
    })),
    z.string()
  ]),
  successProbability: z.union([z.string(), z.number()])
});

function normalizeArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(v => String(v));
  if (typeof value === "string") return value.split(",").map(s => s.trim()).filter(Boolean);
  if (typeof value === "number") return [String(value)];
  return [];
}

export function normalizeRoadmap(raw: unknown): unknown {
  const r = raw as Record<string, unknown>;
  
  return {
    careerGoal: String(r.careerGoal || ""),
    recommendedCourses: (Array.isArray(r.recommendedCourses) ? r.recommendedCourses : []).map((c: unknown) => {
      const item = c as Record<string, unknown>;
      return {
        code: String(item.code || ""),
        name: String(item.name || ""),
        semester: toNumber(item.semester),
        credits: toNumber(item.credits),
        rationale: String(item.rationale || "")
      };
    }),
    skillGaps: (Array.isArray(r.skillGaps) ? r.skillGaps : []).map((g: unknown) => {
      const item = g as Record<string, unknown>;
      return {
        skill: String(item.skill || ""),
        currentLevel: String(item.currentLevel || ""),
        targetLevel: String(item.targetLevel || ""),
        coursesToFill: normalizeArray(item.coursesToFill)
      };
    }),
    certifications: (Array.isArray(r.certifications) ? r.certifications : []).map((c: unknown) => {
      const item = c as Record<string, unknown>;
      return {
        name: String(item.name || ""),
        provider: String(item.provider || ""),
        timeline: String(item.timeline || ""),
        priority: toNumber(item.priority)
      };
    }),
    researchOpportunities: (Array.isArray(r.researchOpportunities) ? r.researchOpportunities : []).map((r: unknown) => {
      const item = r as Record<string, unknown>;
      return {
        title: String(item.title || ""),
        professor: String(item.professor || ""),
        institution: String(item.institution || ""),
        timeline: String(item.timeline || ""),
        relevance: String(item.relevance || "")
      };
    }),
    internshipTargets: (Array.isArray(r.internshipTargets) ? r.internshipTargets : []).map((i: unknown) => {
      const item = i as Record<string, unknown>;
      return {
        company: String(item.company || ""),
        role: String(item.role || ""),
        timeline: String(item.timeline || ""),
        requirements: normalizeArray(item.requirements)
      };
    }),
    semesterRoadmap: (Array.isArray(r.semesterRoadmap) ? r.semesterRoadmap : []).map((s: unknown) => {
      const item = s as Record<string, unknown>;
      return {
        semester: toNumber(item.semester),
        courses: normalizeArray(item.courses),
        activities: normalizeArray(item.activities),
        milestones: normalizeArray(item.milestones)
      };
    }),
    successProbability: Math.min(100, Math.max(0, toNumber(r.successProbability)))
  };
}

export const RoadmapSchema = z.object({
  careerGoal: z.string(),
  recommendedCourses: z.array(z.object({
    code: z.string(),
    name: z.string(),
    semester: z.number(),
    credits: z.number(),
    rationale: z.string()
  })),
  skillGaps: z.array(z.object({
    skill: z.string(),
    currentLevel: z.string(),
    targetLevel: z.string(),
    coursesToFill: z.array(z.string())
  })),
  certifications: z.array(z.object({
    name: z.string(),
    provider: z.string(),
    timeline: z.string(),
    priority: z.number()
  })),
  researchOpportunities: z.array(z.object({
    title: z.string(),
    professor: z.string(),
    institution: z.string(),
    timeline: z.string(),
    relevance: z.string()
  })),
  internshipTargets: z.array(z.object({
    company: z.string(),
    role: z.string(),
    timeline: z.string(),
    requirements: z.array(z.string())
  })),
  semesterRoadmap: z.array(z.object({
    semester: z.number(),
    courses: z.array(z.string()),
    activities: z.array(z.string()),
    milestones: z.array(z.string())
  })),
  successProbability: z.number().min(0).max(100)
});

export type Roadmap = z.infer<typeof RoadmapSchema>;

export const RequestSchema = z.object({
  careerGoal: z.string(),
  currentSkills: z.string(),
  gpa: z.coerce.number().min(0).max(4),
  interests: z.string(),
  provider: z.enum(["openai", "anthropic", "minimax"])
});

export function parseRoadmap(raw: unknown): Roadmap {
  RawRoadmapSchema.parse(raw);
  return RoadmapSchema.parse(normalizeRoadmap(raw));
}

export interface AgentResults {
  courses: unknown;
  skills: unknown;
  certs: unknown;
  research: unknown;
  internships: unknown;
}
