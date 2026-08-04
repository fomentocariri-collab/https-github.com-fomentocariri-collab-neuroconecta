import React, { useState, useRef, useEffect } from "react";
import { 
  Gamepad2, 
  Sparkles, 
  RotateCcw, 
  Smile, 
  Volume2, 
  VolumeX, 
  Zap, 
  CheckCircle2, 
  Award,
  CircleDot,
  Heart,
  Headphones,
  CalendarCheck,
  Sun,
  Shield,
  Feather,
  Eye,
  Shapes,
  Grid
} from "lucide-react";

interface StimmingGamesHubProps {
  isDark?: boolean;
}

type ToyMode = "popit" | "memoria" | "bolhas" | "classificador";

export const StimmingGamesHub: React.FC<StimmingGamesHubProps> = ({ isDark = false }) => {
  const [activeToy, setActiveToy] = useState<ToyMode>("popit");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Audio Synth Ref for Pops & Clicks
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playPopSound = (pitch = 1) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(300 * pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120 * pitch, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {
      console.warn("Audio pop error:", e);
    }
  };

  const playWinSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.35);
      });
    } catch (e) {
      console.warn("Win sound error:", e);
    }
  };

  // --- 1. POP-IT STATE ---
  const [popItGrid, setPopItGrid] = useState<boolean[]>(Array(36).fill(false));
  const [popCount, setPopCount] = useState(0);

  const handlePopBubble = (index: number) => {
    const nextGrid = [...popItGrid];
    const newState = !nextGrid[index];
    nextGrid[index] = newState;
    setPopItGrid(nextGrid);
    if (newState) {
      setPopCount((prev) => prev + 1);
      playPopSound(0.8 + Math.random() * 0.5);
    } else {
      playPopSound(0.6);
    }
  };

  const handleResetPopIt = () => {
    setPopItGrid(Array(36).fill(false));
    playPopSound(1.2);
  };

  // --- 2. JOGO DA MEMÓRIA STATE ---
  const MEMORY_CARDS_DATA = [
    { id: "c1", label: "Abafador", icon: Headphones, color: "bg-teal-500 text-white" },
    { id: "c2", label: "Rotina", icon: CalendarCheck, color: "bg-emerald-500 text-white" },
    { id: "c3", label: "Stimming", icon: Sparkles, color: "bg-amber-500 text-white" },
    { id: "c4", label: "Hiperfoco", icon: Zap, color: "bg-cyan-500 text-white" },
    { id: "c5", label: "Calma", icon: Feather, color: "bg-indigo-500 text-white" },
    { id: "c6", label: "Acolhimento", icon: Heart, color: "bg-rose-500 text-white" },
  ];

  const generateMemoryDeck = () => {
    const deck = [...MEMORY_CARDS_DATA, ...MEMORY_CARDS_DATA].map((card, idx) => ({
      ...card,
      uniqueId: `${card.id}-${idx}-${Math.random()}`,
      isFlipped: false,
      isMatched: false,
    }));
    return deck.sort(() => Math.random() - 0.5);
  };

  const [memoryDeck, setMemoryDeck] = useState(generateMemoryDeck);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryCompleted, setMemoryCompleted] = useState(false);

  const handleFlipCard = (index: number) => {
    if (selectedCards.length === 2 || memoryDeck[index].isFlipped || memoryDeck[index].isMatched) return;

    playPopSound(1.1);

    const updatedDeck = [...memoryDeck];
    updatedDeck[index].isFlipped = true;
    setMemoryDeck(updatedDeck);

    const nextSelected = [...selectedCards, index];
    setSelectedCards(nextSelected);

    if (nextSelected.length === 2) {
      setMemoryMoves((prev) => prev + 1);
      const [firstIdx, secondIdx] = nextSelected;

      if (updatedDeck[firstIdx].id === updatedDeck[secondIdx].id) {
        // Match!
        setTimeout(() => {
          updatedDeck[firstIdx].isMatched = true;
          updatedDeck[secondIdx].isMatched = true;
          setMemoryDeck([...updatedDeck]);
          setSelectedCards([]);
          playPopSound(1.6);

          // Check if all matched
          if (updatedDeck.every((c) => c.isMatched)) {
            setMemoryCompleted(true);
            playWinSound();
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          updatedDeck[firstIdx].isFlipped = false;
          updatedDeck[secondIdx].isFlipped = false;
          setMemoryDeck([...updatedDeck]);
          setSelectedCards([]);
        }, 1100);
      }
    }
  };

  const handleResetMemory = () => {
    setMemoryDeck(generateMemoryDeck());
    setSelectedCards([]);
    setMemoryMoves(0);
    setMemoryCompleted(false);
  };

  // --- 3. RESPIRAÇÃO BUBBLE BLOWER STATE ---
  const [bubbleSize, setBubbleSize] = useState(20);
  const [bubblesCreated, setBubblesCreated] = useState<
    { id: string; size: number; x: number; y: number; color: string }[]
  >([]);

  const handleInflateBubble = () => {
    if (bubbleSize < 120) {
      setBubbleSize((prev) => prev + 12);
      playPopSound(0.5 + bubbleSize / 100);
    } else {
      // Release bubble
      const newBubble = {
        id: `b-${Date.now()}`,
        size: bubbleSize,
        x: Math.random() * 70 + 15,
        y: Math.random() * 50 + 20,
        color: [
          "from-teal-400 to-cyan-300",
          "from-pink-400 to-purple-300",
          "from-emerald-400 to-teal-200",
          "from-amber-300 to-orange-400",
        ][Math.floor(Math.random() * 4)],
      };
      setBubblesCreated((prev) => [newBubble, ...prev.slice(0, 15)]);
      setBubbleSize(20);
      playPopSound(1.8);
    }
  };

  // --- 4. CLASSIFICADOR DE CORES & FORMAS STATE ---
  const SORTING_ITEMS = [
    { id: "item-1", color: "bg-teal-500", label: "Tranquilidade", category: "calma" },
    { id: "item-2", color: "bg-cyan-500", label: "Foco", category: "foco" },
    { id: "item-3", color: "bg-rose-500", label: "Carinho", category: "afeto" },
    { id: "item-4", color: "bg-amber-500", label: "Alegria", category: "alegria" },
    { id: "item-5", color: "bg-teal-600", label: "Pausa", category: "calma" },
    { id: "item-6", color: "bg-cyan-600", label: "Estudo", category: "foco" },
  ];

  const [sortedBuckets, setSortedBuckets] = useState<{ [key: string]: string[] }>({
    calma: [],
    foco: [],
    afeto: [],
    alegria: [],
  });

  const handleSortItem = (itemId: string, targetCategory: string) => {
    setSortedBuckets((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((cat) => {
        updated[cat] = updated[cat].filter((id) => id !== itemId);
      });
      updated[targetCategory] = [...updated[targetCategory], itemId];
      return updated;
    });
    playPopSound(1.3);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8 animate-fadeIn">
      
      {/* Banner Superior */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm transition ${
        isDark 
          ? "bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-800/60 text-slate-100" 
          : "bg-gradient-to-r from-cyan-50/90 via-teal-50/80 to-emerald-50/90 border-cyan-200/80 text-slate-800"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
              <Gamepad2 className="w-4 h-4 text-cyan-500" />
              <span>Espaço Lúdico & Autorregulação</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Jogos & Toys Sensoriais Neuroafirmativos
            </h1>
            <p className="text-sm sm:text-base opacity-90 leading-relaxed font-sans">
              Atividades sem pressão de tempo, pontuações punitivas ou telas estressantes. Brinque no seu ritmo para aliviar a ansiedade, praticar o stimming saudável e relaxar a mente.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3 rounded-2xl border transition flex items-center gap-2 text-xs font-bold ${
                soundEnabled
                  ? "bg-teal-600 text-white border-teal-500"
                  : isDark
                  ? "bg-slate-800 text-slate-400 border-slate-700"
                  : "bg-white text-slate-600 border-slate-200"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundEnabled ? "Sons Ativos" : "Sons Mutos"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Selector for Toys */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: "popit", label: "Pop-It Infinito", icon: Grid, color: "text-amber-500" },
          { id: "memoria", label: "Jogo da Memória", icon: Shapes, color: "text-teal-500" },
          { id: "bolhas", label: "Bolhas de Sabão", icon: Sparkles, color: "text-cyan-500" },
          { id: "classificador", label: "Organizador de Emoções", icon: CircleDot, color: "text-indigo-500" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveToy(tab.id as ToyMode)}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition ${
              activeToy === tab.id
                ? "bg-teal-600 text-white shadow-md"
                : isDark
                ? "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
            }`}
          >
            {React.createElement(tab.icon, { className: `w-4 h-4 ${activeToy === tab.id ? "text-white" : tab.color}` })}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* --- TOY 1: POP-IT INFINITO --- */}
      {activeToy === "popit" && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 shadow-sm ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Grid className="w-5 h-5 text-amber-500" />
                <span>Pop-It Sensorial Interativo</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pressione as bolhas para estourar. Total de estalos na sessão: <strong className="text-teal-500">{popCount}</strong>
              </p>
            </div>

            <button
              onClick={handleResetPopIt}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition self-start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Desfazer / Reiniciar</span>
            </button>
          </div>

          {/* Pop-It Tactile Grid */}
          <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400 rounded-3xl shadow-xl grid grid-cols-6 gap-3 sm:gap-4">
            {popItGrid.map((isPopped, idx) => (
              <button
                key={idx}
                onClick={() => handlePopBubble(idx)}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-inner flex items-center justify-center transition-all transform active:scale-90 ${
                  isPopped
                    ? "bg-slate-900/60 shadow-black/50 inset-2 scale-95"
                    : "bg-white/80 hover:bg-white shadow-md scale-100 hover:scale-105"
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${isPopped ? "bg-purple-300/30" : "bg-white/50"}`} />
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400">
            Dica: O movimento repetitivo de estalar ajuda na descompressão do estresse no TDAH e Autismo.
          </p>
        </div>
      )}

      {/* --- TOY 2: JOGO DA MEMÓRIA --- */}
      {activeToy === "memoria" && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 shadow-sm ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Shapes className="w-5 h-5 text-teal-500" />
                <span>Jogo da Memória Neuroafirmativo</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Encontre os pares com calma. Tentativas suaves: <strong className="text-teal-500">{memoryMoves}</strong>
              </p>
            </div>

            <button
              onClick={handleResetMemory}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition self-start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Embaralhar Novamente</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {memoryDeck.map((card, idx) => {
              const Icon = card.icon;
              const isOpen = card.isFlipped || card.isMatched;

              return (
                <button
                  key={card.uniqueId}
                  onClick={() => handleFlipCard(idx)}
                  className={`h-24 sm:h-28 rounded-2xl p-2 flex flex-col items-center justify-center gap-1 transition-all duration-300 transform ${
                    isOpen
                      ? `${card.color} shadow-lg scale-100`
                      : isDark
                      ? "bg-slate-950 border border-slate-800 hover:border-teal-500 text-slate-500 hover:scale-105"
                      : "bg-slate-100 border border-slate-200 hover:border-teal-400 text-slate-400 hover:scale-105"
                  }`}
                >
                  {isOpen ? (
                    <>
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                      <span className="text-xs font-bold">{card.label}</span>
                    </>
                  ) : (
                    <Sparkles className="w-6 h-6 opacity-40" />
                  )}
                </button>
              );
            })}
          </div>

          {memoryCompleted && (
            <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-2xl text-center space-y-2 text-emerald-200 animate-fadeIn">
              <Award className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-base">Parabéns! Você completou todos os pares!</h3>
              <p className="text-xs">Você exercitou sua memória em um ambiente tranquilo e seguro.</p>
            </div>
          )}
        </div>
      )}

      {/* --- TOY 3: BOLHAS DE SABÃO RESPIRATÓRIAS --- */}
      {activeToy === "bolhas" && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 shadow-sm relative overflow-hidden ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}>
          <div className="space-y-1">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-500" />
              <span>Soprador de Bolhas de Sabão</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clique e segure para inflar a bolha enquanto inspira devagar. Solte o clique quando a bolha explodir ou flutuar suavemente!
            </p>
          </div>

          <div className="h-64 rounded-3xl bg-gradient-to-b from-slate-950 via-cyan-950 to-slate-950 relative flex items-center justify-center p-6 overflow-hidden">
            
            {/* Floating Generated Bubbles */}
            {bubblesCreated.map((b) => (
              <div
                key={b.id}
                style={{
                  width: `${b.size}px`,
                  height: `${b.size}px`,
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                }}
                className={`absolute rounded-full bg-gradient-to-br ${b.color} opacity-70 blur-[1px] border border-white/40 shadow-lg animate-pulse transition-all duration-1000`}
              />
            ))}

            {/* Active Inflating Bubble */}
            <button
              onClick={handleInflateBubble}
              style={{ width: `${bubbleSize * 2}px`, height: `${bubbleSize * 2}px` }}
              className="rounded-full bg-gradient-to-br from-cyan-300 via-teal-400 to-emerald-300 shadow-2xl shadow-cyan-500/50 border-2 border-white/80 flex items-center justify-center text-slate-900 font-extrabold text-xs transition-all duration-200 cursor-pointer active:scale-95"
            >
              <span>{bubbleSize > 100 ? "SOLTAR!" : "INFLAR"}</span>
            </button>
          </div>

          <p className="text-center text-xs text-slate-400">
            Bolhas soltas na sessão: <strong>{bubblesCreated.length}</strong>
          </p>
        </div>
      )}

      {/* --- TOY 4: ORGANIZADOR DE EMOÇÕES --- */}
      {activeToy === "classificador" && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 shadow-sm ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}>
          <div className="space-y-1">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <CircleDot className="w-5 h-5 text-indigo-500" />
              <span>Organizador de Emoções & Pensamentos</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clique nas fichas de pensamentos abaixo para guardá-las na gaveta correspondente e organizar sua mente.
            </p>
          </div>

          {/* Buckets Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { id: "calma", title: "Tranquilidade", color: "border-teal-500 bg-teal-500/10" },
              { id: "foco", title: "Foco & Estudos", color: "border-cyan-500 bg-cyan-500/10" },
              { id: "afeto", title: "Acolhimento", color: "border-rose-500 bg-rose-500/10" },
              { id: "alegria", title: "Alegria & Lazer", color: "border-amber-500 bg-amber-500/10" },
            ].map((bucket) => (
              <div
                key={bucket.id}
                className={`p-4 rounded-2xl border-2 ${bucket.color} min-h-[120px] space-y-2`}
              >
                <h3 className="text-xs font-bold">{bucket.title}</h3>
                <div className="space-y-1">
                  {sortedBuckets[bucket.id]?.map((itemId) => {
                    const item = SORTING_ITEMS.find((i) => i.id === itemId);
                    return item ? (
                      <span
                        key={item.id}
                        className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold text-white ${item.color} mr-1 mb-1 shadow-sm`}
                      >
                        {item.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Unsorted Items Palette */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold mb-3">Fichas disponíveis para classificar:</p>
            <div className="flex flex-wrap gap-2">
              {SORTING_ITEMS.map((item) => (
                <div key={item.id} className="inline-flex items-center gap-1">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold text-white ${item.color}`}>
                    {item.label}
                  </span>
                  <select
                    onChange={(e) => handleSortItem(item.id, e.target.value)}
                    className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1"
                  >
                    <option value="">Mover...</option>
                    <option value="calma">Tranquilidade</option>
                    <option value="foco">Foco</option>
                    <option value="afeto">Acolhimento</option>
                    <option value="alegria">Alegria</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
