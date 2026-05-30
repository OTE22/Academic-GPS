import type { Roadmap } from "../types";

interface Props {
  roadmap: Roadmap;
}

function LinkItem({ title, url }: { title: string; url: string }) {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 10px",
        background: "rgba(99, 102, 241, 0.1)",
        borderRadius: "6px",
        textDecoration: "none",
        fontSize: "11px",
        color: "#8b5cf6",
        transition: "all 0.2s ease",
        border: "1px solid rgba(99, 102, 241, 0.2)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(99, 102, 241, 0.2)";
        e.currentTarget.style.transform = "translateX(2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(99, 102, 241, 0.1)";
        e.currentTarget.style.transform = "translateX(0)";
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
      {title.length > 30 ? title.substring(0, 30) + "..." : title}
    </a>
  );
}

export function StatsPanel({ roadmap }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{
        padding: "20px",
        background: "rgba(16, 185, 129, 0.08)",
        backdropFilter: "blur(20px)",
        borderRadius: "16px",
        border: "1px solid rgba(16, 185, 129, 0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <span style={{ fontSize: "20px" }}>🎯</span>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#10b981" }}>
            Skill Gaps ({roadmap.skillGaps.length})
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {roadmap.skillGaps.map((gap, i) => (
            <div key={i} style={{
              padding: "14px",
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: "10px"
            }}>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#f1f5f9", marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                {gap.skill}
                <span style={{ fontSize: "10px", padding: "2px 6px", background: "rgba(16, 185, 129, 0.2)", borderRadius: "4px", color: "#10b981" }}>
                  {gap.currentLevel} → {gap.targetLevel}
                </span>
              </div>
              {gap.links && gap.links.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>
                    🔗 Resources
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {gap.links.slice(0, 2).map((link, idx) => (
                      <LinkItem key={idx} title={link.title} url={link.url} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        padding: "20px",
        background: "rgba(245, 158, 11, 0.08)",
        backdropFilter: "blur(20px)",
        borderRadius: "16px",
        border: "1px solid rgba(245, 158, 11, 0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <span style={{ fontSize: "20px" }}>📜</span>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#f59e0b" }}>
            Certifications ({roadmap.certifications.length})
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {roadmap.certifications.map((cert, i) => (
            <div key={i} style={{
              padding: "14px",
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: "10px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#f1f5f9" }}>
                    {cert.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                    {cert.provider} • {cert.timeline}
                  </div>
                </div>
                <div style={{
                  padding: "4px 8px",
                  background: cert.priority >= 4 ? "rgba(16, 185, 129, 0.2)" : "rgba(99, 102, 241, 0.2)",
                  borderRadius: "6px",
                  fontSize: "11px",
                  color: cert.priority >= 4 ? "#10b981" : "#6366f1"
                }}>
                  P{cert.priority}
                </div>
              </div>
              {cert.links && cert.links.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>
                    🔗 Exam Details
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {cert.links.slice(0, 2).map((link, idx) => (
                      <LinkItem key={idx} title={link.title} url={link.url} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        padding: "20px",
        background: "rgba(6, 182, 212, 0.08)",
        backdropFilter: "blur(20px)",
        borderRadius: "16px",
        border: "1px solid rgba(6, 182, 212, 0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <span style={{ fontSize: "20px" }}>💼</span>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#06b6d4" }}>
            Internship Targets ({roadmap.internshipTargets.length})
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {roadmap.internshipTargets.map((int, i) => (
            <div key={i} style={{
              padding: "14px",
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: "10px"
            }}>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#f1f5f9" }}>
                {int.role}
              </div>
              <div style={{ fontSize: "13px", color: "#06b6d4", marginTop: "2px" }}>
                {int.company}
              </div>
              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                ⏰ {int.timeline}
              </div>
              {int.links && int.links.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>
                    🔗 Apply Here
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {int.links.slice(0, 2).map((link, idx) => (
                      <LinkItem key={idx} title={link.title} url={link.url} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        padding: "20px",
        background: "rgba(139, 92, 246, 0.08)",
        backdropFilter: "blur(20px)",
        borderRadius: "16px",
        border: "1px solid rgba(139, 92, 246, 0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <span style={{ fontSize: "20px" }}>🔬</span>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#a78bfa" }}>
            Research ({roadmap.researchOpportunities.length})
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {roadmap.researchOpportunities.map((res, i) => (
            <div key={i} style={{
              padding: "14px",
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: "10px"
            }}>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#f1f5f9" }}>
                {res.title}
              </div>
              <div style={{ fontSize: "12px", color: "#a78bfa", marginTop: "4px" }}>
                {res.professor} @ {res.institution}
              </div>
              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                📅 {res.timeline}
              </div>
              {res.links && res.links.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>
                    🔗 Learn More
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {res.links.slice(0, 2).map((link, idx) => (
                      <LinkItem key={idx} title={link.title} url={link.url} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
