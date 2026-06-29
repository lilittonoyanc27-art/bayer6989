import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, RotateCcw, Volume2, VolumeX, Info, 
  Check, X, Trophy, AlertCircle, Sparkles, ChevronRight,
  Clock, Award, Settings, CheckCircle2, XCircle, RefreshCw,
  HelpCircle, Star, Shuffle, BookOpen, ChevronLeft
} from 'lucide-react';

// ==========================================
// 1. DATA TYPES & INTERFACES
// ==========================================

interface Question {
  letter: string;      // The Spanish alphabet letter (A to Z + Ñ)
  promptArm: string;   // The Armenian prompt word
  choices: string[];   // Three options in Spanish (A, B, C)
  correctIndex: number;// Index of the correct choice (0, 1, or 2)
  details: string;     // Short explanation, e.g. "B — la casa"
  word: string;        // The correct Spanish word with article
}

interface QuestionState {
  status: 'unanswered' | 'correct' | 'incorrect' | 'skipped';
  attempts: number;
}

interface HighScore {
  score: number;
  timeRemaining: number;
  date: string;
  isPractice: boolean;
}

// ==========================================
// 2. QUESTIONS DATA (EXACTLY AS REQUESTED)
// ==========================================

const QUESTIONS: Question[] = [
  {
    letter: "A",
    promptArm: "տուն",
    choices: ["el casa", "la casa", "el mesa"],
    correctIndex: 1, // la casa (B)
    details: "B — la casa",
    word: "la casa"
  },
  {
    letter: "B",
    promptArm: "դպրոց",
    choices: ["la escuela", "el escuela", "la libro"],
    correctIndex: 0, // la escuela (A)
    details: "A — la escuela",
    word: "la escuela"
  },
  {
    letter: "C",
    promptArm: "գիրք",
    choices: ["la libro", "el libro", "el mesa"],
    correctIndex: 1, // el libro (B)
    details: "B — el libro",
    word: "el libro"
  },
  {
    letter: "D",
    promptArm: "սեղան",
    choices: ["el mesa", "la mesa", "la casa"],
    correctIndex: 1, // la mesa (B)
    details: "B — la mesa",
    word: "la mesa"
  },
  {
    letter: "E",
    promptArm: "աթոռ",
    choices: ["la silla", "el silla", "el puerta"],
    correctIndex: 0, // la silla (A)
    details: "A — la silla",
    word: "la silla"
  },
  {
    letter: "F",
    promptArm: "դուռ",
    choices: ["el puerta", "la puerta", "la libro"],
    correctIndex: 1, // la puerta (B)
    details: "B — la puerta",
    word: "la puerta"
  },
  {
    letter: "G",
    promptArm: "պատուհան",
    choices: ["la ventana", "el ventana", "la zapato"],
    correctIndex: 0, // la ventana (A)
    details: "A — la ventana",
    word: "la ventana"
  },
  {
    letter: "H",
    promptArm: "ջուր",
    choices: ["la agua", "el agua", "el leche"],
    correctIndex: 1, // el agua (B)
    details: "B — el agua",
    word: "el agua"
  },
  {
    letter: "I",
    promptArm: "հաց",
    choices: ["el pan", "la pan", "el agua"],
    correctIndex: 0, // el pan (A)
    details: "A — el pan",
    word: "el pan"
  },
  {
    letter: "J",
    promptArm: "կաթ",
    choices: ["el leche", "la leche", "la pan"],
    correctIndex: 1, // la leche (B)
    details: "B — la leche",
    word: "la leche"
  },
  {
    letter: "K",
    promptArm: "խնձոր",
    choices: ["la manzana", "el manzana", "el leche"],
    correctIndex: 0, // la manzana (A)
    details: "A — la manzana",
    word: "la manzana"
  },
  {
    letter: "L",
    promptArm: "բանան",
    choices: ["el plátano", "la plátano", "la agua"],
    correctIndex: 0, // el plátano (A)
    details: "A — el plátano",
    word: "el plátano"
  },
  {
    letter: "M",
    promptArm: "քաղաք",
    choices: ["la ciudad", "el ciudad", "el calle"],
    correctIndex: 0, // la ciudad (A)
    details: "A — la ciudad",
    word: "la ciudad"
  },
  {
    letter: "N",
    promptArm: "փողոց",
    choices: ["el calle", "la calle", "la ciudad"],
    correctIndex: 1, // la calle (B)
    details: "B — la calle",
    word: "la calle"
  },
  {
    letter: "Ñ",
    promptArm: "խանութ",
    choices: ["la tienda", "el tienda", "el ciudad"],
    correctIndex: 0, // la tienda (A)
    details: "A — la tienda",
    word: "la tienda"
  },
  {
    letter: "O",
    promptArm: "հիվանդանոց",
    choices: ["la hospital", "el hospital", "la farmacia"],
    correctIndex: 1, // el hospital (B)
    details: "B — el hospital",
    word: "el hospital"
  },
  {
    letter: "P",
    promptArm: "դեղատուն",
    choices: ["el farmacia", "la farmacia", "el tienda"],
    correctIndex: 1, // la farmacia (B)
    details: "B — la farmacia",
    word: "la farmacia"
  },
  {
    letter: "Q",
    promptArm: "ընտանիք",
    choices: ["el familia", "la familia", "el madre"],
    correctIndex: 1, // la familia (B)
    details: "B — la familia",
    word: "la familia"
  },
  {
    letter: "R",
    promptArm: "մայրիկ",
    choices: ["la madre", "el madre", "la padre"],
    correctIndex: 0, // la madre (A)
    details: "A — la madre",
    word: "la madre"
  },
  {
    letter: "S",
    promptArm: "հայրիկ",
    choices: ["la padre", "el padre", "el madre"],
    correctIndex: 1, // el padre (B)
    details: "B — el padre",
    word: "el padre"
  },
  {
    letter: "T",
    promptArm: "եղբայր",
    choices: ["la hermano", "el hermano", "la hermana"],
    correctIndex: 1, // el hermano (B)
    details: "B — el hermano",
    word: "el hermano"
  },
  {
    letter: "U",
    promptArm: "քույր",
    choices: ["el hermana", "la hermana", "el hermano"],
    correctIndex: 1, // la hermana (B)
    details: "B — la hermana",
    word: "la hermana"
  },
  {
    letter: "V",
    promptArm: "ընկեր տղա",
    choices: ["el amigo", "la amigo", "la amiga"],
    correctIndex: 0, // el amigo (A)
    details: "A — el amigo",
    word: "el amigo"
  },
  {
    letter: "W",
    promptArm: "ընկերուհի",
    choices: ["el amiga", "la amiga", "el amigo"],
    correctIndex: 1, // la amiga (B)
    details: "B — la amiga",
    word: "la amiga"
  },
  {
    letter: "X",
    promptArm: "ուսուցիչ",
    choices: ["el profesor", "la profesor", "la profesora"],
    correctIndex: 0, // el profesor (A)
    details: "A — el profesor",
    word: "el profesor"
  },
  {
    letter: "Y",
    promptArm: "ուսուցչուհի",
    choices: ["el profesora", "la profesora", "el profesor"],
    correctIndex: 1, // la profesora (B)
    details: "B — la profesora",
    word: "la profesora"
  },
  {
    letter: "Z",
    promptArm: "պայուսակ",
    choices: ["el mochila", "la mochila", "el silla"],
    correctIndex: 1, // la mochila (B)
    details: "B — la mochila",
    word: "la mochila"
  }
];

