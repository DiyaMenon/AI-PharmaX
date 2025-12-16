import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg 
    className={className} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Shield Shape */}
    <path 
      d="M50 95C50 95 90 75 90 30V15L50 5L10 15V30C10 75 50 95 50 95Z" 
      stroke="#38bdf8" 
      strokeWidth="4" 
      fill="#0f172a"
      strokeLinejoin="round"
    />
    
    {/* Cross Top */}
    <path 
      d="M50 20V35 M42.5 27.5H57.5" 
      stroke="#38bdf8" 
      strokeWidth="6" 
      strokeLinecap="round"
    />
    
    {/* Central Molecule Node */}
    <circle cx="50" cy="55" r="8" stroke="#38bdf8" strokeWidth="4" />
    
    {/* Connections */}
    <path d="M50 55L30 40" stroke="#38bdf8" strokeWidth="3" />
    <path d="M50 55L70 40" stroke="#38bdf8" strokeWidth="3" />
    <path d="M50 55L35 75" stroke="#38bdf8" strokeWidth="3" />
    <path d="M50 55L65 75" stroke="#38bdf8" strokeWidth="3" />
    
    {/* Outer Nodes */}
    <circle cx="30" cy="40" r="5" fill="#60a5fa" />
    <circle cx="70" cy="40" r="5" fill="#60a5fa" />
    <circle cx="35" cy="75" r="5" fill="#60a5fa" />
    <circle cx="65" cy="75" r="5" fill="#60a5fa" />
  </svg>
);