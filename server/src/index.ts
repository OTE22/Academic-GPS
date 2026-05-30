import "dotenv/config";
import express from "express";
import cors from "cors";
import { RequestSchema } from "./schema.js";
import { callLLM } from "./clients/llm.js";
import { searchWeb, searchYouTube, type SearchResult, type YouTubeResult } from "./clients/search.js";
import { isHebrewDominant, validateCareerGoal, validateSkills, validateInterests, validateGPA } from "./clients/utils.js";

const app = express();
app.use(cors());
app.use(express.json());

const STEPS = [
  { key: "analyzing", label: "Analyzing Profile", icon: "🔍", subtext: "Understanding your goals..." },
  { key: "courses", label: "Course Agent", icon: "📚", subtext: "Finding optimal courses..." },
  { key: "skills", label: "Skill Agent", icon: "🎯", subtext: "Identifying gaps..." },
  { key: "certs", label: "Cert Agent", icon: "📜", subtext: "Planning certifications..." },
  { key: "research", label: "Research Agent", icon: "🔬", subtext: "Finding opportunities..." },
  { key: "internships", label: "Internship Agent", icon: "💼", subtext: "Targeting companies..." },
  { key: "synthesizing", label: "Synthesis Agent", icon: "🗺️", subtext: "Building your roadmap..." },
  { key: "complete", label: "Complete", icon: "✨", subtext: "Your roadmap is ready!" },
];

function sendEvent(res: express.Response, data: object) {
  res.write("data: " + JSON.stringify(data) + "\n\n");
}

interface CourseResult {
  code: string;
  name: string;
  semester: number;
  credits: number;
  rationale: string;
  links: SearchResult[];
  videos: YouTubeResult[];
}

interface SkillResult {
  skill: string;
  currentLevel: string;
  targetLevel: string;
  coursesToFill: string[];
  links: SearchResult[];
  videos: YouTubeResult[];
}

interface CertResult {
  name: string;
  provider: string;
  timeline: string;
  priority: number;
  links: SearchResult[];
  videos: YouTubeResult[];
}

interface ResearchResult {
  title: string;
  professor: string;
  institution: string;
  timeline: string;
  relevance: string;
  links: SearchResult[];
  videos: YouTubeResult[];
}

interface InternshipResult {
  company: string;
  role: string;
  timeline: string;
  requirements: string[];
  links: SearchResult[];
  videos: YouTubeResult[];
}

interface AgentResults {
  courses: CourseResult[];
  skills: SkillResult[];
  certs: CertResult[];
  research: ResearchResult[];
  internships: InternshipResult[];
}

