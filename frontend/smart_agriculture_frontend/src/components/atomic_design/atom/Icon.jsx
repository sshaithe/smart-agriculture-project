// Icon.jsx
import React from "react";

const Icon = ({ className = "" }) => {
  // Şimdilik placeholder; istersen buraya gerçek SVG path’lerini koyarız.
  return (
    <svg
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      {/* Örnek path */}
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};

export default Icon;
