import { useState, useEffect, useRef, useCallback } from "react";
import type { Roadmap, YouTubeResult } from "./types";
import { ProfileForm } from "./components/ProfileForm";
import { AngryPopup, validateForm } from "./components/AngryPopup";
import { Toast } from "./components/Toast";

interface Step {
  key: string;
  label: string;
  icon: string;
  subtext?: string;
  data?: Record<string, unknown>;
}

const STEPS: Step[] = [
  { key: "analyzing", label: "Analyzing Profile", icon: "🔍", subtext: "Understanding your goals..." },
  { key: "courses", label: "Course Agent", icon: "📚", subtext: "Finding optimal courses..." },
  { key: "skills", label: "Skill Agent", icon: "🎯", subtext: "Identifying gaps..." },
  { key: "certs", label: "Cert Agent", icon: "📜", subtext: "Planning certifications..." },
  { key: "research", label: "Research Agent", icon: "🔬", subtext: "Finding opportunities..." },
  { key: "internships", label: "Internship Agent", icon: "💼", subtext: "Targeting companies..." },
  { key: "synthesizing", label: "Synthesis Agent", icon: "🗺️", subtext: "Building your roadmap..." },
  { key: "complete", label: "Complete", icon: "✨", subtext: "Your roadmap is ready!" },
];

function YouTubeModal({ video, onClose }: { video: YouTubeResult; onClose: () => void }) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.9)",
      backdropFilter: "blur(10px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      animation: "fadeIn 0.3s ease"
    }} onClick={onClose}>
      <div style={{
        width: "90%",
        maxWidth: "900px",
        background: "rgba(15, 20, 30, 0.98)",
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        animation: "scaleIn 0.3s ease"
      }} onClick={e => e.stopPropagation()}>
        <div style={{ position: "relative", paddingTop: "56.25%" }}>
          <iframe
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div style={{ padding: "20px" }}>
          <h3 style={{ color: "#f1f5f9", marginBottom: "8px", fontSize: "18px" }}>{video.title}</h3>
          <p style={{ color: "#64748b", fontSize: "14px" }}>{video.channel} • {video.duration}</p>
        </div>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(255, 255, 255, 0.1)",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "20px"
          }}
        >
          ✕
        </button>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}

function VideoCard({ video, small }: { video: YouTubeResult; small?: boolean }) {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        style={{
          display: "flex",
          gap: small ? "8px" : "12px",
          padding: small ? "8px" : "12px",
          background: "rgba(239, 68, 68, 0.1)",
          borderRadius: "10px",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          cursor: "pointer",
          transition: "all 0.2s ease"
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img
            src={video.thumbnail}
            alt={video.title}
            style={{
              width: small ? "60px" : "80px",
              height: small ? "45px" : "60px",
              objectFit: "cover",
              borderRadius: "6px"
            }}
          />
          <div style={{
            position: "absolute",
            bottom: "2px",
            right: "2px",
            background: "rgba(0, 0, 0, 0.8)",
            padding: "2px 4px",
            borderRadius: "3px",
            fontSize: "10px",
            color: "#fff"
          }}>
            ▶
          </div>
        </div>
        {!small && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#f1f5f9",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}>
              {video.title}
            </div>
            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
              {video.channel}
            </div>
          </div>
        )}
      </div>
      {showModal && <YouTubeModal video={video} onClose={() => setShowModal(false)} />}
    </>
  );
}

