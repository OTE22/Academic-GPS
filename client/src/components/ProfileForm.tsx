import { useState } from "react";

interface Props {
  onSubmit: (data: { careerGoal: string; currentSkills: string; gpa: number; interests: string; provider: "openai" | "anthropic" | "minimax" }) => void;
  isLoading: boolean;
}

export function ProfileForm({ onSubmit, isLoading }: Props) {
  const [careerGoal, setCareerGoal] = useState("");
  const [currentSkills, setCurrentSkills] = useState("");
  const [gpa, setGpa] = useState("");
  const [interests, setInterests] = useState("");
  const [provider, setProvider] = useState<"openai" | "anthropic" | "minimax">("openai");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ careerGoal, currentSkills, gpa: parseFloat(gpa), interests, provider });
  };

  return (
    <form onSubmit={handleSubmit} className="card glass fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "8px" }}>Student Profile</h2>
      
      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-secondary)", fontSize: "14px" }}>
          Career Goal
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="e.g., Machine Learning Engineer at a Tech Company"
          value={careerGoal}
          onChange={(e) => setCareerGoal(e.target.value)}
          required
        />
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-secondary)", fontSize: "14px" }}>
          Current Skills (comma-separated)
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="e.g., Python, Basic Statistics, Linear Algebra"
          value={currentSkills}
          onChange={(e) => setCurrentSkills(e.target.value)}
          required
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-secondary)", fontSize: "14px" }}>
            Current GPA
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="4"
            className="input-field"
            placeholder="3.5"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            required
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-secondary)", fontSize: "14px" }}>
            LLM Provider
          </label>
          <select
            className="input-field"
            value={provider}
            onChange={(e) => setProvider(e.target.value as typeof provider)}
          >
            <option value="openai">OpenAI (GPT-4o-mini)</option>
            <option value="anthropic">Anthropic (Claude 3.5)</option>
            <option value="minimax">MiniMax M2</option>
          </select>
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-secondary)", fontSize: "14px" }}>
          Interests
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="e.g., AI Ethics, Distributed Systems, Research"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn-primary" disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Career Roadmap"}
      </button>
    </form>
  );
}
