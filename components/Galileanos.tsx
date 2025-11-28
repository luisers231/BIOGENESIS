import React, { useState, useEffect } from 'react';
import { generateGalileanosQuestion } from '../services/geminiService';
import { FuturisticButton, GlassCard, SectionTitle } from './Layout';
import { GameShowQuestion } from '../types';

export const GalileanosGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [teamAScore, setTeamAScore] = useState(0);
    const [teamBScore, setTeamBScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState<GameShowQuestion | null>(null);
    const [loading, setLoading] = useState(false);
    const [strikes, setStrikes] = useState(0);
    const [turn, setTurn] = useState<'A' | 'B'>('A');
    const [topicInput, setTopicInput] = useState("Cientificos famosos");

    const loadQuestion = async () => {
        setLoading(true);
        const q = await generateGalileanosQuestion(topicInput);
        setCurrentQuestion(q);
        setStrikes(0);
        setLoading(false);
    };

    const revealAnswer = (idx: number) => {
        if (!currentQuestion) return;
        const newAnswers = [...currentQuestion.answers];
        if (newAnswers[idx].revealed) return;
        
        newAnswers[idx].revealed = true;
        
        // Add points
        const points = newAnswers[idx].points;
        if (turn === 'A') setTeamAScore(s => s + points);
        else setTeamBScore(s => s + points);

        setCurrentQuestion({ ...currentQuestion, answers: newAnswers });
    };

    const addStrike = () => {
        if (strikes < 3) setStrikes(s => s + 1);
        else {
            // Switch turn logic or end round could go here
            setStrikes(0);
            setTurn(t => t === 'A' ? 'B' : 'A');
        }
    };

    return (
        <div className="w-full h-full flex flex-col p-4 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <FuturisticButton onClick={onExit} variant="secondary">Salir</FuturisticButton>
                <div className="text-3xl font-display text-neon-blue animate-pulse">100 GALILEANOS DICEN</div>
                <div className="w-24"></div> 
            </div>

            <div className="flex justify-between items-end mb-8 px-10">
                <div className={`p-6 rounded-xl border-2 transition-all ${turn === 'A' ? 'border-neon-blue bg-neon-blue/10 scale-110 shadow-[0_0_30px_#00f3ff]' : 'border-gray-700 bg-black/40'}`}>
                    <h3 className="text-xl font-bold text-white mb-2">EQUIPO A</h3>
                    <div className="text-6xl font-display text-neon-blue">{teamAScore}</div>
                    <button onClick={() => setTurn('A')} className="text-xs mt-2 text-gray-400 hover:text-white">TURNO</button>
                </div>

                <div className="flex flex-col items-center gap-4">
                    {/* Strikes */}
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`w-12 h-12 flex items-center justify-center text-4xl font-bold border rounded ${i <= strikes ? 'bg-neon-red text-white border-neon-red shadow-[0_0_20px_red]' : 'bg-black border-gray-800 text-gray-800'}`}>
                                X
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`p-6 rounded-xl border-2 transition-all ${turn === 'B' ? 'border-neon-green bg-neon-green/10 scale-110 shadow-[0_0_30px_#0aff00]' : 'border-gray-700 bg-black/40'}`}>
                    <h3 className="text-xl font-bold text-white mb-2">EQUIPO B</h3>
                    <div className="text-6xl font-display text-neon-green">{teamBScore}</div>
                    <button onClick={() => setTurn('B')} className="text-xs mt-2 text-gray-400 hover:text-white">TURNO</button>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center">
                {!currentQuestion ? (
                    <div className="flex gap-4">
                        <input 
                            type="text" 
                            value={topicInput} 
                            onChange={(e) => setTopicInput(e.target.value)}
                            className="bg-black/50 border border-neon-blue text-white p-2 rounded w-64"
                            placeholder="Tema (ej. Evolución)"
                        />
                        <FuturisticButton onClick={loadQuestion} disabled={loading}>
                            {loading ? 'Consultando a 100 Galileanos...' : 'Nueva Ronda'}
                        </FuturisticButton>
                    </div>
                ) : (
                    <div className="w-full max-w-4xl">
                        <GlassCard className="mb-8 text-center py-6 border-neon-blue">
                            <h2 className="text-3xl font-bold text-white uppercase">{currentQuestion.question}</h2>
                        </GlassCard>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {currentQuestion.answers.map((ans, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => revealAnswer(idx)}
                                    className={`h-20 border rounded-lg flex items-center justify-between px-6 cursor-pointer overflow-hidden relative group`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 transition-transform duration-500 ${ans.revealed ? 'translate-x-0' : '-translate-x-full'}`}></div>
                                    <div className="relative z-10 w-full flex justify-between items-center">
                                        {ans.revealed ? (
                                            <>
                                                <span className="text-xl font-bold text-white uppercase">{ans.text}</span>
                                                <span className="text-2xl font-display text-neon-blue">{ans.points}</span>
                                            </>
                                        ) : (
                                            <div className="w-full flex justify-center">
                                                <div className="w-10 h-10 rounded-full border-2 border-gray-600 flex items-center justify-center text-gray-600 font-bold group-hover:border-white group-hover:text-white">
                                                    {idx + 1}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center gap-4">
                            <FuturisticButton onClick={addStrike} variant="danger" className="w-32">X (Strike)</FuturisticButton>
                            <FuturisticButton onClick={() => setCurrentQuestion(null)} variant="secondary">Siguiente Ronda</FuturisticButton>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};