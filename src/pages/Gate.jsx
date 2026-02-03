import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GateTransition from "../components/GateTransition";

export default function Gate() {
  const [phrase, setPhrase] = useState("");
  const [error, setError] = useState("");
  const [showTransition, setShowTransition] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (phrase.trim().toLowerCase() === "jarvis") {
      // Correct password
      setError("");
      setIsAuthorized(true);
      setShowTransition(true);
      
      // Play welcome sound
      const welcomeSound = new Audio("/sounds/welcome.mp3");
      welcomeSound.play().catch(err => console.log("Audio play failed:", err));
    } else {
      // Wrong password
      setIsAuthorized(false);
      setShowTransition(true);
      
      // Play access denied sound
      const deniedSound = new Audio("/sounds/access-denied.mp3");
      deniedSound.play().catch(err => console.log("Audio play failed:", err));
    }
  }

  function handleTransitionComplete() {
    setShowTransition(false);
    
    if (isAuthorized) {
      // Success - navigate to Jarvis
      sessionStorage.setItem("jarvis-auth", "true");
      navigate("/jarvis");
    } else {
      // Failure - show error and reset
      setError("ACCESS DENIED");
      setPhrase("");
    }
  }

  return (
    <>
      {showTransition && (
        <GateTransition 
          onComplete={handleTransitionComplete} 
          isSuccess={isAuthorized}
        />
      )}

      <div className="gate-root">
        {/* Animated background elements */}
        <div className="gate-bg-grid"></div>
        <div className="gate-bg-glow"></div>
        <div className="gate-scanline"></div>
        
        {/* Corner decorations */}
        <div className="gate-corner gate-corner-tl"></div>
        <div className="gate-corner gate-corner-tr"></div>
        <div className="gate-corner gate-corner-bl"></div>
        <div className="gate-corner gate-corner-br"></div>

        {/* Main content */}
        <div className="gate-content">
          <div className="gate-logo-container">
            <div className="gate-logo-ring"></div>
            <div className="gate-logo-ring gate-logo-ring-2"></div>
            <div className="gate-logo-center">J</div>
          </div>

          <h1 className="gate-title">
            <span className="gate-title-name">Kishore's</span>
            <span className="gate-title-jarvis">JARVIS</span>
          </h1>

          <div className="gate-subtitle">Just A Rather Very Intelligent System</div>

          <form onSubmit={handleSubmit} className="gate-form">
            <div className="gate-input-wrapper">
              <div className="gate-input-decoration"></div>
              <input
                className="gate-input"
                placeholder="ENTER AUTHORIZATION PHRASE"
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                autoFocus
                disabled={showTransition}
              />
              <div className="gate-input-line"></div>
            </div>
            
            <button 
              type="submit" 
              disabled={showTransition}
              className="gate-button"
            >
              <span className="gate-button-text">AUTHENTICATE</span>
              <div className="gate-button-glow"></div>
            </button>
          </form>

          {error && (
            <div className="gate-message gate-error">
              <div className="gate-error-icon">⚠</div>
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Floating particles */}
        <div className="gate-particles">
          <div className="gate-particle"></div>
          <div className="gate-particle"></div>
          <div className="gate-particle"></div>
          <div className="gate-particle"></div>
          <div className="gate-particle"></div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');

        .gate-root {
          position: fixed;
          inset: 0;
          background: #000000;
          background-image: 
            radial-gradient(circle at 20% 30%, rgba(0, 150, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(0, 255, 200, 0.08) 0%, transparent 50%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: 'Rajdhani', sans-serif;
        }

        /* Animated grid background */
        .gate-bg-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(0, 150, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 150, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
          pointer-events: none;
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        /* Pulsing glow */
        .gate-bg-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 800px;
          height: 800px;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(0, 150, 255, 0.15) 0%, transparent 70%);
          animation: pulse 4s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
        }

        /* Scanline effect */
        .gate-scanline {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0, 150, 255, 0.05) 50%,
            transparent 100%
          );
          height: 100px;
          animation: scan 8s linear infinite;
          pointer-events: none;
        }

        @keyframes scan {
          0% { transform: translateY(-100px); }
          100% { transform: translateY(100vh); }
        }

        /* Corner decorations */
        .gate-corner {
          position: absolute;
          width: 80px;
          height: 80px;
          border: 2px solid rgba(0, 150, 255, 0.4);
          pointer-events: none;
        }

        .gate-corner-tl {
          top: 30px;
          left: 30px;
          border-right: none;
          border-bottom: none;
          animation: cornerGlow 3s ease-in-out infinite;
        }

        .gate-corner-tr {
          top: 30px;
          right: 30px;
          border-left: none;
          border-bottom: none;
          animation: cornerGlow 3s ease-in-out infinite 0.75s;
        }

        .gate-corner-bl {
          bottom: 30px;
          left: 30px;
          border-right: none;
          border-top: none;
          animation: cornerGlow 3s ease-in-out infinite 1.5s;
        }

        .gate-corner-br {
          bottom: 30px;
          right: 30px;
          border-left: none;
          border-top: none;
          animation: cornerGlow 3s ease-in-out infinite 2.25s;
        }

        @keyframes cornerGlow {
          0%, 100% { 
            border-color: rgba(0, 150, 255, 0.4);
            box-shadow: 0 0 0 rgba(0, 150, 255, 0);
          }
          50% { 
            border-color: rgba(0, 200, 255, 0.9);
            box-shadow: 0 0 20px rgba(0, 150, 255, 0.4);
          }
        }

        /* Main content container */
        .gate-content {
          position: relative;
          z-index: 10;
          text-align: center;
          max-width: 600px;
          padding: 60px 40px;
          animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Logo */
        .gate-logo-container {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 40px;
        }

        .gate-logo-ring {
          position: absolute;
          inset: 0;
          border: 2px solid rgba(0, 200, 255, 0.6);
          border-radius: 50%;
          animation: rotateRing 10s linear infinite;
        }

        .gate-logo-ring-2 {
          border-color: rgba(0, 255, 200, 0.4);
          animation: rotateRing 15s linear infinite reverse;
          inset: 10px;
        }

        @keyframes rotateRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .gate-logo-center {
          position: absolute;
          inset: 20px;
          background: linear-gradient(135deg, #0096ff, #00ffc8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Orbitron', sans-serif;
          font-size: 48px;
          font-weight: 900;
          color: #000;
          box-shadow: 
            0 0 30px rgba(0, 150, 255, 0.6),
            inset 0 0 20px rgba(255, 255, 255, 0.2);
          animation: logoGlow 2s ease-in-out infinite;
        }

        @keyframes logoGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(0, 150, 255, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.2); }
          50% { box-shadow: 0 0 50px rgba(0, 200, 255, 0.9), inset 0 0 30px rgba(255, 255, 255, 0.3); }
        }

        /* Title */
        .gate-title {
          margin: 0 0 10px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .gate-title-name {
          font-family: 'Rajdhani', sans-serif;
          font-size: 24px;
          font-weight: 300;
          color: rgba(0, 200, 255, 0.7);
          letter-spacing: 4px;
          text-transform: uppercase;
        }

        .gate-title-jarvis {
          font-family: 'Orbitron', sans-serif;
          font-size: 64px;
          font-weight: 900;
          background: linear-gradient(135deg, #0096ff, #00ffc8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 8px;
          text-shadow: 0 0 40px rgba(0, 150, 255, 0.5);
          animation: titleGlow 3s ease-in-out infinite;
        }

        @keyframes titleGlow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }

        .gate-subtitle {
          font-size: 13px;
          font-weight: 400;
          color: rgba(0, 200, 255, 0.5);
          letter-spacing: 3px;
          margin-bottom: 50px;
          text-transform: uppercase;
        }

        /* Form */
        .gate-form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .gate-input-wrapper {
          position: relative;
        }

        .gate-input-decoration {
          position: absolute;
          top: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0, 200, 255, 0.5), transparent);
          animation: decorationSlide 3s ease-in-out infinite;
        }

        @keyframes decorationSlide {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .gate-input {
          width: 100%;
          padding: 20px 24px;
          background: rgba(0, 20, 40, 0.6);
          border: 1px solid rgba(0, 150, 255, 0.3);
          border-radius: 2px;
          color: #00ffc8;
          font-family: 'Rajdhani', sans-serif;
          font-size: 18px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          outline: none;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .gate-input::placeholder {
          color: rgba(0, 150, 255, 0.4);
          font-weight: 400;
          letter-spacing: 1px;
        }

        .gate-input:focus {
          border-color: rgba(0, 200, 255, 0.8);
          background: rgba(0, 30, 60, 0.8);
          box-shadow: 
            0 0 20px rgba(0, 150, 255, 0.2),
            inset 0 0 20px rgba(0, 150, 255, 0.1);
        }

        .gate-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .gate-input-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0, 200, 255, 0.8), transparent);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .gate-input:focus + .gate-input-line {
          transform: scaleX(1);
        }

        .gate-button {
          position: relative;
          padding: 18px 40px;
          background: transparent;
          border: 2px solid rgba(0, 200, 255, 0.6);
          border-radius: 2px;
          color: #00ffc8;
          font-family: 'Orbitron', sans-serif;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .gate-button:hover:not(:disabled) {
          border-color: #00ffc8;
          box-shadow: 
            0 0 30px rgba(0, 200, 255, 0.4),
            inset 0 0 20px rgba(0, 200, 255, 0.1);
          transform: translateY(-2px);
        }

        .gate-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .gate-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .gate-button-text {
          position: relative;
          z-index: 2;
        }

        .gate-button-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0, 150, 255, 0.2), rgba(0, 255, 200, 0.2));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gate-button:hover:not(:disabled) .gate-button-glow {
          opacity: 1;
        }

        /* Messages */
        .gate-message {
          margin-top: 30px;
          padding: 20px 30px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          font-family: 'Orbitron', sans-serif;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 2px;
          animation: messageSlideIn 0.4s ease-out;
        }

        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .gate-error {
          background: rgba(255, 0, 50, 0.1);
          border: 1px solid rgba(255, 0, 50, 0.5);
          color: #ff3366;
        }

        .gate-error-icon {
          font-size: 24px;
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .gate-welcome {
          background: rgba(0, 255, 150, 0.1);
          border: 1px solid rgba(0, 255, 150, 0.6);
          color: #00ffc8;
          box-shadow: 0 0 30px rgba(0, 255, 150, 0.2);
        }

        .gate-welcome-icon {
          font-size: 24px;
          animation: checkmark 0.6s ease-out;
        }

        @keyframes checkmark {
          0% { transform: scale(0) rotate(-45deg); }
          50% { transform: scale(1.2) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        /* Floating particles */
        .gate-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .gate-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(0, 200, 255, 0.6);
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 200, 255, 0.8);
          animation: float 15s linear infinite;
        }

        .gate-particle:nth-child(1) {
          left: 10%;
          animation-delay: 0s;
          animation-duration: 12s;
        }

        .gate-particle:nth-child(2) {
          left: 30%;
          animation-delay: 3s;
          animation-duration: 15s;
        }

        .gate-particle:nth-child(3) {
          left: 50%;
          animation-delay: 1s;
          animation-duration: 18s;
        }

        .gate-particle:nth-child(4) {
          left: 70%;
          animation-delay: 4s;
          animation-duration: 14s;
        }

        .gate-particle:nth-child(5) {
          left: 90%;
          animation-delay: 2s;
          animation-duration: 16s;
        }

        @keyframes float {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0;
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .gate-content {
            padding: 40px 20px;
          }

          .gate-logo-container {
            width: 100px;
            height: 100px;
            margin-bottom: 30px;
          }

          .gate-logo-center {
            font-size: 40px;
            inset: 15px;
          }

          .gate-title-name {
            font-size: 18px;
            letter-spacing: 3px;
          }

          .gate-title-jarvis {
            font-size: 48px;
            letter-spacing: 6px;
          }

          .gate-subtitle {
            font-size: 11px;
            margin-bottom: 40px;
          }

          .gate-input {
            padding: 16px 20px;
            font-size: 16px;
          }

          .gate-button {
            padding: 16px 32px;
            font-size: 14px;
            letter-spacing: 2px;
          }

          .gate-corner {
            width: 50px;
            height: 50px;
          }

          .gate-corner-tl,
          .gate-corner-tr {
            top: 20px;
          }

          .gate-corner-bl,
          .gate-corner-br {
            bottom: 20px;
          }

          .gate-corner-tl,
          .gate-corner-bl {
            left: 20px;
          }

          .gate-corner-tr,
          .gate-corner-br {
            right: 20px;
          }
        }
      `}</style>
    </>
  );
}