
import React from 'react';

interface ClockProps {
  hour: number;
  minute: number;
  size?: number;
}

const Clock: React.FC<ClockProps> = ({ hour, minute, size = 120 }) => {
  // Ensure hour is within a 12-hour format for calculation
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  const hourAngle = (displayHour + minute / 60) * 30;
  const minuteAngle = minute * 6;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-label={`Clock showing ${hour}:${minute < 10 ? '0' : ''}${minute}`}>
      {/* Clock Face */}
      <circle cx="50" cy="50" r="48" fill="#f7fafc" stroke="#cbd5e0" strokeWidth="3" />
      <circle cx="50" cy="50" r="4" fill="#4a5568" />

      {/* Numbers */}
      <text x="50" y="18" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="bold" fill="#2d3748">12</text>
      <text x="85" y="50" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="bold" fill="#2d3748">3</text>
      <text x="50" y="82" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="bold" fill="#2d3748">6</text>
      <text x="15" y="50" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="bold" fill="#2d3748">9</text>

      {/* Hour Hand */}
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="28"
        stroke="#4a5568"
        strokeWidth="5"
        strokeLinecap="round"
        transform={`rotate(${hourAngle} 50 50)`}
      />

      {/* Minute Hand */}
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="15"
        stroke="#718096"
        strokeWidth="3"
        strokeLinecap="round"
        transform={`rotate(${minuteAngle} 50 50)`}
      />
    </svg>
  );
};

export default Clock;
