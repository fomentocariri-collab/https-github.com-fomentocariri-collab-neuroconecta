import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Headphones, 
  Sparkles, 
  Clock, 
  Sliders, 
  Heart, 
  Moon, 
  Zap, 
  Wind, 
  Feather,
  Info,
  RotateCcw
} from "lucide-react";

interface MusicotherapyHubProps {
  isDark?: boolean;
}

export interface SoundPreset {
  id: string;
  title: string;
  category: "descompressao" | "foco" | "grounding" | "sono" | "ansiedade";
  icon: any;
  color: string;
  description: string;
  benefits: string;
  type: "brown_noise" | "binaural_432" | "binaural_528" | "alpha_waves" | "rain_sim" | "calm_chord";
  baseFreq: number;
  binauralBeat?: number;
}

const SOUND_PRESETS: SoundPreset[] = [
  {
    id: "preset-brown",
    title: "Ruído Marrom Profundo",
    category: "descompressao",
    icon: Wind,
    color: "from-amber-600 to-orange-700",
    description: "Frequências graves aveludadas que 'desligam' o zumbido mental e mascaram ruídos imprevisíveis.",
    benefits: "Ideal para desacelerar crises de sobrecarga sensorial e acalmar pensamentos acelerados no TDAH e Autismo.",
    type: "brown_noise",
    baseFreq: 120,
  },
  {
    id: "preset-432",
    title: "Frequência Harmônica 432 Hz",
    category: "grounding",
    icon: Feather,
    color: "from-emerald-600 to-teal-700",
    description: "Sintonia harmônica alinhada aos ritmos da natureza para alívio tensional imediato.",
    benefits: "Ajuda a desacelerar batimentos cardíacos e proporciona ancoragem sensorial suave durante o Grounding.",
    type: "binaural_432",
    baseFreq: 432,
    binauralBeat: 5,
  },
  {
    id: "preset-528",
    title: "Frequência de Restauração 528 Hz",
    category: "ansiedade",
    icon: Heart,
    color: "from-rose-500 to-pink-700",
    description: "Tom puro e ressonante conhecido por induzir sensação de acolhimento e segurança emocional.",
    benefits: "Reduz o cortisol, acalma o peito apertado e diminui respostas de luta ou fuga.",
    type: "binaural_528",
    baseFreq: 528,
    binauralBeat: 7,
  },
  {
    id: "preset-alpha",
    title: "Ondas Alfa (10 Hz Focus)",
    category: "foco",
    icon: Zap,
    color: "from-cyan-600 to-blue-700",
    description: "Pulsatação auditiva em frequência Alfa (8-12 Hz) estimulando foco relaxado sem ansiedade.",
    benefits: "Facilita a execução de tarefas diárias prevenindo a fadiga executiva.",
    type: "alpha_waves",
    baseFreq: 220,
    binauralBeat: 10,
  },
  {
    id: "preset-rain",
    title: "Simulação de Chuva Suave",
    category: "grounding",
    icon: Sparkles,
    color: "from-teal-500 to-emerald-700",
    description: "Sons orgânicos sintéticos de gotas contínuas para criação de um casulo acústico protetor.",
    benefits: "Neutraliza barulhos repentinos de reformas, trânsito ou conversas paralelas incomodas.",
    type: "rain_sim",
    baseFreq: 180,
  },
  {
    id: "preset-sleep",
    title: "Transição Suave para o Sono (Delta 2Hz)",
    category: "sono",
    icon: Moon,
    color: "from-indigo-600 to-purple-800",
    description: "Graves desacelerados com oscilação Delta de 2 Hz para preparar o cérebro neurodivergente para dormir.",
    benefits: "Facilita a desconexão do hiperfoco noturno e induz o relaxamento muscular.",
    type: "calm_chord",
    baseFreq: 136.1, // Ohm tone
    binauralBeat: 2,
  },
];

