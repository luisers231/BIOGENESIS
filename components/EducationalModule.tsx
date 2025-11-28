import React, { useState, useEffect } from 'react';
import { ThemeId, ActivityItem, ActivityType, QuizQuestion, Topic } from '../types';
import { generateDefinitions, generateQuiz } from '../services/geminiService';
import { FuturisticButton, GlassCard, SectionTitle } from './Layout';
import { Loader2, Check, X, RotateCcw } from 'lucide-react';

interface ModuleProps {
  topic: Topic;
  onBack: () => void;
}

export const EducationalModule: React.FC<ModuleProps> = ({ topic, onBack }) => {
  const [activeTab, setActiveTab] = useState<'LEARN' | 'ACTIVITIES' | 'QUIZ'>('LEARN');
  
  return (
    <div className="w-full max-w-6xl mx-auto p-4 min-h-screen pb-20">
      <div className="flex justify-between items-center mb-6">
        <FuturisticButton onClick={onBack} variant="secondary">← Volver al Menú</FuturisticButton>
        <div className="flex gap-4">
          <FuturisticButton onClick={() => setActiveTab('LEARN')} variant={activeTab === 'LEARN' ? 'primary' : 'secondary'}>Aprender</FuturisticButton>
          <FuturisticButton onClick={() => setActiveTab('ACTIVITIES')} variant={activeTab === 'ACTIVITIES' ? 'primary' : 'secondary'}>Actividades (10)</FuturisticButton>
          <FuturisticButton onClick={() => setActiveTab('QUIZ')} variant={activeTab === 'QUIZ' ? 'primary' : 'secondary'}>Quiz (20)</FuturisticButton>
        </div>
      </div>

      <SectionTitle title={topic.title} subtitle={topic.description} />

      {activeTab === 'LEARN' && <LearnView topicId={topic.id} />}
      {activeTab === 'ACTIVITIES' && <ActivitiesHub topicId={topic.id} />}
      {activeTab === 'QUIZ' && <QuizRunner topicId={topic.id} />}
    </div>
  );
};

// --- Subcomponents ---

const LearnView: React.FC<{ topicId: ThemeId }> = ({ topicId }) => {
  const [definitions, setDefinitions] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await generateDefinitions(topicId);
      setDefinitions(data);
      setLoading(false);
    };
    load();
  }, [topicId]);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-neon-blue w-12 h-12" /></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {definitions.map((def, idx) => (
        <GlassCard key={idx} className="hover:border-neon-blue transition-colors">
          <h3 className="text-xl font-display text-neon-green mb-2">{def.question}</h3>
          <p className="text-gray-300 leading-relaxed">{def.answer}</p>
        </GlassCard>
      ))}
    </div>
  );
};

