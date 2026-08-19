import { useState, useEffect } from "react";

const SCENES = [
  {
    id: "scene-1",
    name: "CYBER DOWNTOWN",
    location: "METROPOLIS SECTOR 01 • NIGHTFALL",
    imageUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1920&q=80",
    accentColor: "#38bdf8",
  },
  {
    id: "scene-2",
    name: "GOLDEN HOUR SKIES",
    location: "COASTAL DISTRICT • PACIFIC BOULEVARD",
    imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1920&q=80",
    accentColor: "#fbbf24",
  },
  {
    id: "scene-3",
    name: "FINANCIAL HIGH-RISE",
    location: "EXECUTIVE PLAZA • TOWER 08",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80",
    accentColor: "#34d399",
  },
  {
    id: "scene-4",
    name: "NEON HORIZON",
    location: "UPTOWN DISTRICT • MIDNIGHT EXPRESS",
    imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1920&q=80",
    accentColor: "#c084fc",
  },
];

const LOADING_TIPS = [
  "ENCRYPTING 256-BIT PERSONAL LEDGER...",
  "CALIBRATING REAL-TIME SPEND VELOCITY...",
  "SYNCING RECENT TRANSACTIONS & TELEMETRY...",
  "INITIALIZING SMART CATEGORY CLASSIFIER...",
  "ESTABLISHING SECURE VAULT HANDSHAKE...",
];

const GtaLoadingBackground = () => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [currentTipIdx, setCurrentTipIdx] = useState(0);

  // Preload images
  useEffect(() => {
    SCENES.forEach((scene) => {
      const img = new Image();
      img.src = scene.imageUrl;
    });
  }, []);

  // Cycle scenes every 7 seconds with Ken Burns crossfades
  useEffect(() => {
    const sceneInterval = setInterval(() => {
      setCurrentSceneIdx((prev) => (prev + 1) % SCENES.length);
    }, 7000);

    const tipInterval = setInterval(() => {
      setCurrentTipIdx((prev) => (prev + 1) % LOADING_TIPS.length);
    }, 3500);

    return () => {
      clearInterval(sceneInterval);
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div className="gta-loading-bg-wrapper" aria-hidden="true">
      {/* Real Photographic Imagery with Ken Burns Zoom & Color Grading */}
      {SCENES.map((scene, idx) => {
        const isActive = idx === currentSceneIdx;
        return (
          <div
            key={scene.id}
            className={`gta-scene-slide ${isActive ? "active" : ""}`}
          >
            <img
              src={scene.imageUrl}
              alt={scene.name}
              className="gta-scene-img"
              loading="eager"
            />
            {/* Cinematic Gradient Tint Overlay */}
            <div className="gta-scene-color-grade" />
          </div>
        );
      })}

      {/* Cinematic Vignette & Scanline Overlays */}
      <div className="gta-cinematic-vignette" />
      <div className="gta-scanlines-overlay" />

      {/* GTA-Style Top Scene Telemetry Tag */}
      <div className="gta-scene-tag">
        <span className="gta-scene-tag-badge">● LIVE SECTOR</span>
        <span className="gta-scene-tag-title">{SCENES[currentSceneIdx].name}</span>
        <span className="gta-scene-tag-loc">{SCENES[currentSceneIdx].location}</span>
      </div>

      {/* GTA-Style Bottom Loading Spinner & Telemetry Ticker */}
      <div className="gta-bottom-ticker">
        <div
          className="gta-spinner-ring"
          style={{
            borderColor: `${SCENES[currentSceneIdx].accentColor} transparent ${SCENES[currentSceneIdx].accentColor} transparent`,
          }}
        />
        <div className="gta-ticker-text">
          <span className="gta-ticker-headline">EXPENSELENS TELEMETRY</span>
          <span className="gta-ticker-msg">{LOADING_TIPS[currentTipIdx]}</span>
        </div>
      </div>
    </div>
  );
};

export default GtaLoadingBackground;
