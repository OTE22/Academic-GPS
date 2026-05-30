import { type ValidationError, type Props } from "../types";

const FAKE_INDICATORS = [
  "asdf", "qwerty", "zxcv", "jkl;", "fakepath", "fake", "test test",
  "asdfgh", "qwertyuiop", "zxcvbnm", "hjkl", "aaaa", "bbbb", "cccc",
  "xxx", "yyy", "zzz", "n/a", "na", "none", "nothing", "idk", "idc",
  "whatever", "asdasd", "qweqwe", "zxczxc"
];

const REAL_CAREERS = [
  "software", "engineer", "data scientist", "machine learning", "developer",
  "frontend", "backend", "full stack", "devops", "cloud", "cybersecurity",
  "mobile", "ux", "ui", "product manager", "analyst", "architect", "research",
  "web developer", "systems", "network", "database", "security", "ai",
  "consultant", "doctor", "lawyer", "accountant", "marketer", "professor"
];

const REAL_SKILLS = [
  "python", "java", "javascript", "typescript", "c++", "c#", "ruby", "go", "rust",
  "swift", "kotlin", "scala", "r", "sql", "html", "css", "react", "angular",
  "vue", "node", "django", "flask", "tensorflow", "pytorch", "keras",
  "aws", "azure", "gcp", "docker", "kubernetes", "git", "linux", "bash",
  "mongodb", "postgres", "mysql", "redis", "api", "rest", "graphql",
  "machine learning", "deep learning", "nlp", "computer vision",
  "data analysis", "statistics", "algorithm", "agile", "scrum"
];

export function AngryPopup({ errors, onClose }: Props) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.9)",
      backdropFilter: "blur(10px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      animation: "fadeIn 0.3s ease"
    }}>
      <div style={{
        width: "90%",
        maxWidth: "480px",
        background: "linear-gradient(145deg, #1a0a0a, #2d1212)",
        borderRadius: "24px",
        border: "2px solid #ef4444",
        overflow: "hidden",
        animation: "shake 0.5s ease, scaleIn 0.3s ease",
        boxShadow: "0 0 60px rgba(239, 68, 68, 0.4), 0 0 100px rgba(239, 68, 68, 0.2)"
      }}>
        <div style={{
          background: "linear-gradient(135deg, #dc2626, #991b1b)",
          padding: "24px",
          textAlign: "center"
        }}>
          <div style={{
            fontSize: "72px",
            marginBottom: "8px",
            animation: "angryBounce 0.5s ease infinite"
          }}>
            😠
          </div>
          <h2 style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "#fff",
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "2px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
          }}>
            PLEASE BE SERIOUS!
          </h2>
          <p style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.8)",
            margin: "8px 0 0 0"
          }}>
            Fill your academic data properly
          </p>
        </div>
        
        <div style={{ padding: "24px" }}>
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "16px"
          }}>
            <p style={{
              fontSize: "14px",
              color: "#fca5a5",
              margin: 0,
              lineHeight: 1.6
            }}>
              ⚠️ We detected issues with your submission. Please fix the following:
            </p>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
            {errors.map((error, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                borderLeft: "3px solid #ef4444"
              }}>
                <span style={{ fontSize: "18px" }}>❌</span>
                <span style={{ fontSize: "13px", color: "#f1f5f9" }}>{error.message}</span>
              </div>
            ))}
          </div>
          
          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "1px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(220, 38, 38, 0.4)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            I'll Fix It! 💪
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes angryBounce {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-5deg); }
          75% { transform: scale(1.1) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}

export function validateForm(data: {
  careerGoal: string;
  currentSkills: string;
  gpa: string;
  interests: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];
  const lower = data.careerGoal.toLowerCase().trim();
  
  console.log("validateForm called with:", data);
  console.log("Career lower:", lower);
  console.log("REAL_CAREERS match:", REAL_CAREERS.filter(c => lower.includes(c)));
  
  // Career validation
  if (!data.careerGoal || data.careerGoal.trim().length < 5) {
    errors.push({ field: "careerGoal", message: "Career goal is too short or empty" });
  } else if (FAKE_INDICATORS.some(f => lower.includes(f))) {
    errors.push({ field: "careerGoal", message: "Fake data detected! Please enter your REAL career goal" });
  } else if (!REAL_CAREERS.some(c => lower.includes(c))) {
    errors.push({ field: "careerGoal", message: "Please enter a valid career (e.g., Software Engineer, Data Scientist)" });
  }
  
  // Skills validation
  const skillsLower = data.currentSkills.toLowerCase().trim();
  console.log("Skills lower:", skillsLower);
  console.log("REAL_SKILLS match:", REAL_SKILLS.filter(s => skillsLower.includes(s)));
  if (!data.currentSkills || data.currentSkills.trim().length < 3) {
    errors.push({ field: "currentSkills", message: "Skills field is too short or empty" });
  } else if (FAKE_INDICATORS.some(f => skillsLower.includes(f))) {
    errors.push({ field: "currentSkills", message: "Fake data detected! Please list your REAL skills" });
  } else if (!REAL_SKILLS.some(s => skillsLower.includes(s))) {
    errors.push({ field: "currentSkills", message: "Please list real technical skills (e.g., Python, JavaScript, ML)" });
  }
  
  // GPA validation
  const gpa = parseFloat(data.gpa);
  console.log("GPA:", gpa);
  if (!data.gpa || isNaN(gpa)) {
    errors.push({ field: "gpa", message: "Please enter your real GPA" });
  } else if (gpa === 0) {
    errors.push({ field: "gpa", message: "A GPA of 0? That's not real. Enter your actual GPA" });
  } else if (gpa < 0 || gpa > 4) {
    errors.push({ field: "gpa", message: "GPA must be between 0 and 4.0" });
  }
  
  // Interests validation
  const intLower = data.interests.toLowerCase().trim();
  console.log("Interests lower:", intLower);
  if (!data.interests || data.interests.trim().length < 3) {
    errors.push({ field: "interests", message: "Please fill in your real interests" });
  } else if (FAKE_INDICATORS.some(f => intLower.includes(f))) {
    errors.push({ field: "interests", message: "Fake data detected! Please share your REAL interests" });
  }
  
  console.log("Total errors:", errors.length, errors);
  return errors;
}
