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

  // Day/Night mode logic (6 AM to 6 PM is Day)
  const isNight = hours < 6 || hours >= 18;

  // Smooth continuous rotation for hands
  const secondAngle = (seconds + milliseconds / 1000) * 6;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const hourAngle = ((hours % 12) + minutes / 60) * 30;

  // Date formatting
  const weekday = time.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const month = time.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = time.getDate();

  // Theme colors
  const bgColor = isNight ? 'bg-[#121212]' : 'bg-[#E8E8E8]';
  const clockBg = isNight ? 'bg-[#151515]' : 'bg-[#FAFAFA]';
  const clockBorder = isNight ? 'border-[#2a2a2a]' : 'border-[#FFFFFF]';
  const textColor = isNight ? '#FFFFFF' : '#111111';
  const mutedTextColor = isNight ? '#888888' : '#777777';
  const tickColor = isNight ? '#555555' : '#CCCCCC';
  const shadowColor = isNight ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.15)';
  const handShadow = isNight ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';

  return (
    <div className={`min-h-screen transition-colors duration-1000 flex flex-col items-center justify-center p-4 sm:p-8 font-sans ${bgColor}`}>
      {/* Physical Object Container */}
      <div className="relative group w-full max-w-[min(90vw,480px)] aspect-square">
        {/* Ambient Shadow */}
        <div className={`absolute -inset-4 blur-3xl rounded-[4rem] transition-colors duration-1000 ${isNight ? 'bg-black/40' : 'bg-black/5'}`} />
        {/* Desk Shadow */}
        <div className={`absolute -bottom-8 sm:-bottom-12 left-1/2 -translate-x-1/2 w-[85%] h-12 sm:h-16 blur-2xl rounded-[100%] transition-colors duration-1000 ${isNight ? 'bg-black/60' : 'bg-black/20'}`} />

        {/* Clock Hardware (Squircle) */}
        <div className={`absolute inset-0 ${clockBg} rounded-[22%] shadow-[0_20px_50px_${shadowColor},inset_0_2px_4px_rgba(255,255,255,0.15),inset_0_-4px_8px_rgba(0,0,0,0.2)] border ${clockBorder} flex items-center justify-center overflow-hidden transition-colors duration-1000`}>
          
          {/* Glass Glare Top */}
          <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none z-20" />

          {/* Inner Bezel Depth */}
          <div className={`absolute inset-3 rounded-[20%] shadow-[inset_0_4px_25px_${shadowColor}] border ${isNight ? 'border-black/50' : 'border-black/5'} pointer-events-none z-20 transition-colors duration-1000`} />

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
                  stroke={isHour ? textColor : tickColor}
                  strokeWidth={isHour ? "4" : "2"}
                  strokeLinecap="round"
                  transform={`rotate(${angle}, 200, 200)`}
                  className="transition-colors duration-1000"
                />
              );
            })}

            {/* Numbers */}
            {Array.from({ length: 12 }).map((_, i) => {
              const num = i === 0 ? 12 : i;
              const isEight = num === 8;
              const displayChar = isEight ? 'B' : num;
              const angle = i * 30;
              const rad = (angle - 90) * (Math.PI / 180);
              const x = 200 + 115 * Math.cos(rad);
              const y = 200 + 115 * Math.sin(rad);
              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  fill={isEight ? '#E02020' : textColor}
                  fontSize="26"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="tracking-tighter transition-colors duration-1000"
                >
                  {displayChar}
                </text>
              );
            })}

            {/* Complications (Date/Day) */}
            <text x="200" y="135" fill={mutedTextColor} fontSize="14" fontWeight="500" letterSpacing="4" textAnchor="middle" className="transition-colors duration-1000">
              {weekday}
            </text>
            <text x="200" y="275" fill={mutedTextColor} fontSize="16" fontWeight="600" letterSpacing="2" textAnchor="middle" className="transition-colors duration-1000">
              {month} {day}
            </text>

            {/* Hands */}
            
            {/* Hour Hand Shadow */}
            <line x1="200" y1="200" x2="200" y2="100" stroke={handShadow} strokeWidth="12" strokeLinecap="round" transform={`rotate(${hourAngle}, 203, 203)`} className="transition-colors duration-1000" />
            {/* Hour Hand */}
            <line x1="200" y1="200" x2="200" y2="100" stroke={textColor} strokeWidth="12" strokeLinecap="round" transform={`rotate(${hourAngle}, 200, 200)`} className="transition-colors duration-1000" />

            {/* Minute Hand Shadow */}
            <line x1="200" y1="200" x2="200" y2="60" stroke={handShadow} strokeWidth="8" strokeLinecap="round" transform={`rotate(${minuteAngle}, 204, 204)`} className="transition-colors duration-1000" />
            {/* Minute Hand */}
            <line x1="200" y1="200" x2="200" y2="60" stroke={textColor} strokeWidth="8" strokeLinecap="round" transform={`rotate(${minuteAngle}, 200, 200)`} className="transition-colors duration-1000" />

            {/* Second Hand Shadow */}
            <g transform={`rotate(${secondAngle}, 205, 205)`}>
              <line x1="200" y1="240" x2="200" y2="40" stroke={handShadow} strokeWidth="3" strokeLinecap="round" className="transition-colors duration-1000" />
              <circle cx="200" cy="240" r="8" fill={handShadow} className="transition-colors duration-1000" />
            </g>
            
            {/* Second Hand (Braun Yellow) */}
            <g transform={`rotate(${secondAngle}, 200, 200)`}>
              <line x1="200" y1="240" x2="200" y2="40" stroke="#FFCC00" strokeWidth="3" strokeLinecap="round" />
              <circle cx="200" cy="200" r="5" fill="#FFCC00" />
              {/* Counterweight */}
              <circle cx="200" cy="240" r="8" fill={clockBg} stroke="#FFCC00" strokeWidth="3" className="transition-colors duration-1000" />
            </g>
            
            {/* Center Pin */}
            <circle cx="200" cy="200" r="2" fill={clockBg} className="transition-colors duration-1000" />
          </svg>
        </div>
      </div>
    </div>
  );
}
