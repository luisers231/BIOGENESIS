import React, { useState, useEffect } from 'react';
import { ArcadeGame, ThemeId } from '../types';
import { generateHangmanWord, generateQuiz } from '../services/geminiService';
import { FuturisticButton, GlassCard } from './Layout';

export const ArcadeHub: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [selectedGame, setSelectedGame] = useState<ArcadeGame['id'] | null>(null);

    const games: ArcadeGame[] = [
        { id: 'AHORCADO', name: 'Ahorcado Evolutivo' },
        { id: 'TIC_TAC_TOE', name: 'Gato Cuántico' },
        { id: 'JEOPARDY', name: 'Jeopardy Científico' }
    ];

    return (
        <div className="p-4 max-w-6xl mx-auto h-full min-h-screen">
            <div className="flex items-center gap-4 mb-8">
                <FuturisticButton onClick={() => selectedGame ? setSelectedGame(null) : onBack()} variant="secondary">
                    {selectedGame ? '← Menu Arcade' : '← Menu Principal'}
                </FuturisticButton>
                <h2 className="text-3xl font-display text-neon-purple">AREA RECREATIVA</h2>
            </div>

            {!selectedGame && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {games.map(g => (
                        <div key={g.id} onClick={() => setSelectedGame(g.id)} className="group cursor-pointer">
                            <div className="h-64 border border-gray-700 bg-black/40 rounded-xl flex items-center justify-center group-hover:border-neon-purple group-hover:shadow-[0_0_20px_rgba(188,19,254,0.4)] transition-all">
                                <h3 className="text-2xl font-display text-white group-hover:text-neon-purple">{g.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedGame === 'AHORCADO' && <Hangman />}
            {selectedGame === 'TIC_TAC_TOE' && <TicTacToe />}
            {selectedGame === 'JEOPARDY' && <Jeopardy />}
        </div>
    );
};

// --- Hangman ---
const Hangman = () => {
    const [word, setWord] = useState('');
    const [hint, setHint] = useState('');
    const [guesses, setGuesses] = useState<Set<string>>(new Set());
    const [mistakes, setMistakes] = useState(0);
    const [loading, setLoading] = useState(false);

    const init = async () => {
        setLoading(true);
        setGuesses(new Set());
        setMistakes(0);
        const data = await generateHangmanWord(ThemeId.EVOLUCION); // Default topic for arcade
        setWord(data.word.toUpperCase());
        setHint(data.hint);
        setLoading(false);
    };

    useEffect(() => { init(); }, []);

    const handleGuess = (letter: string) => {
        if (guesses.has(letter) || mistakes >= 6) return;
        setGuesses(prev => new Set(prev).add(letter));
        if (!word.includes(letter)) setMistakes(m => m + 1);
    };

    const isWon = word && word.split('').every(l => guesses.has(l));
    const isLost = mistakes >= 6;

    if (loading) return <div className="text-neon-purple animate-pulse">Cargando genoma...</div>;

    return (
        <div className="flex flex-col items-center">
            <div className="mb-8 text-xl text-neon-green">Pista: {hint}</div>
            
            {/* Draw Hangman (Simplified CSS representation) */}
            <div className="w-32 h-32 border-b-4 border-white mb-8 relative">
                <div className="absolute left-1/2 bottom-0 w-1 h-32 bg-white"></div>
                <div className="absolute left-1/2 top-0 w-20 h-1 bg-white"></div>
                <div className="absolute left-[calc(50%+80px)] top-0 w-1 h-8 bg-white"></div>
                {mistakes > 0 && <div className="absolute left-[calc(50%+70px)] top-8 w-6 h-6 rounded-full border-2 border-neon-red"></div>}
                {mistakes > 1 && <div className="absolute left-[calc(50%+80px)] top-14 w-1 h-10 bg-neon-red"></div>}
                {mistakes > 2 && <div className="absolute left-[calc(50%+80px)] top-16 w-6 h-1 bg-neon-red -translate-x-3 rotate-12"></div>}
                {mistakes > 3 && <div className="absolute left-[calc(50%+80px)] top-16 w-6 h-1 bg-neon-red rotate-[-12deg]"></div>}
                {mistakes > 4 && <div className="absolute left-[calc(50%+80px)] top-24 w-1 h-8 bg-neon-red -translate-x-2 rotate-12"></div>}
                {mistakes > 5 && <div className="absolute left-[calc(50%+80px)] top-24 w-1 h-8 bg-neon-red translate-x-2 rotate-[-12deg]"></div>}
            </div>

            <div className="flex gap-4 mb-8">
                {word.split('').map((l, i) => (
                    <div key={i} className="w-10 h-12 border-b-2 border-white flex items-center justify-center text-2xl font-bold">
                        {guesses.has(l) || isLost ? l : ''}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('').map(char => (
                    <button
                        key={char}
                        disabled={guesses.has(char) || isWon || isLost}
                        onClick={() => handleGuess(char)}
                        className={`w-10 h-10 border rounded ${guesses.has(char) ? 'opacity-20' : 'hover:bg-neon-purple hover:text-black'}`}
                    >
                        {char}
                    </button>
                ))}
            </div>

            {isWon && <div className="mt-8 text-4xl text-neon-green font-display">¡VICTORIA!</div>}
            {isLost && <div className="mt-8 text-4xl text-neon-red font-display">FALLO DEL SISTEMA</div>}
            {(isWon || isLost) && <div className="mt-4"><FuturisticButton onClick={init}>Reiniciar</FuturisticButton></div>}
        </div>
    );
};

// --- TicTacToe ---
const TicTacToe = () => {
    const [board, setBoard] = useState<(string|null)[]>(Array(9).fill(null));
    const [xTurn, setXTurn] = useState(true);
    const checkWinner = (squares: (string|null)[]) => {
        const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        for(let i=0; i<lines.length; i++) {
            const [a,b,c] = lines[i];
            if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
        }
        return null;
    };
    const winner = checkWinner(board);

    const handleClick = (i: number) => {
        if(winner || board[i]) return;
        const newBoard = [...board];
        newBoard[i] = xTurn ? 'X' : 'O';
        setBoard(newBoard);
        setXTurn(!xTurn);
    };

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-xl mb-4 text-gray-300">Turno: {xTurn ? 'X' : 'O'}</h3>
            <div className="grid grid-cols-3 gap-2 bg-neon-blue p-2 rounded-xl shadow-[0_0_30px_#00f3ff]">
                {board.map((cell, i) => (
                    <div 
                        key={i} 
                        onClick={() => handleClick(i)}
                        className="w-24 h-24 bg-black flex items-center justify-center text-6xl font-display cursor-pointer hover:bg-gray-900"
                    >
                        <span className={cell === 'X' ? 'text-neon-purple' : 'text-neon-green'}>{cell}</span>
                    </div>
                ))}
            </div>
            {winner && (
                <div className="mt-8 text-center">
                    <div className="text-4xl font-bold text-white mb-4">Ganador: {winner}</div>
                    <FuturisticButton onClick={() => setBoard(Array(9).fill(null))}>Reiniciar</FuturisticButton>
                </div>
            )}
        </div>
    );
};

// --- Jeopardy (Simplified) ---
const Jeopardy = () => {
    // In a full implementation, this would use API to fill grid
    const categories = ['Evolución', 'Células', 'Historia', 'Espacio'];
    const [activeQ, setActiveQ] = useState<{cat: string, points: number} | null>(null);
    const [completed, setCompleted] = useState<Set<string>>(new Set());

    const handleSelect = (cat: string, points: number) => {
        if(completed.has(`${cat}-${points}`)) return;
        setActiveQ({cat, points});
    };

    const handleAnswer = (correct: boolean) => {
        if (activeQ) {
            setCompleted(prev => new Set(prev).add(`${activeQ.cat}-${activeQ.points}`));
            setActiveQ(null);
        }
    };

    return (
        <div className="w-full">
            {activeQ ? (
                <GlassCard className="max-w-2xl mx-auto text-center py-20">
                    <h3 className="text-2xl text-neon-blue mb-4">{activeQ.cat} por {activeQ.points}</h3>
                    <p className="text-3xl text-white mb-10">¿Esta es una pregunta simulada sobre {activeQ.cat}?</p>
                    <div className="flex justify-center gap-4">
                        <FuturisticButton onClick={() => handleAnswer(true)} variant="primary">Correcto</FuturisticButton>
                        <FuturisticButton onClick={() => handleAnswer(false)} variant="danger">Incorrecto</FuturisticButton>
                    </div>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-4 gap-4">
                    {categories.map(cat => (
                        <div key={cat} className="text-center">
                            <div className="bg-neon-blue text-black font-bold p-4 rounded-t-lg mb-2">{cat}</div>
                            {[100, 200, 300, 400, 500].map(points => (
                                <div 
                                    key={points}
                                    onClick={() => handleSelect(cat, points)}
                                    className={`bg-black/50 border border-neon-blue/30 p-6 mb-2 rounded cursor-pointer hover:bg-neon-blue/20 transition-all ${completed.has(`${cat}-${points}`) ? 'opacity-20 pointer-events-none' : ''}`}
                                >
                                    <span className="text-2xl font-display text-neon-blue">${points}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};