function CourseCard({ course }: { course: Roadmap["recommendedCourses"][0] }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))",
      borderRadius: "16px",
      border: "1px solid rgba(99, 102, 241, 0.2)",
      overflow: "hidden",
      transition: "all 0.3s ease"
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: "16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}
      >
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          fontWeight: 700,
          color: "#fff"
        }}>
          {course.code.substring(0, 2) || "CS"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "15px", fontWeight: 600, color: "#f1f5f9" }}>{course.name}</div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
            {course.code} • {course.credits} credits • Semester {course.semester}
          </div>
        </div>
        <div style={{
          padding: "6px",
          background: expanded ? "rgba(99, 102, 241, 0.3)" : "rgba(255, 255, 255, 0.05)",
          borderRadius: "8px",
          transition: "all 0.2s ease"
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
      
      {expanded && (
        <div style={{
          padding: "0 16px 16px",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          marginTop: "0",
          animation: "slideDown 0.3s ease"
        }}>
          <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "12px", lineHeight: 1.5 }}>
            {course.rationale}
          </p>
          
          {course.videos && course.videos.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
                🎬 Video Tutorials
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {course.videos.map((v, i) => (
                  <VideoCard key={i} video={v} />
                ))}
              </div>
            </div>
          )}
          
          {course.links && course.links.length > 0 && (
            <div style={{ marginTop: "12px" }}>
              <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
                🔗 Resources
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {course.links.slice(0, 3).map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                    style={{
                      padding: "6px 10px",
                      background: "rgba(99, 102, 241, 0.1)",
                      borderRadius: "6px",
                      fontSize: "11px",
                      color: "#a5b4fc",
                      textDecoration: "none"
                    }}>
                    {link.title.substring(0, 25)}...
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

function SkillCard({ skill }: { skill: Roadmap["skillGaps"][0] }) {
  const [expanded, setExpanded] = useState(false);
  const levelColors: Record<string, string> = { beginner: "#ef4444", intermediate: "#f59e0b", advanced: "#10b981" };
  
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(16, 185, 129, 0.05))",
      borderRadius: "14px",
      border: "1px solid rgba(16, 185, 129, 0.15)",
      overflow: "hidden",
      transition: "all 0.3s ease"
    }}>
      <div onClick={() => setExpanded(!expanded)} style={{ padding: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
          🎯
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#f1f5f9" }}>{skill.skill}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
            <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", background: levelColors[skill.currentLevel] + "20", color: levelColors[skill.currentLevel] }}>
              {skill.currentLevel}
            </span>
            <span style={{ color: "#64748b" }}>→</span>
            <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", background: levelColors[skill.targetLevel] + "20", color: levelColors[skill.targetLevel] }}>
              {skill.targetLevel}
            </span>
          </div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      
      {expanded && (
        <div style={{ padding: "0 14px 14px", borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "10px" }}>
            Fill gap: {skill.coursesToFill.slice(0, 3).join(", ")}
          </div>
          
          {skill.videos && skill.videos.length > 0 && (
            <div style={{ marginTop: "12px" }}>
              <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "6px", textTransform: "uppercase" }}>🎬 Learn</div>
              <VideoCard video={skill.videos[0]} small />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CertCard({ cert }: { cert: Roadmap["certifications"][0] }) {
  const priorityColors = ["#64748b", "#6366f1", "#8b5cf6", "#d946ef", "#10b981"];
  
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(245, 158, 11, 0.05))",
      borderRadius: "14px",
      border: "1px solid rgba(245, 158, 11, 0.15)",
      padding: "14px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#f1f5f9" }}>{cert.name}</div>
          <div style={{ fontSize: "12px", color: "#f59e0b", marginTop: "2px" }}>{cert.provider}</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>📅 {cert.timeline}</div>
        </div>
        <div style={{
          padding: "4px 10px",
          background: priorityColors[cert.priority - 1] + "20",
          color: priorityColors[cert.priority - 1],
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: 600
        }}>
          P{cert.priority}
        </div>
      </div>
      
      {cert.videos && cert.videos.length > 0 && (
        <div style={{ marginTop: "12px" }}>
          <VideoCard video={cert.videos[0]} small />
        </div>
      )}
    </div>
  );
}

function InternshipCard({ intern }: { intern: Roadmap["internshipTargets"][0] }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(6, 182, 212, 0.05))",
      borderRadius: "14px",
      border: "1px solid rgba(6, 182, 212, 0.15)",
      padding: "14px"
    }}>
      <div style={{ fontSize: "15px", fontWeight: 600, color: "#06b6d4" }}>{intern.role}</div>
      <div style={{ fontSize: "13px", color: "#f1f5f9", marginTop: "2px" }}>{intern.company}</div>
      <div style={{ fontSize: "11px", color: "#64748b", marginTop: "6px" }}>⏰ {intern.timeline}</div>
      {intern.requirements.length > 0 && (
        <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "6px" }}>
          Requirements: {intern.requirements.slice(0, 2).join(", ")}
        </div>
      )}
      {intern.videos && intern.videos.length > 0 && (
        <div style={{ marginTop: "12px" }}>
          <VideoCard video={intern.videos[0]} small />
        </div>
      )}
    </div>
  );
}

function ResearchCard({ research }: { research: Roadmap["researchOpportunities"][0] }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(139, 92, 246, 0.05))",
      borderRadius: "14px",
      border: "1px solid rgba(139, 92, 246, 0.15)",
      padding: "14px"
    }}>
      <div style={{ fontSize: "14px", fontWeight: 600, color: "#a78bfa" }}>{research.title}</div>
      <div style={{ fontSize: "12px", color: "#a78bfa", marginTop: "4px" }}>{research.professor}</div>
      <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>🏛️ {research.institution}</div>
      <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "6px" }}>{research.relevance}</div>
      {research.videos && research.videos.length > 0 && (
        <div style={{ marginTop: "12px" }}>
          <VideoCard video={research.videos[0]} small />
        </div>
      )}
    </div>
  );
}