// Spanish alphabet letter array
const ALPHABET = QUESTIONS.map(q => q.letter);

// ==========================================
// 3. PURE JS SYNTHESIZER (WEB AUDIO API)
// ==========================================

class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {}

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playSuccess() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 -> E5 -> G5 -> C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.1, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.25);
      });
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playError() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.25);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playPasapalabra() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.22);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playTick() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  playVictory() {
    if (!this.enabled) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.08, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.35);
      });
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }
}

// ==========================================
// 4. MAIN REACT COMPONENT
// ==========================================

export default function App() {
  // Game state
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [qStates, setQStates] = useState<QuestionState[]>(() => 
    QUESTIONS.map(() => ({ status: 'unanswered', attempts: 0 }))
  );
  
  // Scoring & navigation
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  
  // Timers & settings
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [isPractice, setIsPractice] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  
  // UI States & Modals
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isAnimateNext, setIsAnimateNext] = useState<boolean>(false);
  const [correctHighlight, setCorrectHighlight] = useState<number | null>(null);
  
  // 3D Wheel drag/rotation states
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [radius, setRadius] = useState<number>(200);

  // Synth reference
  const synthRef = useRef<SoundEffects | null>(null);

  // Initialize Sound Effects and High Scores
  useEffect(() => {
    synthRef.current = new SoundEffects();
    // Load high scores
    const savedScores = localStorage.getItem('pasapalabra_high_scores');
    if (savedScores) {
      try {
        setHighScores(JSON.parse(savedScores));
      } catch (e) {
        console.error("Failed to parse high scores", e);
      }
    }
  }, []);

  // Sync sound settings
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.enabled = soundEnabled;
    }
  }, [soundEnabled]);

  // Adjust Rosco radius dynamically based on responsive size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setRadius(130);
      } else if (window.innerWidth < 1024) {
        setRadius(175);
      } else {
        setRadius(220);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Timer countdown hook
  useEffect(() => {
    if (gameState !== 'playing' || isPractice) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleGameOver(true);
          return 0;
        }
        // Play tick sound for final 10 seconds
        if (prev <= 11 && soundEnabled && synthRef.current) {
          synthRef.current.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, isPractice, soundEnabled]);

  // Handle TTS pronunciation of Spanish words
  const speakSpanish = (word: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'es-ES';
      utterance.rate = 0.85; // slightly slower for educational focus
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

  // Start a new game
  const handleStartGame = (practiceMode: boolean = false) => {
    setIsPractice(practiceMode);
    setQStates(QUESTIONS.map(() => ({ status: 'unanswered', attempts: 0 })));
    setActiveIndex(0);
    setRound(1);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setWrongCount(0);
    setTimeLeft(600);
    setSelectedChoice(null);
    setCorrectHighlight(null);
    setIsAnimateNext(false);
    setGameState('playing');
    if (synthRef.current) {
      synthRef.current.playPasapalabra();
    }
  };

  // Game over triggers
  const handleGameOver = (isTimeOut = false) => {
    setGameState('gameover');
    if (synthRef.current) {
      synthRef.current.playVictory();
    }

    // Calculate final score
    const finalAciertos = qStates.filter(q => q.status === 'correct').length;
    
    // Save high score
    const newScore: HighScore = {
      score: finalAciertos,
      timeRemaining: isPractice ? 0 : timeLeft,
      date: new Date().toLocaleDateString('hy-AM', { hour: '2-digit', minute: '2-digit' }),
      isPractice
    };

    setHighScores((prev) => {
      const updated = [newScore, ...prev].slice(0, 5); // Keep top 5
      localStorage.setItem('pasapalabra_high_scores', JSON.stringify(updated));
      return updated;
    });
  };

  // Main navigation algorithm: find the next unanswered/skipped letter
  const moveToNextLetter = (currentStates: QuestionState[]) => {
    let nextIndex = (activeIndex + 1) % 27;
    let checkedCount = 0;
    let roundIncremented = false;

    while (checkedCount < 27) {
      const status = currentStates[nextIndex].status;
      if (status === 'unanswered' || status === 'skipped') {
        if (nextIndex < activeIndex) {
          roundIncremented = true;
        }
        setActiveIndex(nextIndex);
        if (roundIncremented) {
          setRound(prev => prev + 1);
        }
        return;
      }
      nextIndex = (nextIndex + 1) % 27;
      checkedCount++;
    }

    // If no unanswered or skipped questions are found, all questions are answered!
    handleGameOver();
  };

  // User makes a choice
  const handleAnswerSelection = (choiceIndex: number) => {
    if (selectedChoice !== null || isAnimateNext) return;
    
    setSelectedChoice(choiceIndex);
    const question = QUESTIONS[activeIndex];
    const isCorrect = choiceIndex === question.correctIndex;
    
    // Speak word
    speakSpanish(question.word);

    // Update state
    const nextStates = [...qStates];
    nextStates[activeIndex] = {
      status: isCorrect ? 'correct' : 'incorrect',
      attempts: nextStates[activeIndex].attempts + 1
    };
    setQStates(nextStates);

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > maxStreak) setMaxStreak(newStreak);
        return newStreak;
      });
      if (synthRef.current) synthRef.current.playSuccess();
    } else {
      setWrongCount(prev => prev + 1);
      setStreak(0);
      setCorrectHighlight(question.correctIndex);
      if (synthRef.current) synthRef.current.playError();
    }

    // Animation transition delay
    setIsAnimateNext(true);
    setTimeout(() => {
      setSelectedChoice(null);
      setCorrectHighlight(null);
      setIsAnimateNext(false);
      moveToNextLetter(nextStates);
    }, 1200);
  };

  // Skip letter (Pasapalabra!)
  const handlePasapalabra = () => {
    if (selectedChoice !== null || isAnimateNext) return;

    if (synthRef.current) {
      synthRef.current.playPasapalabra();
    }

    const nextStates = [...qStates];
    nextStates[activeIndex] = {
      ...nextStates[activeIndex],
      status: 'skipped'
    };
    setQStates(nextStates);
    setStreak(0);

    // Slide directly to the next
    moveToNextLetter(nextStates);
  };

  // Drag handlers for manual 3D wheel spinning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    setDragOffset(prev => prev + deltaX * 0.4);
    setDragStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Smoothly snap back to alignment
    setTimeout(() => {
      setDragOffset(0);
    }, 800);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - dragStartX;
    setDragOffset(prev => prev + deltaX * 0.4);
    setDragStartX(e.touches[0].clientX);
  };

  // Helper colors for rosco letters
  const getLetterBadgeStyle = (status: string, isActive: boolean) => {
    if (isActive) {
      return "letter-node active select-none font-display font-black z-50";
    }

    switch (status) {
      case 'correct':
        return "letter-node correct select-none font-display font-black";
      case 'incorrect':
        return "letter-node incorrect select-none font-display font-black";
      case 'skipped':
        return "letter-node skipped select-none font-display font-black";
      default:
        return "letter-node select-none font-display font-black";
    }
  };

  // Compute 3D rotation of the whole Rosco wheel
  const angleStep = 360 / 27;
  const targetRotation = -activeIndex * angleStep + dragOffset;

  return (
    <div id="pasapalabra_container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden antialiased selection:bg-blue-500 selection:text-white">
      
      {/* Dynamic Background Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1022_1px,transparent_1px),linear-gradient(to_bottom,#0c1022_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* ==========================================
          HEADER SECTION
         ========================================== */}
      <header id="pasapalabra_header" className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
            <span className="text-2xl font-black">P</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight uppercase">
              Pasapalabra <span className="text-blue-500">3D</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">ARMENIAN ⇄ SPANISH EDITION</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Controls */}
          <button 
            id="toggle_sound_btn"
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className={`p-2 rounded-xl border transition-all ${soundEnabled ? 'bg-slate-900 border-indigo-800 text-indigo-400 hover:text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
            title="Ձայնային էֆեկտներ (Sound Effects)"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 h-5" />}
          </button>
          
          <button 
            id="toggle_voice_btn"
            onClick={() => setVoiceEnabled(!voiceEnabled)} 
            className={`p-2 rounded-xl border transition-all ${voiceEnabled ? 'bg-slate-900 border-sky-800 text-sky-400 hover:text-sky-300' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
            title="Արտասանություն (Spanish Voice Pronunciation)"
          >
            <BookOpen className="w-4 h-4 sm:w-5 h-5" />
          </button>

          {/* Info Button */}
          <button 
            id="show_help_btn"
            onClick={() => setShowHelp(true)} 
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-900 transition-all"
            title="Կանոններ (Game Rules)"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 h-5" />
          </button>

          {/* Settings Button */}
          <button 
            id="show_settings_btn"
            onClick={() => setShowSettings(true)} 
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-900 transition-all"
            title="Կարգավորումներ (Settings)"
          >
            <Settings className="w-4 h-4 sm:w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ==========================================
          MAIN GAME SCREEN ROUTING
         ========================================== */}
      <main id="pasapalabra_main" className="flex-1 max-w-7xl w-full mx-auto p-4 flex flex-col items-center justify-center relative z-10">
        
        {/* ==========================================
            STATE A: MENU (START SCREEN)
           ========================================== */}
        {gameState === 'menu' && (
          <motion.div 
            id="menu_view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl text-center space-y-8 py-10 px-6 glass-panel rounded-3xl relative shadow-2xl"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-mono font-bold py-1.5 px-4 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/20">
              Արմենիա ⇆ Իսպանիա
            </div>

            <div className="space-y-3 pt-4">
              <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight leading-none uppercase">
                ԳՈՒՇԱԿԻՐ <span className="gradient-text font-black">ԲԱՌԸ</span> ԵՎ <span className="gradient-text font-black">ՍԵՌԸ</span>
              </h2>
              <p className="text-slate-400 max-w-md mx-auto text-sm sm:text-base">
                Սովորիր իսպաներենի գոյականների արտիկլները հայտնի <span className="text-blue-400 font-semibold font-display">Pasapalabra</span> խաղի 3D ձևաչափով։
              </p>
            </div>

            {/* 3D Visualizer Demonstration */}
            <div className="py-6 flex justify-center overflow-hidden">
              <div className="w-40 h-40 relative rosco-container preserve-3d animate-float">
                {/* Visualizing a miniature 3D rotating rings */}
                <div 
                  className="w-full h-full rounded-full border-4 border-dashed border-blue-500/20 flex items-center justify-center"
                  style={{ transform: 'rotateX(60deg) rotateY(20deg)' }}
                >
                  <div className="w-24 h-24 rounded-full border-2 border-blue-400 flex items-center justify-center bg-blue-950/80 shadow-[0_0_20px_rgba(59,130,241,0.4)]">
                    <span className="font-display font-black text-4xl text-blue-300">A</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selection modes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <button 
                id="start_standard_game_btn"
                onClick={() => handleStartGame(false)}
                className="group relative flex flex-col items-center justify-center p-5 bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border border-blue-400/30 rounded-2xl text-white shadow-xl hover:shadow-blue-500/30 active:scale-98 transition-all cursor-pointer"
              >
                <div className="absolute top-2 right-2 bg-blue-950/50 py-0.5 px-2 rounded-md text-[10px] font-mono tracking-wider font-bold">10 ՐՈՊԵ</div>
                <Play className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-display font-bold text-lg">Ստանդարտ Խաղ</span>
                <span className="text-xs text-blue-200 mt-1">Ժամանակի սահմանափակմամբ</span>
              </button>

              <button 
                id="start_practice_game_btn"
                onClick={() => handleStartGame(true)}
                className="group flex flex-col items-center justify-center p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-100 hover:border-blue-500/40 active:scale-98 transition-all cursor-pointer"
              >
                <RefreshCw className="w-8 h-8 mb-2 text-blue-400 group-hover:rotate-45 transition-transform" />
                <span className="font-display font-bold text-lg">Մարզումներ</span>
                <span className="text-xs text-slate-400 mt-1">Առանց շտապելու, ուսումնական</span>
              </button>
            </div>

            {/* Instructions list short */}
            <div className="border-t border-slate-800/60 pt-6 max-w-md mx-auto text-left space-y-2">
              <h4 className="font-display font-semibold text-xs text-blue-400 uppercase tracking-widest flex items-center gap-1.5 justify-center sm:justify-start">
                <Info className="w-3.5 h-3.5" /> Խաղի Կանոնները համառոտ՝
              </h4>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside px-1">
                <li>Պատասխանեք <strong className="text-slate-300">27 հարցի</strong>՝ ընտրելով ճիշտ տարբերակը (A, B կամ C)։</li>
                <li>Բոլոր բառերը ունեն ճիշտ արտիկլ (սեռ)՝ <code className="text-blue-300 bg-blue-950/50 py-0.5 px-1 rounded font-mono">el</code> կամ <code className="text-blue-300 bg-blue-950/50 py-0.5 px-1 rounded font-mono">la</code>:</li>
                <li>Դժվարանալու դեպքում սեղմեք <strong className="text-amber-400">PASAPALABRA</strong>՝ բաց թողնելու և հաջորդ փուլում պատասխանելու համար:</li>
              </ul>
            </div>

            {/* High Scores View */}
            {highScores.length > 0 && (
              <div className="border-t border-slate-800/60 pt-6 max-w-md mx-auto">
                <h4 className="font-display font-semibold text-xs text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1 mb-3">
                  <Trophy className="w-3.5 h-3.5 text-amber-500 animate-bounce" /> Լավագույն Փորձերը
                </h4>
                <div className="space-y-1.5 text-xs text-slate-400">
                  {highScores.map((score, index) => (
                    <div key={index} className="flex justify-between items-center py-1 px-3 bg-slate-950/30 rounded-lg border border-slate-900">
                      <span className="flex items-center gap-1">
                        <span className="text-slate-500">#{index+1}</span>
                        <span className="font-semibold text-emerald-400">{score.score} / 27 ճիշտ</span>
                        {score.isPractice && <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 rounded">Մարզում</span>}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 flex items-center gap-1">
                        {!score.isPractice && <span>{score.timeRemaining}վրկ</span>}
                        <span>•</span>
                        <span>{score.date}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ==========================================
            STATE B: PLAYING SCREEN
           ========================================== */}
        {gameState === 'playing' && (
          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 py-2">
            
            {/* COLUMN 1: THE 3D ROTATING ROSCO */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-[320px] sm:min-h-[440px] relative select-none w-full">
              
              {/* Interactive Rosco Area */}
              <div 
                id="rosco_interactive_area"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                style={{ height: `${radius * 2 + 100}px` }}
              >
                
                {/* Subtle Glowing Center Core (Stationary) */}
                <div 
                  className="absolute rounded-full border border-blue-500/30 bg-blue-900/20 flex flex-col items-center justify-center backdrop-blur-xl z-10 shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-float"
                  style={{ 
                    width: `${radius * 1.3}px`, 
                    height: `${radius * 1.3}px`,
                  }}
                >
                  <div className="text-center p-4">
                    <div className="text-[10px] text-blue-400 font-mono tracking-widest uppercase">RONDA</div>
                    <div className="text-4xl font-display font-black text-white mt-0.5">{round}</div>
                    <div className="w-8 h-0.5 bg-blue-500/40 mx-auto my-1.5 rounded-full"></div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {qStates.filter(q => q.status === 'correct').length} Ճիշտ • {qStates.filter(q => q.status === 'incorrect').length} Սխալ
                    </div>
                  </div>
                </div>

                {/* Flat 2D Rosco Ring (Rotates on drag or answer change) */}
                <div 
                  className="w-0 h-0 relative transition-transform duration-700 ease-out flex items-center justify-center"
                  style={{ 
                    transform: `rotate(${targetRotation}deg)`,
                  }}
                >
                  {/* Positioning the 27 Letter Circles */}
                  {QUESTIONS.map((question, i) => {
                    const angle = i * angleStep;
                    const isActive = i === activeIndex;
                    const status = qStates[i].status;

                    return (
                      <div
                        key={question.letter}
                        style={{
                          transform: `rotate(${angle}deg) translateY(-${radius}px) rotate(${-angle - targetRotation}deg)`,
                          position: 'absolute',
                        }}
                      >
                        <motion.div 
                          className={getLetterBadgeStyle(status, isActive)}
                          whileHover={{ scale: isActive ? 1.3 : 1.15 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <span className="font-display">{question.letter}</span>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rosco swipe instruction */}
              <p className="text-[11px] text-slate-500 font-mono mt-2 text-center animate-pulse flex items-center gap-1 justify-center">
                <RefreshCw className="w-3 h-3 text-slate-600 animate-spin" style={{ animationDuration: '6s' }} /> 
                Քաշեք անիվը՝ 3D պտույտի համար
              </p>
            </div>

            {/* COLUMN 2: ACTIVE QUESTION PANEL */}
            <div className="w-full max-w-md flex flex-col justify-center space-y-4">
              
              {/* TOP STATS COMPONENT */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-2.5 border border-slate-800/60 rounded-2xl backdrop-blur-md">
                
                {/* Timer Display */}
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-800">
                  <Clock className={`w-4 h-4 ${isPractice ? 'text-slate-500' : timeLeft <= 15 ? 'text-rose-400 animate-pulse' : 'text-blue-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Ժամանակ</div>
                    <div className="font-mono text-sm font-bold truncate text-yellow-400">
                      {isPractice ? '∞' : `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
                    </div>
                  </div>
                </div>

                {/* Score: Correct */}
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Ճիշտ</div>
                    <div className="font-mono text-sm font-bold text-emerald-400">{correctCount}</div>
                  </div>
                </div>

                {/* Score: Incorrect */}
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-800">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Սխալ</div>
                    <div className="font-mono text-sm font-bold text-rose-400">{wrongCount}</div>
                  </div>
                </div>
              </div>

              {/* CARD CONTAINER FOR CHOSEN QUESTION */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="glass-panel rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col space-y-5"
                >
                  {/* Decorative neon highlight border based on active letter */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

                  {/* Question Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center bg-blue-600/20 border border-blue-500/40 text-blue-300 font-display font-black text-xl w-10 h-10 rounded-xl shadow-inner">
                        {QUESTIONS[activeIndex].letter}
                      </span>
                      <div>
                        <h3 className="font-display font-bold text-base text-slate-200 leading-tight">
                          Հարց {QUESTIONS[activeIndex].letter}
                        </h3>
                        <p className="text-[11px] text-blue-400 font-mono tracking-wider uppercase">
                          {qStates[activeIndex].status === 'skipped' ? 'Կրկնակի Փորձ' : 'Նոր Բառ'}
                        </p>
                      </div>
                    </div>

                    {streak >= 3 && (
                      <div className="flex items-center gap-1 text-[11px] font-mono text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5 rounded-full animate-bounce">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        <span>ՇԱՐՔ՝ {streak}</span>
                      </div>
                    )}
                  </div>

                  {/* Armenian Translation word - giant focus */}
                  <div className="py-2 text-center space-y-1">
                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">ՀԱՅԵՐԵՆ ԲԱՌԸ</div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-none font-sans drop-shadow-sm select-all">
                      {QUESTIONS[activeIndex].promptArm}
                    </div>
                  </div>

                  {/* 3 OPTIONS IN SPANISH */}
                  <div className="space-y-2.5">
                    {QUESTIONS[activeIndex].choices.map((choice, idx) => {
                      const isSelected = selectedChoice === idx;
                      const isCorrectAnswer = idx === QUESTIONS[activeIndex].correctIndex;
                      const isWrongHighlight = isSelected && !isCorrectAnswer;
                      const showHighlight = selectedChoice !== null;
                      
                      let btnStyle = "w-full text-left p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 relative select-none ";
                      
                      if (!showHighlight) {
                        btnStyle += "bg-white/5 border-white/5 text-slate-200 hover:bg-blue-600/20 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] active:scale-99";
                      } else if (isCorrectAnswer) {
                        // Highlight correct green
                        btnStyle += "bg-green-600/20 border-green-500 text-green-200 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
                      } else if (isWrongHighlight) {
                        // Highlight incorrect red
                        btnStyle += "bg-rose-600/20 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)]";
                      } else {
                        btnStyle += "bg-slate-950/20 border-slate-900 text-slate-500 opacity-40";
                      }

                      return (
                        <button
                          key={idx}
                          id={`choice_${idx}`}
                          disabled={showHighlight}
                          onClick={() => handleAnswerSelection(idx)}
                          className={btnStyle}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`font-mono text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                              !showHighlight ? 'bg-slate-900 border-slate-800 text-slate-400' :
                              isCorrectAnswer ? 'bg-green-500 border-green-300 text-white' :
                              isWrongHighlight ? 'bg-rose-500 border-rose-300 text-white' : 'bg-slate-900 border-slate-950 text-slate-600'
                            }`}>
                              {idx === 0 ? 'A' : idx === 1 ? 'B' : 'C'}
                            </span>
                            <span className="font-display font-medium text-sm sm:text-base truncate">{choice}</span>
                          </div>

                          {showHighlight && isCorrectAnswer && (
                            <Check className="w-5 h-5 text-green-400 shrink-0" />
                          )}
                          {showHighlight && isWrongHighlight && (
                            <X className="w-5 h-5 text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* BOTTOM PASAPALABRA (SKIP) CONTROLS */}
                  <div className="pt-2 flex gap-2">
                    <button
                      id="pasapalabra_action_btn"
                      disabled={selectedChoice !== null}
                      onClick={handlePasapalabra}
                      className="flex-1 py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-white font-display font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-950/30 hover:shadow-orange-500/10 active:scale-98"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>PASAPALABRA (Բաց թողնել)</span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ==========================================
            STATE C: GAMEOVER SCREEN
           ========================================== */}
        {gameState === 'gameover' && (
          <motion.div 
            id="gameover_view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>

            {/* Title / Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-blue-400 mb-2">
                <Trophy className="w-8 h-8 animate-bounce" />
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-white leading-none uppercase">
                ԽԱՂՆ ԱՎԱՐՏՎԵՑ
              </h2>
              <p className="text-sm text-slate-400">
                Ահա ձեր գիտելիքների վերլուծությունը հայերեն-իսպաներեն բառերի և սեռի գուշակման խաղում:
              </p>
            </div>

            {/* BIG METRICS BENTO */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              {/* Correct answers */}
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                <div className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Ճիշտ
                </div>
                <div className="text-3xl font-display font-extrabold text-white mt-1">
                  {correctCount}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">բառ</div>
              </div>

              {/* Errores */}
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                <div className="text-[10px] text-rose-400 font-mono uppercase tracking-widest flex items-center justify-center gap-1">
                  <X className="w-3.5 h-3.5" /> Սխալ
                </div>
                <div className="text-3xl font-display font-extrabold text-white mt-1">
                  {wrongCount}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">բառ</div>
              </div>

              {/* Accuracy rate */}
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <div className="text-[10px] text-blue-400 font-mono uppercase tracking-widest flex items-center justify-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Ճշգրտություն
                </div>
                <div className="text-3xl font-display font-extrabold text-white mt-1">
                  {correctCount + wrongCount > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">փորձերից</div>
              </div>

              {/* Max Streak */}
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                <div className="text-[10px] text-amber-400 font-mono uppercase tracking-widest flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5" /> Լավագույն շարք
                </div>
                <div className="text-3xl font-display font-extrabold text-white mt-1">
                  {maxStreak}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">անընդմեջ ճիշտ</div>
              </div>
            </div>

            {/* ACTION FOOTER MENU */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button 
                id="play_again_btn"
                onClick={() => setGameState('menu')}
                className="py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-display font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-98 shadow-lg shadow-blue-950/30 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Գլխավոր Մենյու</span>
              </button>

              <button 
                id="restart_game_btn"
                onClick={() => handleStartGame(isPractice)}
                className="py-3 px-6 bg-white/5 hover:bg-white/10 text-slate-100 font-display font-bold text-sm rounded-xl flex items-center justify-center gap-2 border border-white/10 transition-all active:scale-98 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Կրկնել Նույն Ռեժիմը</span>
              </button>
            </div>

            {/* EDUCATIONAL DICTIONARY SUMMARY */}
            <div className="border-t border-slate-800/60 pt-6">
              <h3 className="font-display font-bold text-lg text-slate-100 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span>Ձեր արդյունքների ամբողջական բառարանը՝</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1 text-xs">
                {QUESTIONS.map((q, idx) => {
                  const status = qStates[idx].status;
                  return (
                    <div 
                      key={q.letter} 
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 bg-slate-950/40 ${
                        status === 'correct' ? 'border-green-500/30 hover:border-green-500/50' :
                        status === 'incorrect' ? 'border-rose-500/30 hover:border-rose-500/50' : 'border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold font-mono text-[10px] shrink-0 ${
                          status === 'correct' ? 'bg-green-500 text-white' :
                          status === 'incorrect' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {q.letter}
                        </span>
                        <div className="min-w-0">
                          <div className="font-sans font-bold text-slate-200 truncate">{q.promptArm}</div>
                          <div className="font-display text-blue-300 font-medium text-[11px] truncate">{q.word}</div>
                        </div>
                      </div>

                      {status === 'correct' ? (
                        <Check className="w-4 h-4 text-green-400 shrink-0" />
                      ) : status === 'incorrect' ? (
                        <X className="w-4 h-4 text-rose-400 shrink-0" />
                      ) : (
                        <span className="text-[9px] text-slate-500 font-mono uppercase shrink-0">Չկար</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* ==========================================
          MODAL A: INSTRUCTIONS / HELP MODAL
         ========================================== */}
      <AnimatePresence>
        {showHelp && (
          <motion.div 
            id="help_modal_overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              id="help_modal_content"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg glass-panel rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto space-y-6"
            >
              <button 
                id="close_help_btn"
                onClick={() => setShowHelp(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-950 text-slate-400 hover:text-white transition-all border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2">
                <h3 className="font-display font-black text-2xl text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                  <span>Ինչպե՞ս Խաղալ</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Pasapalabra-ն իսպանական հայտնի հեռուստախաղ է, որտեղ մասնակիցը պետք է գուշակի բոլոր 27 տառերին համապատասխանող բառերը։
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-slate-200">1. Արտիկլներ (Gender in Spanish)</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Իսպաներենում գոյականները ունեն երկու սեռ՝ արական (<strong className="text-blue-400 font-mono">el</strong>) և իգական (<strong className="text-pink-400 font-mono">la</strong>)։ Այս խաղի նպատակն է սովորել բառերի ճիշտ թարգմանությունը համապատասխան արտիկլով։
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-slate-200">2. PASAPALABRA (Բաց թողնել)</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Եթե չգիտեք պատասխանը կամ կասկածում եք, սեղմեք <strong className="text-amber-400">PASAPALABRA</strong> կոճակը։ Բառը կմնա նարնջագույն, իսկ 3D անիվը կպտտվի հաջորդ տառին։ Երբ անցնեք ամբողջ այբուբենով, բաց թողած բառերին կանդրադառնաք 2-րդ փուլում (Ronda 2)։
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-slate-200">3. 3D Պտույտներ</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Դուք կարող եք պտտել 3D Rosco անիվը՝ քաշելով այն ձախ կամ աջ մկնիկով կամ սենսորային էկրանով։ Այն ավտոմատ կերպով կվերադառնա ակտիվ տառին հաջորդ հարցի ժամանակ։
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-slate-200">4. Ձայնային աջակցություն</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Ամեն անգամ ճիշտ պատասխանելիս խաղը բարձրաձայն կարտասանի իսպաներեն բառը։ Համոզվեք, որ ձեր սարքի ձայնը միացված է՝ ճիշտ արտասանությունը լսելու համար։
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="help_modal_ok_btn"
                  onClick={() => setShowHelp(false)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-display font-bold rounded-xl text-xs transition-all shadow-lg"
                >
                  Հասկանալի է
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          MODAL B: SETTINGS MODAL
         ========================================== */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            id="settings_modal_overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              id="settings_modal_content"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm glass-panel rounded-3xl p-6 relative space-y-6"
            >
              <button 
                id="close_settings_btn"
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-950 text-slate-400 hover:text-white transition-all border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-display font-black text-2xl text-white flex items-center gap-2">
                <Settings className="w-6 h-6 text-blue-400" />
                <span>Կարգավորումներ</span>
              </h3>

              <div className="space-y-4 text-xs">
                {/* Sound toggle row */}
                <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-800/60">
                  <div>
                    <div className="font-bold text-slate-200">Ձայնային Էֆեկտներ</div>
                    <div className="text-[10px] text-slate-500">Ճիշտ/սխալ պատասխանի ձայներ</div>
                  </div>
                  <button 
                    id="setting_sound_toggle"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`py-1.5 px-3 rounded-lg font-mono font-bold transition-all ${soundEnabled ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                  >
                    {soundEnabled ? 'ՄԻԱՑՎԱԾ' : 'ԱՆՋԱՏՎԱԾ'}
                  </button>
                </div>

                {/* Voice toggle row */}
                <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-800/60">
                  <div>
                    <div className="font-bold text-slate-200">Բարձրաձայն Արտասանություն</div>
                    <div className="text-[10px] text-slate-500">Իսպաներեն բառերի խոսքի սինթեզ (TTS)</div>
                  </div>
                  <button 
                    id="setting_voice_toggle"
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={`py-1.5 px-3 rounded-lg font-mono font-bold transition-all ${voiceEnabled ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                  >
                    {voiceEnabled ? 'ՄԻԱՑՎԱԾ' : 'ԱՆՋԱՏՎԱԾ'}
                  </button>
                </div>

                {/* Clear High scores */}
                <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-800/60">
                  <div>
                    <div className="font-bold text-slate-200">Խաղային Պատմություն</div>
                    <div className="text-[10px] text-slate-500">Ջնջել լավագույն փորձերը</div>
                  </div>
                  <button 
                    id="clear_scores_btn"
                    onClick={() => {
                      if (confirm("Ցանկանու՞մ եք ջնջել լավագույն փորձերի պատմությունը։")) {
                        localStorage.removeItem('pasapalabra_high_scores');
                        setHighScores([]);
                      }
                    }}
                    className="py-1.5 px-3 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/30 rounded-lg font-bold"
                  >
                    ՋՆՋԵԼ
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="settings_modal_ok_btn"
                  onClick={() => setShowSettings(false)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-display font-bold rounded-xl text-xs transition-all shadow-lg"
                >
                  Պահպանել
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          FOOTER / COPYRIGHT
         ========================================== */}
      <footer id="pasapalabra_footer" className="w-full text-center py-4 text-[10px] sm:text-xs text-slate-500 border-t border-slate-900/60 bg-slate-950/30 mt-auto px-4">
        <p>© {new Date().getFullYear()} Pasapalabra 3D — Գուշակիր իսպաներեն բառը և սեռը հայերենից։</p>
      </footer>
    </div>
  );
}