const ActivitiesHub: React.FC<{ topicId: ThemeId }> = ({ topicId }) => {
  const [currentActivity, setCurrentActivity] = useState<number | null>(null);
  
  // We simulate 10 activities by varying content generation or logic
  const activitiesList = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Actividad ${i + 1}: ${i % 2 === 0 ? 'Flashcards de Conceptos' : 'Emparejar Términos'}`,
    type: i % 2 === 0 ? ActivityType.FLASHCARDS : ActivityType.MATCHING
  }));

  if (currentActivity !== null) {
    const activity = activitiesList[currentActivity - 1];
    return (
      <div className="animate-fade-in">
        <div className="mb-4">
           <FuturisticButton onClick={() => setCurrentActivity(null)} variant="secondary">← Lista de Actividades</FuturisticButton>
        </div>
        <h3 className="text-2xl font-display text-white mb-6">{activity.name}</h3>
        {activity.type === ActivityType.FLASHCARDS ? (
          <FlashcardGame topicId={topicId} seed={currentActivity} />
        ) : (
          <MatchingGame topicId={topicId} seed={currentActivity} />
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activitiesList.map((act) => (
        <GlassCard key={act.id} className="relative overflow-hidden group hover:bg-white/5 transition-all">
          <div className="absolute top-0 left-0 w-1 h-full bg-neon-purple group-hover:bg-neon-blue transition-colors"></div>
          <h4 className="text-xl font-bold text-white mb-2">{act.name}</h4>
          <p className="text-sm text-gray-400 mb-4">Refuerza tus conocimientos con esta actividad interactiva.</p>
          <FuturisticButton onClick={() => setCurrentActivity(act.id)}>Iniciar</FuturisticButton>
        </GlassCard>
      ))}
    </div>
  );
};

const FlashcardGame: React.FC<{ topicId: ThemeId; seed: number }> = ({ topicId, seed }) => {
  const [cards, setCards] = useState<ActivityItem[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
        setLoading(true);
        // In real app, seed would change the prompt slightly
        const data = await generateDefinitions(topicId); 
        setCards(data);
        setLoading(false);
    };
    load();
  }, [topicId, seed]);

  if (loading) return <div className="p-10 text-center text-neon-blue">Generando actividad con IA...</div>;
  if (cards.length === 0) return <div>No data</div>;

  const current = cards[index];

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div 
        onClick={() => setFlipped(!flipped)}
        className="cursor-pointer w-full max-w-lg h-64 perspective-1000"
      >
        <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-[#1a2333] to-[#0d121d] border border-neon-blue/30 rounded-2xl flex items-center justify-center p-8 text-center shadow-[0_0_30px_rgba(0,243,255,0.1)]">
             <div>
                <span className="text-neon-blue text-sm uppercase tracking-widest mb-2 block">Concepto</span>
                <h3 className="text-3xl font-display text-white">{current.question}</h3>
                <p className="text-gray-500 text-xs mt-4">(Click para revelar)</p>
             </div>
          </div>
          {/* Back */}
          <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-[#2a1a33] to-[#150d1d] border border-neon-purple/30 rounded-2xl flex items-center justify-center p-8 text-center" style={{ transform: 'rotateY(180deg)' }}>
             <div>
                <span className="text-neon-purple text-sm uppercase tracking-widest mb-2 block">Definición</span>
                <p className="text-xl text-gray-200">{current.answer}</p>
             </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 mt-8">
        <FuturisticButton onClick={() => { setFlipped(false); setIndex((i) => (i > 0 ? i - 1 : cards.length - 1)); }} variant="secondary">Anterior</FuturisticButton>
        <span className="text-white flex items-center">{index + 1} / {cards.length}</span>
        <FuturisticButton onClick={() => { setFlipped(false); setIndex((i) => (i < cards.length - 1 ? i + 1 : 0)); }}>Siguiente</FuturisticButton>
      </div>
    </div>
  );
};

const MatchingGame: React.FC<{ topicId: ThemeId; seed: number }> = ({ topicId, seed }) => {
    // Simplified Matching: Select Term -> Select Definition
    const [items, setItems] = useState<{id: string, text: string, type: 'Q'|'A', pairId: string}[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [matched, setMatched] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await generateDefinitions(topicId);
            // Take 5 random
            const subset = data.slice(0, 5);
            let gameItems = [];
            subset.forEach(d => {
                gameItems.push({ id: d.id + '-q', text: d.question, type: 'Q', pairId: d.id });
                gameItems.push({ id: d.id + '-a', text: d.answer, type: 'A', pairId: d.id });
            });
            // Shuffle
            gameItems.sort(() => Math.random() - 0.5);
            setItems(gameItems as any);
            setLoading(false);
        };
        load();
    }, [topicId, seed]);

    const handleSelect = (id: string, pairId: string) => {
        if (selected === id) {
            setSelected(null);
            return;
        }
        if (!selected) {
            setSelected(id);
        } else {
            // Check match
            const selectedItem = items.find(i => i.id === selected);
            if (selectedItem && selectedItem.pairId === pairId && selectedItem.id !== id) {
                setMatched(prev => new Set(prev).add(pairId));
            }
            setSelected(null);
        }
    };

    if (loading) return <div className="text-center text-neon-green">Preparando laboratorio...</div>;

    if (matched.size === items.length / 2) {
        return <div className="text-center p-10"><h2 className="text-4xl text-neon-green mb-4">¡Excelente!</h2><FuturisticButton onClick={() => setMatched(new Set())}>Reiniciar</FuturisticButton></div>
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            {items.map(item => {
                const isMatched = matched.has(item.pairId);
                const isSelected = selected === item.id;
                if (isMatched) return null;
                return (
                    <div 
                        key={item.id}
                        onClick={() => handleSelect(item.id, item.pairId)}
                        className={`p-4 rounded border cursor-pointer transition-all ${isSelected ? 'bg-neon-blue text-black border-neon-blue' : 'bg-black/40 border-gray-700 hover:border-white'}`}
                    >
                        {item.text}
                    </div>
                )
            })}
        </div>
    )
}

const QuizRunner: React.FC<{ topicId: ThemeId }> = ({ topicId }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean|null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await generateQuiz(topicId, 20);
      setQuestions(data);
      setLoading(false);
    };
    load();
  }, [topicId]);

  const handleAnswer = (idx: number) => {
    const isCorrect = idx === questions[current].correctIndex;
    if (isCorrect) setScore(s => s + 1);
    setLastAnswerCorrect(isCorrect);
    
    setTimeout(() => {
        setLastAnswerCorrect(null);
        if (current < questions.length - 1) {
            setCurrent(c => c + 1);
        } else {
            setFinished(true);
        }
    }, 1500);
  };

  if (loading) return <div className="text-center p-20 text-neon-blue font-display animate-pulse">Generando Cuestionario de Inteligencia Artificial...</div>;
  if (questions.length === 0) return <div>Error cargando quiz.</div>;

  if (finished) {
    return (
      <GlassCard className="text-center py-20">
        <h2 className="text-5xl font-display text-white mb-4">Resultado</h2>
        <div className="text-8xl font-bold text-neon-blue mb-8">{score} / {questions.length}</div>
        <p className="text-xl text-gray-400 mb-8">{score > 15 ? '¡Excelente Dominio!' : 'Sigue practicando.'}</p>
        <FuturisticButton onClick={() => window.location.reload()}>Finalizar</FuturisticButton>
      </GlassCard>
    );
  }

  const q = questions[current];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between text-neon-blue font-display mb-4">
        <span>Pregunta {current + 1} / {questions.length}</span>
        <span>Puntaje: {score}</span>
      </div>
      <GlassCard className="mb-6 min-h-[200px] flex items-center justify-center">
        <h3 className="text-2xl text-center font-bold text-white">{q.question}</h3>
      </GlassCard>

      <div className="grid gap-4">
        {q.options.map((opt, idx) => {
            let colorClass = "hover:bg-white/10 border-gray-600";
            if (lastAnswerCorrect !== null) {
                if (idx === q.correctIndex) colorClass = "bg-neon-green text-black border-neon-green";
                else if (lastAnswerCorrect === false && idx !== q.correctIndex) colorClass = "opacity-50";
            }
            return (
                <button
                    key={idx}
                    disabled={lastAnswerCorrect !== null}
                    onClick={() => handleAnswer(idx)}
                    className={`p-4 rounded-lg border text-left transition-all ${colorClass}`}
                >
                    {opt}
                </button>
            )
        })}
      </div>
      {lastAnswerCorrect !== null && (
          <div className={`mt-4 text-center font-bold ${lastAnswerCorrect ? 'text-neon-green' : 'text-neon-red'}`}>
              {lastAnswerCorrect ? '¡CORRECTO!' : `INCORRECTO - ${q.explanation}`}
          </div>
      )}
    </div>
  );
};