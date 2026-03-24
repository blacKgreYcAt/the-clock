import { useState, useEffect } from 'react';

export default function App() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let animationFrameId: number;
    const update = () => {
      setTime(new Date());
      animationFrameId = requestAnimationFrame(update);
    };
    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  // Smooth continuous rotation for hands
  const secondAngle = (seconds + milliseconds / 1000) * 6;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const hourAngle = ((hours % 12) + minutes / 60) * 30;

  // Date formatting
  const weekday = time.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const month = time.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const day = time.getDate();
  const year = time.getFullYear();

  const digitalHours = hours.toString().padStart(2, '0');
  const digitalMinutes = minutes.toString().padStart(2, '0');
  const digitalSeconds = seconds.toString().padStart(2, '0');

  return (
    <div className="min-h-screen bg-[#E8E8E8] flex flex-col items-center justify-center p-8 font-sans selection:bg-yellow-400/30">
      {/* Physical Object Container */}
      <div className="relative group">
        {/* Ambient Shadow */}
        <div className="absolute -inset-4 bg-black/5 blur-3xl rounded-[4rem] transition-opacity duration-1000" />
        {/* Desk Shadow */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[85%] h-16 bg-black/20 blur-2xl rounded-[100%]" />

        {/* Clock Hardware (Squircle) */}
        <div className="relative w-[85vw] max-w-[480px] aspect-square bg-[#151515] rounded-[22%] shadow-[0_20px_50px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.15),inset_0_-4px_8px_rgba(0,0,0,0.6)] border border-[#2a2a2a] flex items-center justify-center overflow-hidden">
          
          {/* Glass Glare Top */}
          <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none z-20" />

          {/* Inner Bezel Depth */}
          <div className="absolute inset-3 rounded-[20%] shadow-[inset_0_4px_25px_rgba(0,0,0,0.9)] border border-black/50 pointer-events-none z-20" />

          {/* SVG Clock Face */}
          <svg width="100%" height="100%" viewBox="0 0 400 400" className="relative z-10 drop-shadow-xl">
            {/* Ticks */}
            {Array.from({ length: 60 }).map((_, i) => {
              const isHour = i % 5 === 0;
              const angle = i * 6;
              return (
                <line
                  key={i}
                  x1="200"
                  y1={isHour ? "35" : "42"}
                  x2="200"
                  y2="50"
                  stroke={isHour ? "#ffffff" : "#555555"}
                  strokeWidth={isHour ? "4" : "2"}
                  strokeLinecap="round"
                  transform={`rotate(${angle}, 200, 200)`}
                />
              );
            })}

            {/* Numbers */}
            {Array.from({ length: 12 }).map((_, i) => {
              const num = i === 0 ? 12 : i;
              const angle = i * 30;
              const rad = (angle - 90) * (Math.PI / 180);
              const x = 200 + 115 * Math.cos(rad);
              const y = 200 + 115 * Math.sin(rad);
              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  fill="#ffffff"
                  fontSize="26"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="tracking-tighter"
                >
                  {num}
                </text>
              );
            })}

            {/* Complications (Date/Day) */}
            <text x="200" y="135" fill="#888888" fontSize="14" fontWeight="500" letterSpacing="4" textAnchor="middle">
              {weekday}
            </text>
            <text x="200" y="275" fill="#888888" fontSize="16" fontWeight="600" letterSpacing="2" textAnchor="middle">
              {month} {day}, {year}
            </text>

            {/* Hands */}
            
            {/* Hour Hand Shadow */}
            <line x1="200" y1="200" x2="200" y2="100" stroke="rgba(0,0,0,0.5)" strokeWidth="12" strokeLinecap="round" transform={`rotate(${hourAngle}, 203, 203)`} />
            {/* Hour Hand */}
            <line x1="200" y1="200" x2="200" y2="100" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" transform={`rotate(${hourAngle}, 200, 200)`} />

            {/* Minute Hand Shadow */}
            <line x1="200" y1="200" x2="200" y2="60" stroke="rgba(0,0,0,0.5)" strokeWidth="8" strokeLinecap="round" transform={`rotate(${minuteAngle}, 204, 204)`} />
            {/* Minute Hand */}
            <line x1="200" y1="200" x2="200" y2="60" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" transform={`rotate(${minuteAngle}, 200, 200)`} />

            {/* Second Hand Shadow */}
            <g transform={`rotate(${secondAngle}, 205, 205)`}>
              <line x1="200" y1="240" x2="200" y2="40" stroke="rgba(0,0,0,0.4)" strokeWidth="3" strokeLinecap="round" />
              <circle cx="200" cy="240" r="8" fill="rgba(0,0,0,0.4)" />
            </g>
            
            {/* Second Hand (Braun Yellow) */}
            <g transform={`rotate(${secondAngle}, 200, 200)`}>
              <line x1="200" y1="240" x2="200" y2="40" stroke="#FFCC00" strokeWidth="3" strokeLinecap="round" />
              <circle cx="200" cy="200" r="5" fill="#FFCC00" />
              {/* Counterweight */}
              <circle cx="200" cy="240" r="8" fill="#151515" stroke="#FFCC00" strokeWidth="3" />
            </g>
            
            {/* Center Pin */}
            <circle cx="200" cy="200" r="2" fill="#151515" />
          </svg>
        </div>
      </div>

      {/* Digital Readout */}
      <div className="mt-16 flex flex-col items-center gap-2">
        <div className="text-5xl font-light tracking-tight text-[#333]">
          {digitalHours}:{digitalMinutes}
          <span className="text-2xl font-medium text-[#FFCC00] ml-2">{digitalSeconds}</span>
        </div>
        <div className="text-sm font-medium tracking-widest text-[#888] uppercase">
          {weekday} &bull; {month} {day}, {year}
        </div>
      </div>
    </div>
  );
}
