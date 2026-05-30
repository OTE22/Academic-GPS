import { useEffect, useState } from "react";

interface Props {
  probability: number;
}

export function SuccessGauge({ probability }: Props) {
  const [offset, setOffset] = useState(502);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const targetOffset = 502 - (probability / 100) * 502;
    let start = 502;
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setOffset(start - (start - targetOffset) * eased);
      setDisplayValue(Math.round(progress * probability));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [probability]);

  const getColor = (p: number) => {
    if (p >= 70) return "#10b981";
    if (p >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const color = getColor(probability);

  return (
    <div style={{
      position: "relative",
      width: "180px",
      height: "180px",
      margin: "0 auto"
    }}>
      <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="90"
          cy="90"
          r="75"
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="14"
        />
        <circle
          cx="90"
          cy="90"
          r="75"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray="502"
          strokeDashoffset={offset}
          style={{
            filter: `drop-shadow(0 0 10px ${color})`,
            transition: "stroke 0.5s ease"
          }}
        />
        <circle
          cx="90"
          cy="90"
          r="75"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="2"
          strokeDasharray="4 8"
        />
      </svg>
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          fontSize: "48px",
          fontWeight: 800,
          color: color,
          textShadow: `0 0 30px ${color}`,
          lineHeight: 1
        }}>
          {displayValue}%
        </div>
        <div style={{
          fontSize: "10px",
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginTop: "4px"
        }}>
          Success Rate
        </div>
      </div>
      <div style={{
        position: "absolute",
        bottom: "-8px",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "4px 12px",
        background: color,
        borderRadius: "20px",
        fontSize: "10px",
        fontWeight: 600,
        color: "#0b0f19",
        whiteSpace: "nowrap"
      }}>
        {probability >= 70 ? "🚀 Excellent" : probability >= 40 ? "💪 Good" : "⚡ Keep Learning"}
      </div>
    </div>
  );
}
