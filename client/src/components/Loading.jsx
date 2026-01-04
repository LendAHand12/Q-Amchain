import React from 'react';

/**
 * Premium Loading Component
 * @param {string} text - Optional text to display below the spinner
 * @param {boolean} fullScreen - If true, show as a fixed full-screen overlay
 * @param {string} className - Additional classes for customization
 */
export default function Loading({ text = "Loading...", fullScreen = false, className = "" }) {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="relative w-16 h-16">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
        
        {/* Spinning Gradient Ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-brand-red border-r-brand-red rounded-full animate-spin"></div>
        
        {/* Core Dot */}
        <div className="absolute inset-[35%] bg-brand-red/30 rounded-full animate-pulse-subtle"></div>
      </div>
      
      {text && (
        <p className="text-gray-400 font-medium tracking-wide animate-pulse-subtle">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#1E1E1E]/80 backdrop-blur-sm flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
