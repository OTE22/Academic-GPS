import { useEffect } from "react";

interface ToastProps {
  message: string;
  emoji?: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, emoji = "⚠️", onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div style={{
      position: "fixed",
      top: "24px",
      right: "24px",
      zIndex: 3000,
      animation: "slideIn 0.3s ease",
      maxWidth: "400px"
    }}>
      <div style={{
        background: "linear-gradient(135deg, #1e1e2e, #2d2d44)",
        border: "1px solid rgba(239, 68, 68, 0.5)",
        borderRadius: "16px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(239, 68, 68, 0.2)",
      }}>
        <span style={{ fontSize: "28px" }}>{emoji}</span>
        <div style={{ flex: 1 }}>
          <p style={{
            margin: 0,
            fontSize: "14px",
            color: "#f1f5f9",
            lineHeight: 1.5
          }}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "none",
            borderRadius: "8px",
            width: "32px",
            height: "32px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94a3b8",
            fontSize: "16px",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.color = "#94a3b8";
          }}
        >
          ✕
        </button>
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