function SuccessGauge({ probability }: { probability: number }) {
  const [display, setDisplay] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 1;
      if (start <= probability) {
        setDisplay(start);
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [probability]);
  
  const color = probability >= 70 ? "#10b981" : probability >= 40 ? "#f59e0b" : "#ef4444";
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (display / 100) * circumference;
  
  return (
    <div style={{ position: "relative", width: "180px", height: "180px", margin: "0 auto" }}>
      <svg width="180" height="180" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="90" cy="90" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12"/>
        <circle cx="90" cy="90" r="70" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 10px ${color})`, transition: "stroke-dashoffset 1s ease" }}/>
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: "42px", fontWeight: 800, color, textShadow: `0 0 30px ${color}` }}>{display}%</div>
        <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "2px" }}>Success</div>
      </div>
      <div style={{
        position: "absolute",
        bottom: "-10px",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "4px 12px",
        background: color,
        borderRadius: "20px",
        fontSize: "10px",
        fontWeight: 600,
        color: "#0b0f19"
      }}>
        {probability >= 70 ? "🚀 Excellent" : probability >= 40 ? "💪 Good" : "⚡ Keep Learning"}
      </div>
    </div>
  );
}

function RoadmapView({ roadmap }: { roadmap: Roadmap }) {
  const [activeTab, setActiveTab] = useState<"overview"|"courses"|"skills"|"certs"|"research"|"internships">("overview");
  
  const tabs = [
    { key: "overview", label: "Overview", icon: "🎯" },
    { key: "courses", label: `Courses (${roadmap.recommendedCourses.length})`, icon: "📚" },
    { key: "skills", label: `Skills (${roadmap.skillGaps.length})`, icon: "🎯" },
    { key: "certs", label: `Certs (${roadmap.certifications.length})`, icon: "📜" },
    { key: "research", label: `Research (${roadmap.researchOpportunities.length})`, icon: "🔬" },
    { key: "internships", label: `Jobs (${roadmap.internshipTargets.length})`, icon: "💼" },
  ] as const;
  
  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px" }}>
      <header style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "42px", fontWeight: 800, marginBottom: "8px", background: "linear-gradient(135deg, #6366f1, #d946ef, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Your Career Roadmap
        </h1>
        <p style={{ fontSize: "18px", color: "#94a3b8" }}>{roadmap.careerGoal}</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "28px", alignItems: "start" }}>
        <aside style={{ position: "sticky", top: "20px" }}>
          <div style={{
            background: "rgba(15, 20, 30, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "24px"
          }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "16px" }}>
                Career Success Probability
              </div>
              <SuccessGauge probability={roadmap.successProbability} />
            </div>
            
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px" }}>
              <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                Quick Stats
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{ background: "rgba(99, 102, 241, 0.1)", padding: "12px", borderRadius: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: "#6366f1" }}>{roadmap.recommendedCourses.length}</div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>Courses</div>
                </div>
                <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "12px", borderRadius: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: "#10b981" }}>{roadmap.skillGaps.length}</div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>Skills</div>
                </div>
                <div style={{ background: "rgba(245, 158, 11, 0.1)", padding: "12px", borderRadius: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: "#f59e0b" }}>{roadmap.certifications.length}</div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>Certs</div>
                </div>
                <div style={{ background: "rgba(6, 182, 212, 0.1)", padding: "12px", borderRadius: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: "#06b6d4" }}>{roadmap.internshipTargets.length}</div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>Internships</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main>
          <div style={{
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
            overflowX: "auto",
            paddingBottom: "8px"
          }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "10px 16px",
                  background: activeTab === tab.key ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.03)",
                  border: activeTab === tab.key ? "none" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  color: activeTab === tab.key ? "#fff" : "#64748b",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease"
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
              <div style={{
                gridColumn: "span 2",
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))",
                borderRadius: "20px",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                padding: "24px"
              }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#f1f5f9", marginBottom: "16px" }}>🎓 8-Semester Journey</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                  {roadmap.semesterRoadmap.map(sem => (
                    <div key={sem.semester} style={{
                      padding: "12px",
                      background: "rgba(0,0,0,0.2)",
                      borderRadius: "10px",
                      textAlign: "center"
                    }}>
                      <div style={{ fontSize: "18px", fontWeight: 700, color: "#6366f1" }}>S{sem.semester}</div>
                      <div style={{ fontSize: "10px", color: "#64748b", marginTop: "4px" }}>{sem.courses.slice(0, 2).join(", ")}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {roadmap.certifications.slice(0, 2).map((cert, i) => (
                <CertCard key={i} cert={cert} />
              ))}
              {roadmap.internshipTargets.slice(0, 2).map((intern, i) => (
                <InternshipCard key={i} intern={intern} />
              ))}
            </div>
          )}

          {activeTab === "courses" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {roadmap.recommendedCourses.map((course, i) => (
                <CourseCard key={i} course={course} />
              ))}
            </div>
          )}

          {activeTab === "skills" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              {roadmap.skillGaps.map((skill, i) => (
                <SkillCard key={i} skill={skill} />
              ))}
            </div>
          )}

          {activeTab === "certs" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              {roadmap.certifications.map((cert, i) => (
                <CertCard key={i} cert={cert} />
              ))}
            </div>
          )}

          {activeTab === "research" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              {roadmap.researchOpportunities.map((research, i) => (
                <ResearchCard key={i} research={research} />
              ))}
            </div>
          )}

          {activeTab === "internships" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              {roadmap.internshipTargets.map((intern, i) => (
                <InternshipCard key={i} intern={intern} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ParticleBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <canvas id="particles" style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

function useParticles() {
  useEffect(() => {
    const canvas = document.getElementById("particles") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = [];
    const colors = ["#6366f1", "#8b5cf6", "#d946ef", "#06b6d4", "#10b981"];
    
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    let animId: number;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      animId = requestAnimationFrame(animate);
    }
    animate();
    
    return () => cancelAnimationFrame(animId);
  }, []);
}

function ProgressView({ activeStep }: { activeStep: string }) {
  const activeIndex = STEPS.findIndex(s => s.key === activeStep);
  
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
      <h2 style={{ fontSize: "36px", fontWeight: 700, marginBottom: "8px", background: "linear-gradient(135deg, #6366f1, #d946ef)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        AI Agents at Work
      </h2>
      <p style={{ color: "#64748b", marginBottom: "40px" }}>5 specialized agents collaborating on your roadmap</p>
      
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "40px" }}>
        {STEPS.slice(1, 6).map((step, idx) => (
          <div key={step.key} style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: idx < activeIndex - 1 ? "#10b981" : idx === activeIndex - 1 ? "#6366f1" : "rgba(255,255,255,0.1)",
            boxShadow: idx === activeIndex - 1 ? "0 0 20px #6366f1" : "none",
            transition: "all 0.3s ease"
          }} />
        ))}
      </div>
      
      <div style={{
        width: "120px",
        height: "120px",
        margin: "0 auto 32px",
        background: "linear-gradient(135deg, #1a1f35, #0b0f19)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "48px",
        boxShadow: "0 0 60px rgba(99, 102, 241, 0.4)",
        animation: "pulse 2s ease-in-out infinite"
      }}>
        🧠
      </div>
      
      <div style={{ fontSize: "24px", fontWeight: 600, color: "#f1f5f9", marginBottom: "8px" }}>
        {STEPS[activeIndex]?.icon} {STEPS[activeIndex]?.label}
      </div>
      <div style={{ color: "#64748b" }}>{STEPS[activeIndex]?.subtext}</div>
      
      <div style={{ marginTop: "40px" }}>
        <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${((activeIndex + 1) / STEPS.length) * 100}%`,
            background: "linear-gradient(90deg, #6366f1, #d946ef)",
            borderRadius: "3px",
            transition: "width 0.5s ease"
          }} />
        </div>
      </div>
      
      <style>{`
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      `}</style>
    </div>
  );
}

