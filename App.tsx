import React, { useState } from 'react';
import { ThemeId, TOPICS, GameMode } from './types';
import { Header, FuturisticButton, GlassCard } from './components/Layout';
import { EducationalModule } from './components/EducationalModule';
import { ArcadeHub } from './components/Arcade';
import { GalileanosGame } from './components/Galileanos';

const App = () => {
  const [view, setView] = useState<GameMode>('NONE');
  const [selectedTopicId, setSelectedTopicId] = useState<ThemeId | null>(null);

  const selectedTopic = TOPICS.find(t => t.id === selectedTopicId);

  const handleTopicSelect = (id: ThemeId) => {
    setSelectedTopicId(id);
    setView('LEARN');
  };

  const renderContent = () => {
    if (view === 'GALILEANOS') {
      return <GalileanosGame onExit={() => setView('NONE')} />;
    }

    if (view === 'ARCADE') {
      return <ArcadeHub onBack={() => setView('NONE')} />;
    }

    if (selectedTopic && view !== 'NONE') {
      return (
        <EducationalModule 
          topic={selectedTopic} 
          onBack={() => { setSelectedTopicId(null); setView('NONE'); }} 
        />
      );
    }

    // Default: Home / Menu
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-5xl md:text-7xl font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-neon-blue to-neon-purple mb-6 drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
            EXPLORA EL ORIGEN
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Una plataforma interactiva avanzada para comprender la evolución de la vida en la Tierra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {TOPICS.map((topic) => (
            <GlassCard key={topic.id} className="group hover:bg-white/5 transition-all cursor-pointer border-transparent hover:border-neon-green/50 hover:shadow-[0_0_30px_rgba(10,255,0,0.1)]">
              <div onClick={() => handleTopicSelect(topic.id)} className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-1 bg-neon-green mb-4 group-hover:w-full transition-all duration-500"></div>
                  <h3 className="text-2xl font-display text-white mb-2">{topic.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-3">{topic.description}</p>
                </div>
                <div className="mt-6 flex justify-end">
                  <span className="text-neon-green text-sm uppercase tracking-widest group-hover:translate-x-2 transition-transform">Acceder →</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-12">
          <h3 className="text-2xl font-display text-center text-white mb-8">ZONA DE JUEGOS & RETOS</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <FuturisticButton onClick={() => setView('ARCADE')} className="min-w-[200px] h-16 text-lg">
              ARCADE (Ahorcado / TicTacToe)
            </FuturisticButton>
            <FuturisticButton onClick={() => setView('GALILEANOS')} variant="secondary" className="min-w-[200px] h-16 text-lg">
              100 GALILEANOS DICEN
            </FuturisticButton>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050b14] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#111827] via-[#050b14] to-black text-white font-sans selection:bg-neon-blue selection:text-black">
      <Header onHome={() => { setView('NONE'); setSelectedTopicId(null); }} />
      <main className="relative z-10">
        {renderContent()}
      </main>
      
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </div>
  );
};

export default App;