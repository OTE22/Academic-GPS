import type { Roadmap } from "../types";

interface Props {
  roadmap: Roadmap;
}

function LinkBadge({ title, url }: { title: string; url: string }) {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "3px 8px",
        background: "rgba(99, 102, 241, 0.15)",
        borderRadius: "4px",
        textDecoration: "none",
        fontSize: "10px",
        color: "#a5b4fc",
        transition: "all 0.2s ease"
      }}
      title={title}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
      Course Info
    </a>
  );
}

export function RoadmapTimeline({ roadmap }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "20px 24px",
        background: "rgba(11, 15, 25, 0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          boxShadow: "0 8px 32px rgba(99, 102, 241, 0.3)"
        }}>
          🎓
        </div>
        <div>
          <h3 style={{ fontSize: "20px", fontWeight: 700, margin: 0, background: "linear-gradient(135deg, #6366f1, #d946ef)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Semester Roadmap
          </h3>
          <p style={{ fontSize: "13px", color: "#94a3b8", margin: "4px 0 0 0" }}>
            8-Semester Academic Journey to {roadmap.careerGoal}
          </p>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "16px"
      }}>
        {roadmap.semesterRoadmap.map((sem) => {
          const semesterColors = [
            { bg: "rgba(99, 102, 241, 0.12)", border: "rgba(99, 102, 241, 0.3)", icon: "1️⃣" },
            { bg: "rgba(139, 92, 246, 0.12)", border: "rgba(139, 92, 246, 0.3)", icon: "2️⃣" },
            { bg: "rgba(217, 70, 239, 0.12)", border: "rgba(217, 70, 239, 0.3)", icon: "3️⃣" },
            { bg: "rgba(6, 182, 212, 0.12)", border: "rgba(6, 182, 212, 0.3)", icon: "4️⃣" },
            { bg: "rgba(16, 185, 129, 0.12)", border: "rgba(16, 185, 129, 0.3)", icon: "5️⃣" },
            { bg: "rgba(245, 158, 11, 0.12)", border: "rgba(245, 158, 11, 0.3)", icon: "6️⃣" },
            { bg: "rgba(239, 68, 68, 0.12)", border: "rgba(239, 68, 68, 0.3)", icon: "7️⃣" },
            { bg: "rgba(99, 102, 241, 0.12)", border: "rgba(99, 102, 241, 0.3)", icon: "8️⃣" },
          ];
          const colorIdx = (sem.semester - 1) % semesterColors.length;
          const colors = semesterColors[colorIdx];

          const courseLinks = roadmap.recommendedCourses
            .filter(c => c.semester === sem.semester)
            .flatMap(c => c.links || [])
            .slice(0, 3);

          return (
            <div key={sem.semester} style={{
              padding: "20px",
              background: colors.bg,
              backdropFilter: "blur(20px)",
              borderRadius: "16px",
              border: "1px solid " + colors.border,
              transition: "all 0.3s ease",
              cursor: "default"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "18px" }}>{colors.icon}</span>
                <div style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#f1f5f9"
                }}>
                  Semester {sem.semester}
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
                  📚 Courses
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {sem.courses.slice(0, 3).map((c, i) => (
                    <div key={i} style={{
                      fontSize: "13px",
                      color: "#e2e8f0",
                      padding: "6px 10px",
                      background: "rgba(0, 0, 0, 0.2)",
                      borderRadius: "8px"
                    }}>
                      {c}
                    </div>
                  ))}
                  {sem.courses.length > 3 && (
                    <div style={{ fontSize: "11px", color: "#64748b" }}>
                      +{sem.courses.length - 3} more
                    </div>
                  )}
                </div>
              </div>

              {courseLinks.length > 0 && (
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
                    🔗 Resources
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {courseLinks.map((link, i) => (
                      <LinkBadge key={i} title={link.title} url={link.url} />
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: sem.milestones.length > 0 ? "12px" : "0" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
                  ⚡ Activities
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {sem.activities.slice(0, 2).map((a, i) => (
                    <span key={i} style={{
                      padding: "4px 8px",
                      background: "rgba(139, 92, 246, 0.2)",
                      borderRadius: "6px",
                      fontSize: "11px",
                      color: "#c4b5fd"
                    }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {sem.milestones.length > 0 && (
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
                    🎯 Milestones
                  </div>
                  <div style={{ fontSize: "12px", color: "#10b981" }}>
                    ✓ {sem.milestones[0]}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