app.post("/api/generate-roadmap", async (req, res) => {
  console.log("[SERVER] 1. Received request at /api/generate-roadmap");
  console.log("[SERVER] Request body:", req.body);
  
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    console.log("[SERVER] 2. Parsing request body...");
    const body = RequestSchema.parse(req.body);
    const { careerGoal, currentSkills, gpa, interests, provider } = body;
    console.log("[SERVER] 3. Parsed body - careerGoal:", careerGoal, "provider:", provider);

    if (isHebrewDominant(careerGoal) || isHebrewDominant(interests) || isHebrewDominant(currentSkills)) {
      console.log("[SERVER] 4. Hebrew detected - sending error");
      sendEvent(res, { type: "error", error: "😠 ENGLISH ONLY PLEASE!\n\nI can only help with English input.\nPlease describe your goals in English only.\n\n😠 English only, please!" });
      res.end();
      return;
    }

    console.log("[SERVER] 5. Validating careerGoal:", careerGoal);
    const careerValidation = validateCareerGoal(careerGoal);
    console.log("[SERVER] 6. Career validation result:", careerValidation);
    if (!careerValidation.isValid) {
      console.log("[SERVER] 7. Career validation FAILED - sending error");
      sendEvent(res, { type: "error", error: careerValidation.emoji + " " + careerValidation.message });
      res.end();
      return;
    }
    console.log("[SERVER] 7. Career validation PASSED");

    console.log("[SERVER] 8. Validating skills:", currentSkills);
    const skillsValidation = validateSkills(currentSkills);
    console.log("[SERVER] 9. Skills validation result:", skillsValidation);
    if (!skillsValidation.isValid) {
      console.log("[SERVER] 10. Skills validation FAILED - sending error");
      sendEvent(res, { type: "error", error: skillsValidation.emoji + " " + skillsValidation.message });
      res.end();
      return;
    }
    console.log("[SERVER] 10. Skills validation PASSED");

    console.log("[SERVER] 11. Validating interests:", interests);
    const interestsValidation = validateInterests(interests);
    console.log("[SERVER] 12. Interests validation result:", interestsValidation);
    if (!interestsValidation.isValid) {
      console.log("[SERVER] 13. Interests validation FAILED - sending error");
      sendEvent(res, { type: "error", error: interestsValidation.emoji + " " + interestsValidation.message });
      res.end();
      return;
    }
    console.log("[SERVER] 13. Interests validation PASSED");

    console.log("[SERVER] 14. Validating GPA:", gpa);
    const gpaValidation = validateGPA(gpa);
    console.log("[SERVER] 15. GPA validation result:", gpaValidation);
    if (!gpaValidation.isValid) {
      console.log("[SERVER] 16. GPA validation FAILED - sending error");
      sendEvent(res, { type: "error", error: gpaValidation.emoji + " " + gpaValidation.message });
      res.end();
      return;
    }
    console.log("[SERVER] 16. GPA validation PASSED - ALL VALIDATIONS DONE");
    console.log("[SERVER] 17. Starting LLM calls with provider:", provider);

    const results: AgentResults = {
      courses: [],
      skills: [],
      certs: [],
      research: [],
      internships: []
    };

    sendEvent(res, { type: "step", ...STEPS[0] });
    await sleep(800);

    sendEvent(res, { type: "step", ...STEPS[1], data: { status: "running" } });
    console.log("[SERVER] 18. Calling LLM for courses...");
    try {
      const coursesPrompt = "Return ONLY a valid JSON array of 8-12 course objects for a student pursuing \"" + careerGoal + "\" with skills \"" + currentSkills + "\", GPA " + gpa + ", interests \"" + interests + "\". Each course must have: code (string like \"CS101\"), name (string), semester (number 1-8), credits (number), rationale (string). Return ONLY the JSON array, no explanation.";
      console.log("[SERVER] 19. Courses prompt:", coursesPrompt.substring(0, 100) + "...");
      const coursesResult = await callLLM(provider, coursesPrompt);
      console.log("[SERVER] 20. Courses LLM result type:", typeof coursesResult, Array.isArray(coursesResult) ? "array with " + coursesResult.length + " items" : "");
      if (Array.isArray(coursesResult)) {
        console.log("[SERVER] 21. Processing", coursesResult.length, "courses...");
        for (const c of coursesResult) {
          if (typeof c === "object" && c !== null) {
            const course = c as Record<string, unknown>;
            const courseName = String(course.name || course.code || "Unknown Course");
            console.log("[SERVER] 22. Searching web for:", courseName);
            const links = await searchWeb(courseName + " course curriculum syllabus");
            console.log("[SERVER] 23. Searching YouTube for:", courseName);
            const videos = await searchYouTube(courseName + " tutorial course full");
            results.courses.push({
              code: String(course.code || ""),
              name: courseName,
              semester: Number(course.semester) || 1,
              credits: Number(course.credits) || 3,
              rationale: String(course.rationale || ""),
              links,
              videos
            });
          }
        }
        console.log("[SERVER] 24. Courses processed, total:", results.courses.length);
      }
    } catch (e) {
      console.error("[SERVER] Courses agent error:", e);
    }
    await sleep(600);

    sendEvent(res, { type: "step", ...STEPS[2], data: { status: "running" } });
    try {
      const skillsResult = await callLLM(provider, "Return ONLY a valid JSON array of 5-7 skill gap objects for a student pursuing \"" + careerGoal + "\" with current skills \"" + currentSkills + "\", GPA " + gpa + ". Each object must have: skill (string), currentLevel (string \"beginner\"/\"intermediate\"/\"advanced\"), targetLevel (string), coursesToFill (array of strings). Return ONLY the JSON array, no explanation.");
      if (Array.isArray(skillsResult)) {
        for (const s of skillsResult) {
          if (typeof s === "object" && s !== null) {
            const skill = s as Record<string, unknown>;
            const skillName = String(skill.skill || "Unknown Skill");
            const links = await searchWeb(skillName + " skills guide learning resources");
            const videos = await searchYouTube(skillName + " tutorial for beginners");
            results.skills.push({
              skill: skillName,
              currentLevel: String(skill.currentLevel || "beginner"),
              targetLevel: String(skill.targetLevel || "advanced"),
              coursesToFill: Array.isArray(skill.coursesToFill) ? skill.coursesToFill.map(String) : [],
              links,
              videos
            });
          }
        }
      }
    } catch (e) {
      console.error("Skills agent error:", e);
    }
    await sleep(600);

    sendEvent(res, { type: "step", ...STEPS[3], data: { status: "running" } });
    try {
      const certsResult = await callLLM(provider, "Return ONLY a valid JSON array of 3-5 certification objects for a student pursuing \"" + careerGoal + "\" with skills \"" + currentSkills + "\", GPA " + gpa + ". Each object must have: name (string), provider (string like \"AWS\"/\"Google\"/\"Microsoft\"), timeline (string like \"Summer 2025\"), priority (number 1-5). Return ONLY the JSON array, no explanation.");
      if (Array.isArray(certsResult)) {
        for (const c of certsResult) {
          if (typeof c === "object" && c !== null) {
            const cert = c as Record<string, unknown>;
            const certName = String(cert.name || "Unknown Certification");
            const links = await searchWeb(certName + " certification exam details");
            const videos = await searchYouTube(certName + " preparation guide");
            results.certs.push({
              name: certName,
              provider: String(cert.provider || "Unknown"),
              timeline: String(cert.timeline || "TBD"),
              priority: Number(cert.priority) || 3,
              links,
              videos
            });
          }
        }
      }
    } catch (e) {
      console.error("Certs agent error:", e);
    }
    await sleep(600);

    sendEvent(res, { type: "step", ...STEPS[4], data: { status: "running" } });
    try {
      const researchResult = await callLLM(provider, "Return ONLY a valid JSON array of 2-4 research opportunity objects for a student interested in \"" + interests + "\" pursuing \"" + careerGoal + "\". Each object must have: title (string), professor (string), institution (string), timeline (string), relevance (string). Return ONLY the JSON array, no explanation.");
      if (Array.isArray(researchResult)) {
        for (const r of researchResult) {
          if (typeof r === "object" && r !== null) {
            const research = r as Record<string, unknown>;
            const researchTitle = String(research.title || "Research Project");
            const links = await searchWeb(researchTitle + " " + research.institution + " professor research");
            const videos = await searchYouTube(researchTitle + " research presentation");
            results.research.push({
              title: researchTitle,
              professor: String(research.professor || "Unknown Professor"),
              institution: String(research.institution || "Unknown Institution"),
              timeline: String(research.timeline || "TBD"),
              relevance: String(research.relevance || ""),
              links,
              videos
            });
          }
        }
      }
    } catch (e) {
      console.error("Research agent error:", e);
    }
    await sleep(600);

    sendEvent(res, { type: "step", ...STEPS[5], data: { status: "running" } });
    try {
      const internshipsResult = await callLLM(provider, "Return ONLY a valid JSON array of 3-5 internship target objects for a student pursuing \"" + careerGoal + "\" with skills \"" + currentSkills + "\", GPA " + gpa + ". Each object must have: company (string), role (string), timeline (string like \"Summer 2026\"), requirements (array of strings). Return ONLY the JSON array, no explanation.");
      if (Array.isArray(internshipsResult)) {
        for (const i of internshipsResult) {
          if (typeof i === "object" && i !== null) {
            const internship = i as Record<string, unknown>;
            const companyName = String(internship.company || "Unknown Company");
            const links = await searchWeb(companyName + " internship careers " + internship.role);
            const videos = await searchYouTube(companyName + " interview experience");
            results.internships.push({
              company: companyName,
              role: String(internship.role || "Intern"),
              timeline: String(internship.timeline || "TBD"),
              requirements: Array.isArray(internship.requirements) ? internship.requirements.map(String) : [],
              links,
              videos
            });
          }
        }
      }
    } catch (e) {
      console.error("Internships agent error:", e);
    }
    await sleep(600);

    sendEvent(res, { type: "step", ...STEPS[6], data: { status: "running" } });
    
    const semesters = buildSemesters(results);
    const successProbability = calculateSuccess(results, careerGoal);
    
    const finalRoadmap = {
      careerGoal,
      recommendedCourses: results.courses,
      skillGaps: results.skills,
      certifications: results.certs,
      researchOpportunities: results.research,
      internshipTargets: results.internships,
      semesterRoadmap: semesters,
      successProbability
    };
    
    await sleep(400);

    sendEvent(res, { type: "step", ...STEPS[7], data: { roadmap: finalRoadmap } });
    await sleep(200);

    sendEvent(res, { type: "done", data: finalRoadmap });
    res.end();
  } catch (error) {
    sendEvent(res, { type: "error", error: (error as Error).message });
    res.end();
  }
});