function App() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState<string>("analyzing");
  const [error, setError] = useState<string | null>(null);
  const [showAngryPopup, setShowAngryPopup] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ field: string; message: string }[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  useParticles();

  const handleSubmit = useCallback(async (data: {
    careerGoal: string; currentSkills: string; gpa: number; interests: string; provider: "openai" | "anthropic" | "minimax";
  }) => {
    console.log("1. handleSubmit called with:", data);
    const errors = validateForm({
      careerGoal: data.careerGoal,
      currentSkills: data.currentSkills,
      gpa: String(data.gpa),
      interests: data.interests
    });
    console.log("2. Validation errors:", errors.length);
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowAngryPopup(true);
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setIsGenerating(true);
    setError(null);
    setRoadmap(null);
    setActiveStep("analyzing");

    try {
      console.log("3. Starting fetch to /api/generate-roadmap");
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: abortRef.current.signal
      });
      console.log("4. Response received, status:", response.status);

      if (!response.ok) throw new Error("Server error: " + response.status);
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let timeoutId: ReturnType<typeof setTimeout> | undefined;

      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error("Request timeout - generation took too long")), 120000);
      });

      const readStream = async () => {
        let resultData: Roadmap | null = null;
        try {
          while (true) {
            console.log("5. Reading stream...");
            const { done, value } = await reader.read();
            if (done) { console.log("6. Stream done"); break; }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const event = JSON.parse(line.slice(6));
                  console.log("7. Event:", event.type, event.key);
                  if (event.type === "done") {
                    resultData = event.data as Roadmap;
                    console.log("8. Done event with data!");
                    break;
                  } else if (event.type === "error") {
                    const serverError = new Error(event.error || "Generation failed");
                    console.error("Server error:", serverError.message);
                    throw serverError;
                  } else if (event.key) {
                    setActiveStep(event.key);
                  }
                } catch (e) {
                  const err = e as Error;
                  if (err.message && (err.message.includes("Please provide") || err.message.includes("Please enter") || err.message.includes("Fake") || err.message.includes("not real"))) {
                    throw e;
                  }
                  if (err.name === "AbortError") {
                    throw e;
                  }
                  console.error("Parse error:", err.message || err);
                }
              }
            }
            if (resultData) break;
          }
        } catch (e) {
          if ((e as Error).name !== "AbortError" && !String(e).includes("already finished")) {
            console.error("Stream error:", e);
          }
        }
        return resultData;
      };

      try {
        const result = await Promise.race([readStream(), timeoutPromise]);
        console.log("9. Result:", result ? "got data" : "no data");
        if (result) {
          setRoadmap(result);
        }
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
      setIsGenerating(false);
    } catch (err) {
      console.error("10. Error:", err);
      if ((err as Error).name !== "AbortError") {
        setError((err as Error).message);
        setIsGenerating(false);
      }
    }
  }, []);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  if (isGenerating) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at 30% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), #0b0f19"
      }}>
        <ParticleBackground />
        <ProgressView activeStep={activeStep} />
      </div>
    );
  }

  if (roadmap) {
    return (
      <div style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(139, 92, 246, 0.06) 0%, transparent 50%), #0b0f19", minHeight: "100vh" }}>
        <ParticleBackground />
        <RoadmapView roadmap={roadmap} />
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "40px 20px",
      background: "radial-gradient(ellipse at 30% 30%, rgba(99, 102, 241, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), #0b0f19",
      minHeight: "100vh"
    }}>
      <ParticleBackground />
      <header style={{ textAlign: "center", marginBottom: "48px" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px", animation: "float 3s ease-in-out infinite" }}>🎓</div>
        <h1 style={{ fontSize: "52px", fontWeight: 800, marginBottom: "12px", background: "linear-gradient(135deg, #6366f1, #d946ef, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Academic GPS
        </h1>
        <p style={{ fontSize: "18px", color: "#94a3b8" }}>AI-Powered Career Navigation Platform</p>
        <p style={{ fontSize: "13px", color: "#64748b", marginTop: "8px" }}>Powered by 5 specialized AI agents + real web search + YouTube tutorials</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ padding: "28px", background: "rgba(15, 20, 30, 0.9)", backdropFilter: "blur(20px)", borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <ProfileForm onSubmit={handleSubmit} isLoading={isGenerating} />
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "12px" }}>
          {[
            { icon: "📚", title: "Course Agent", desc: "Finds courses + YouTube tutorials" },
            { icon: "🎯", title: "Skill Agent", desc: "Identifies gaps + learning videos" },
            { icon: "📜", title: "Cert Agent", desc: "Plans certs + prep resources" },
            { icon: "🔬", title: "Research Agent", desc: "Finds research opportunities" },
            { icon: "💼", title: "Internship Agent", desc: "Targets companies + interviews" }
          ].map((agent, i) => (
            <div key={i} style={{
              padding: "16px 20px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              gap: "14px"
            }}>
              <span style={{ fontSize: "28px" }}>{agent.icon}</span>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#f1f5f9" }}>{agent.title}</div>
                <div style={{ fontSize: "12px", color: "#64748b" }}>{agent.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <Toast message={error} emoji="⚠️" onClose={() => setError(null)} />
      )}

      {showAngryPopup && (
        <AngryPopup errors={validationErrors} onClose={() => setShowAngryPopup(false)} />
      )}

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>
    </div>
  );
}

export default App;
