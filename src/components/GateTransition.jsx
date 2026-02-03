// GateTransition.jsx
import React, { useEffect, useState } from 'react';
import './GateTransition.css';

const GateTransition = ({ onComplete, isSuccess = true }) => {
  const [phase, setPhase] = useState('init');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('scanning'), 50);
    const timer2 = setTimeout(() => setPhase('aligning'), 800);
    const timer3 = setTimeout(() => setPhase('locking'), 2000);
    
    if (isSuccess) {
      // Success flow - show LOCKED and complete
      const timer4 = setTimeout(() => setPhase('locked'), 2600);
      const timer5 = setTimeout(() => {
        if (onComplete) onComplete();
      }, 3200);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
      };
    } else {
      // Failure flow - show DENIED and shake
      const timer4 = setTimeout(() => setPhase('denied'), 2600);
      const timer5 = setTimeout(() => {
        if (onComplete) onComplete();
      }, 4200); // Extra time for shake animation

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
      };
    }
  }, [onComplete, isSuccess]);

  return (
    <div className={`gate-transition-overlay ${phase === 'denied' ? 'shake-overlay' : ''}`}>
      <div className="gate-background-grid"></div>
      
      <div className="gate-transition-container">
        <div className={`ring-system phase-${phase} ${!isSuccess && phase === 'denied' ? 'error-rings' : ''}`}>
          {/* Outer rotating rings */}
          <div className="ring-group outer">
            <div className="ring ring-1">
              <div className="ring-segment seg-1"></div>
              <div className="ring-segment seg-2"></div>
              <div className="ring-segment seg-3"></div>
              <div className="ring-segment seg-4"></div>
            </div>
            <div className="ring ring-2">
              <div className="ring-notch n1"></div>
              <div className="ring-notch n2"></div>
              <div className="ring-notch n3"></div>
            </div>
          </div>

          {/* Mid rotating rings */}
          <div className="ring-group mid">
            <div className="ring ring-3">
              <div className="ring-segment seg-1"></div>
              <div className="ring-segment seg-2"></div>
              <div className="ring-segment seg-3"></div>
            </div>
            <div className="ring ring-4">
              <div className="ring-tick t1"></div>
              <div className="ring-tick t2"></div>
              <div className="ring-tick t3"></div>
              <div className="ring-tick t4"></div>
              <div className="ring-tick t5"></div>
              <div className="ring-tick t6"></div>
            </div>
          </div>

          {/* Inner rotating rings */}
          <div className="ring-group inner">
            <div className="ring ring-5">
              <div className="ring-segment seg-1"></div>
              <div className="ring-segment seg-2"></div>
            </div>
            <div className="ring ring-6"></div>
          </div>

          {/* Core */}
          <div className="core-system">
            <div className="core-ring"></div>
            <div className="core-center"></div>
            <div className="core-dot"></div>
          </div>
        </div>

        {/* Scanning beams */}
        <div className={`scan-system phase-${phase}`}>
          <div className="scan-beam beam-1"></div>
          <div className="scan-beam beam-2"></div>
          <div className="scan-beam beam-3"></div>
        </div>

        {/* HUD elements */}
        <div className={`hud-system phase-${phase}`}>
          <div className="hud-corner corner-tl"></div>
          <div className="hud-corner corner-tr"></div>
          <div className="hud-corner corner-bl"></div>
          <div className="hud-corner corner-br"></div>
          
          <div className="hud-line line-h1"></div>
          <div className="hud-line line-h2"></div>
          <div className="hud-line line-v1"></div>
          <div className="hud-line line-v2"></div>
        </div>

        {/* Lock indicators */}
        <div className={`lock-system phase-${phase} ${!isSuccess && phase === 'denied' ? 'error-lock' : ''}`}>
          <div className="lock-bracket bracket-tl"></div>
          <div className="lock-bracket bracket-tr"></div>
          <div className="lock-bracket bracket-bl"></div>
          <div className="lock-bracket bracket-br"></div>
        </div>

        {/* Energy waves */}
        <div className={`energy-system phase-${phase}`}>
          <div className="energy-wave wave-1"></div>
          <div className="energy-wave wave-2"></div>
          <div className="energy-wave wave-3"></div>
        </div>

        {/* Text overlay */}
        <div className={`status-text phase-${phase} ${!isSuccess && phase === 'denied' ? 'error-text' : ''}`}>
          <div className="status-line">GATE SYSTEM</div>
          <div className="status-line status-main">
            {phase === 'init' && 'INITIALIZING'}
            {phase === 'scanning' && 'SCANNING'}
            {phase === 'aligning' && 'ALIGNING'}
            {phase === 'locking' && 'LOCKING'}
            {phase === 'locked' && 'ACCESS GRANTED'}
            {phase === 'denied' && 'ACCESS DENIED'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GateTransition;