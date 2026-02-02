import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Gate() {
  const [phrase, setPhrase] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false); // ✅ NEW
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (phrase.trim().toLowerCase() === "jarvis") {
      setError(false);
      setSuccess(true);

      sessionStorage.setItem("jarvis-auth", "true");

      // ⏳ cinematic delay before entering your dimension
      setTimeout(() => {
        navigate("/jarvis");
      }, 1600);
    } else {
      setError(true);
      setSuccess(false);
    }
  }

  return (
    <div className="gate-root">
      <div className="arc-core" />

      <div className="gate-panel">
        <div className="gate-eyebrow">// SYSTEM ACCESS</div>

        <h1 className="gate-title">
          <span className="dim">Kishore’s</span>
          <br />
          <span className="accent">JARVIS</span>
        </h1>

        <div className="gate-sub">Awaiting authorization phrase</div>

        <form className="gate-form" onSubmit={handleSubmit}>
          <input
            className={`gate-input ${
              error ? "error" : success ? "success" : ""
            }`}
            placeholder="enter the phrase"
            value={phrase}
            disabled={success} // 🔒 lock input once accepted
            onChange={(e) => {
              setPhrase(e.target.value);
              setError(false);
            }}
            autoFocus
          />

          {error && (
            <div className="gate-error">
              ACCESS DENIED
            </div>
          )}

          {success && (
            <div className="gate-success">
              WELCOME, BOSS
            </div>
          )}

          <button className="gate-btn" type="submit" disabled={success}>
            {success ? "ACCESS GRANTED" : "AUTHENTICATE"}
          </button>
        </form>
      </div>
    </div>
  );
}