export const MusicotherapyHub: React.FC<MusicotherapyHubProps> = ({ isDark = false }) => {
  const [activePreset, setActivePreset] = useState<SoundPreset>(SOUND_PRESETS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // Timer state
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number | null>(null);

  // Web Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<any[]>([]);

  // Breathing Visualizer state
  const [breathingPhase, setBreathingPhase] = useState<"inspire" | "segure" | "expire">("inspire");
  const [breathingText, setBreathingText] = useState("Inspire suavemente...");

  // Timer Countdown Effect
  useEffect(() => {
    if (!isPlaying || timeLeftSeconds === null) return;

    if (timeLeftSeconds <= 0) {
      stopAudio();
      setTimerMinutes(null);
      setTimeLeftSeconds(null);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, timeLeftSeconds]);

  // Breathing Rhythm Loop Effect for Visual Stimming
  useEffect(() => {
    if (!isPlaying) return;

    let timeoutId: NodeJS.Timeout;

    const runBreathingCycle = () => {
      setBreathingPhase("inspire");
      setBreathingText("Inspire suavemente (4s)");

      timeoutId = setTimeout(() => {
        setBreathingPhase("segure");
        setBreathingText("Mantenha o ar (4s)");

        timeoutId = setTimeout(() => {
          setBreathingPhase("expire");
          setBreathingText("Solte bem devagar (6s)");

          timeoutId = setTimeout(() => {
            runBreathingCycle();
          }, 6000);
        }, 4000);
      }, 4000);
    };

    runBreathingCycle();

    return () => clearTimeout(timeoutId);
  }, [isPlaying]);

  // Stop & Clean Audio Nodes
  const stopAudio = () => {
    activeNodesRef.current.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        console.warn(e);
      }
    });
    activeNodesRef.current = [];
    setIsPlaying(false);
  };

  // Start Audio Synthesizer
  const startAudio = (preset: SoundPreset) => {
    stopAudio();

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      } else if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      if (preset.type === "brown_noise" || preset.type === "rain_sim") {
        // Brown noise generation via buffer
        const bufferSize = ctx.sampleRate * 3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5; // Boost brown noise warmth
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = buffer;
        noiseNode.loop = true;

        // Lowpass filter for cozy sound
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = preset.type === "rain_sim" ? 800 : 400;

        noiseNode.connect(filter);
        filter.connect(masterGain);

        noiseNode.start();
        activeNodesRef.current.push(noiseNode, filter);

      } else {
        // Sine Oscillators for Binaural Beats or Harmonic Chords
        const oscLeft = ctx.createOscillator();
        const oscRight = ctx.createOscillator();

        const merger = ctx.createChannelMerger(2);

        oscLeft.type = "sine";
        oscRight.type = "sine";

        const freq = preset.baseFreq;
        const beat = preset.binauralBeat || 5;

        oscLeft.frequency.value = freq;
        oscRight.frequency.value = freq + beat;

        // Soft Gain Envelope
        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.3, ctx.currentTime);

        oscLeft.connect(merger, 0, 0); // Left channel
        oscRight.connect(merger, 0, 1); // Right channel

        merger.connect(oscGain);
        oscGain.connect(masterGain);

        // Add a gentle sub-harmonic background drone
        const subOsc = ctx.createOscillator();
        subOsc.type = "triangle";
        subOsc.frequency.value = freq / 2;
        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.08, ctx.currentTime);

        subOsc.connect(subGain);
        subGain.connect(masterGain);

        oscLeft.start();
        oscRight.start();
        subOsc.start();

        activeNodesRef.current.push(oscLeft, oscRight, subOsc, oscGain, subGain, merger);
      }

      setIsPlaying(true);
    } catch (e) {
      console.error("Erro ao iniciar gerador de áudio:", e);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio(activePreset);
    }
  };

  const handleSelectPreset = (preset: SoundPreset) => {
    setActivePreset(preset);
    if (isPlaying) {
      startAudio(preset);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(isMuted ? 0 : newVol, audioCtxRef.current.currentTime);
    }
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(nextMute ? 0 : volume, audioCtxRef.current.currentTime);
    }
  };

  const handleSetTimer = (minutes: number) => {
    if (timerMinutes === minutes) {
      setTimerMinutes(null);
      setTimeLeftSeconds(null);
    } else {
      setTimerMinutes(minutes);
      setTimeLeftSeconds(minutes * 60);
      if (!isPlaying) {
        startAudio(activePreset);
      }
    }
  };

  const formatSeconds = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8 animate-fadeIn">
      
      {/* Header Banner - Soft, Neuro-friendly */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm transition ${
        isDark 
          ? "bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border-teal-800/60 text-slate-100" 
          : "bg-gradient-to-r from-teal-50/80 via-emerald-50/60 to-cyan-50/80 border-teal-200/80 text-slate-800"
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
              <Headphones className="w-4 h-4 text-teal-500" />
              <span>Regulação Sensorial Neuroafirmativa</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Musicoterapia & Som Regula
            </h1>
            <p className="text-sm sm:text-base opacity-90 leading-relaxed font-sans">
              A frequência certa para cada momento. Utilize sons de descompressão acústica, ruído marrom e ondas binaurais para modular o sistema nervoso, aliviar o estresse sensorial e recuperar a clareza mental.
            </p>
          </div>

          {/* Quick Active Sound Indicator */}
          <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
            isDark ? "bg-slate-950/80 border-slate-800" : "bg-white/90 border-teal-100 shadow-sm"
          }`}>
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activePreset.color} text-white flex items-center justify-center flex-shrink-0 shadow-md`}>
              {React.createElement(activePreset.icon, { className: "w-6 h-6" })}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Preset Atual</span>
              <h3 className="text-sm font-bold truncate max-w-[150px] sm:max-w-[180px]">{activePreset.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{isPlaying ? "🟢 Tocando agora" : "⚪ Em pausa"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Player & Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Stimming Orb & Controls */}
        <div className={`lg:col-span-7 p-6 sm:p-8 rounded-3xl border flex flex-col justify-between space-y-6 shadow-sm ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}>
          
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-500" />
              <span>Ancoragem Visual & Pulso Sensorial</span>
            </h2>
            {timerMinutes && timeLeftSeconds !== null && (
              <span className="px-3 py-1 bg-teal-950 text-teal-300 border border-teal-800 text-xs font-bold rounded-full flex items-center gap-1.5 animate-pulse">
                <Clock className="w-3.5 h-3.5" />
                {formatSeconds(timeLeftSeconds)}
              </span>
            )}
          </div>

          {/* Stimming Orb Animation Canvas */}
          <div className="relative py-12 flex flex-col items-center justify-center">
            
            {/* Pulsing Outer Rings */}
            <div className={`absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full transition-all duration-1000 ${
              isPlaying
                ? breathingPhase === "inspire"
                  ? "scale-125 bg-teal-500/20 blur-xl"
                  : breathingPhase === "segure"
                  ? "scale-110 bg-emerald-500/20 blur-lg"
                  : "scale-90 bg-cyan-500/10 blur-md"
                : "scale-90 bg-slate-200 dark:bg-slate-800/40 opacity-30"
            }`} />

            {/* Middle Breathing Circle */}
            <div className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br ${activePreset.color} p-1 shadow-xl transition-all duration-[3500ms] flex items-center justify-center ${
              isPlaying
                ? breathingPhase === "inspire"
                  ? "scale-110 shadow-teal-500/40"
                  : breathingPhase === "segure"
                  ? "scale-105 shadow-emerald-500/30"
                  : "scale-95 shadow-cyan-500/20"
                : "scale-95 opacity-80"
            }`}>
              <div className={`w-full h-full rounded-full flex flex-col items-center justify-center p-4 text-center text-white backdrop-blur-sm transition ${
                isDark ? "bg-slate-950/40" : "bg-black/10"
              }`}>
                {React.createElement(activePreset.icon, { 
                  className: `w-10 h-10 mb-1 transition-transform duration-700 ${isPlaying ? "animate-bounce" : ""}` 
                })}
                <span className="text-xs font-bold drop-shadow">{activePreset.title}</span>
              </div>
            </div>

            {/* Breathing Guide Subtitle */}
            <div className="mt-8 text-center space-y-1">
              <p className={`text-sm font-semibold transition-all ${
                isPlaying ? "text-teal-600 dark:text-teal-300" : "text-slate-400"
              }`}>
                {isPlaying ? breathingText : "Clique em 'Iniciar Som' para começar o ciclo sensorial."}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Foque o olhar no movimento circular para descompressão visual
              </p>
            </div>

          </div>

          {/* Master Play & Volume Controls Bar */}
          <div className={`p-4 rounded-2xl border space-y-4 ${
            isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handleTogglePlay}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition shadow-md active:scale-95 ${
                  isPlaying
                    ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30"
                    : "bg-teal-600 hover:bg-teal-500 text-white shadow-teal-900/30"
                }`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                <span>{isPlaying ? "Pausar Som" : "Iniciar Som Regula"}</span>
              </button>

              {/* Mute Toggle */}
              <button
                onClick={handleToggleMute}
                className={`p-3.5 rounded-2xl border transition ${
                  isMuted
                    ? "bg-rose-950 text-rose-300 border-rose-800"
                    : isDark
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                }`}
                title={isMuted ? "Desmutar" : "Mutar"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="flex-1 accent-teal-600 cursor-pointer h-2 bg-slate-300 dark:bg-slate-800 rounded-lg"
              />
              <span className="text-xs font-mono text-slate-500 w-8 text-right">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>

            {/* Timer Presets */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Temporizador:
              </span>
              <div className="flex items-center gap-1.5">
                {[5, 15, 30, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleSetTimer(mins)}
                    className={`px-2.5 py-1 rounded-lg border font-semibold transition ${
                      timerMinutes === mins
                        ? "bg-teal-600 text-white border-teal-500"
                        : isDark
                        ? "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
                        : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Sound Presets Catalog */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Sliders className="w-5 h-5 text-teal-500" />
              <span>Biblioteca de Frequências</span>
            </h2>
            <span className="text-xs text-slate-500">6 opções otimizadas</span>
          </div>

          <div className="space-y-3">
            {SOUND_PRESETS.map((preset) => {
              const Icon = preset.icon;
              const isSelected = activePreset.id === preset.id;

              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative overflow-hidden ${
                    isSelected
                      ? isDark
                        ? "bg-slate-800 border-teal-500 ring-2 ring-teal-500/30 text-slate-100 shadow-md"
                        : "bg-teal-50/90 border-teal-400 ring-2 ring-teal-500/20 text-slate-900 shadow-md"
                      : isDark
                      ? "bg-slate-900 hover:bg-slate-800/80 border-slate-800 text-slate-300"
                      : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${preset.color} text-white flex-shrink-0 shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold">{preset.title}</h3>
                        {isSelected && isPlaying && (
                          <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs opacity-90 leading-relaxed font-sans">
                        {preset.description}
                      </p>
                      
                      <div className="pt-2 text-[11px] text-teal-700 dark:text-teal-300 font-medium flex items-center gap-1">
                        <Info className="w-3 h-3 flex-shrink-0" />
                        <span>{preset.benefits}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Educational Footer Banner */}
      <div className={`p-5 rounded-2xl border text-xs leading-relaxed space-y-2 ${
        isDark ? "bg-slate-900/60 border-slate-800 text-slate-400" : "bg-teal-50/50 border-teal-100 text-slate-600"
      }`}>
        <h4 className="font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
          💡 Como a Musicoterapia ajuda o Cérebro Neurodivergente?
        </h4>
        <p>
          O sistema auditivo autista é especialmente sensível ao ritmo e tom. Sons previsíveis em frequências específicas (como ruído marrom ou batimentos binaurais) diminuem a estimulação excessiva no córtex auditivo, favorecendo a recuperação da bateria social e o alívio imediato da sobrecarga sensorial. Utilize fones de ouvido para melhor aproveitamento do efeito binaural estéreo!
        </p>
      </div>

    </div>
  );
};