function buildSemesters(results: AgentResults): object[] {
  const semesters: object[] = [];
  for (let i = 0; i < 8; i++) {
    const semesterCourses = results.courses.slice(i * 2, i * 2 + 2).map(c => c.name);
    semesters.push({
      semester: i + 1,
      courses: semesterCourses.length > 0 ? semesterCourses : [`General Course ${i + 1}`, `Elective ${i + 1}`],
      activities: [
        i < 2 ? "Focus on fundamentals" : i < 4 ? "Build intermediate skills" : "Advanced specialization",
        i % 2 === 0 ? "Join study groups" : "Work on projects"
      ],
      milestones: [
        i === 0 ? "Complete orientation" : null,
        i === 3 ? "Mid-program review" : null,
        i === 7 ? "Graduate" : null
      ].filter(Boolean)
    });
  }
  return semesters;
}

function calculateSuccess(results: AgentResults, careerGoal: string): number {
  const baseScore = 50;
  const skillBonus = Math.min(30, results.skills.length * 5);
  const certBonus = Math.min(10, results.certs.length * 2);
  const researchBonus = results.research.length > 0 ? 5 : 0;
  const internshipBonus = results.internships.length > 0 ? 5 : 0;
  
  let goalBonus = 0;
  if (careerGoal.toLowerCase().includes("engineer")) goalBonus += 10;
  if (careerGoal.toLowerCase().includes("data")) goalBonus += 8;
  if (careerGoal.toLowerCase().includes("software")) goalBonus += 10;
  
  return Math.min(95, baseScore + skillBonus + certBonus + researchBonus + internshipBonus + goalBonus);
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server running on port " + PORT));
