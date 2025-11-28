import React from 'react';

export const FuturisticButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  disabled?: boolean;
}> = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "relative px-6 py-2 font-display uppercase tracking-wider text-sm font-bold transition-all duration-300 clip-path-polygon disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-neon-blue/10 text-neon-blue border border-neon-blue hover:bg-neon-blue hover:text-black hover:shadow-[0_0_20px_rgba(0,243,255,0.5)]",
    secondary: "bg-neon-purple/10 text-neon-purple border border-neon-purple hover:bg-neon-purple hover:text-white hover:shadow-[0_0_20px_rgba(188,19,254,0.5)]",
    danger: "bg-neon-red/10 text-neon-red border border-neon-red hover:bg-neon-red hover:text-white hover:shadow-[0_0_20px_rgba(255,0,60,0.5)]",
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`glass-panel rounded-xl p-6 ${className}`}>
    {children}
  </div>
);

export const Header: React.FC<{ onHome: () => void }> = ({ onHome }) => (
  <header className="w-full h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#050b14]/90 backdrop-blur sticky top-0 z-50">
    <div className="flex items-center gap-2 cursor-pointer" onClick={onHome}>
      <div className="w-8 h-8 bg-neon-blue rounded-full flex items-center justify-center shadow-[0_0_15px_#00f3ff]">
        <span className="text-black font-bold text-lg">B</span>
      </div>
      <h1 className="text-2xl font-display text-white tracking-widest">
        BIO<span className="text-neon-blue">GENESIS</span>
      </h1>
    </div>
    <div className="text-xs text-gray-400 font-sans tracking-widest">
      ING. LUIS MUÑOZ SOTO
    </div>
  </header>
);

export const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-8 border-l-4 border-neon-blue pl-4">
    <h2 className="text-4xl font-display text-white mb-1 uppercase">{title}</h2>
    {subtitle && <p className="text-neon-blue font-sans text-lg tracking-wide">{subtitle}</p>}
  </div>
);