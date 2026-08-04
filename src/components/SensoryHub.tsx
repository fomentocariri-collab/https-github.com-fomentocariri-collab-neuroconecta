import React, { useState, useEffect, useRef } from "react";
import { Waves, Eye, Hand, Volume2, Wind, Heart, Plus, Trash2, VolumeX, Play, Pause, Square, Sparkles } from "lucide-react";
import { SensoryTrigger } from "../types";

export const SensoryHub: React.FC<{ isDark?: boolean }> = ({ isDark = true }) => {
  const [activeSubTab, setActiveSubTab] = useState<"grounding" | "respiracao" | "sons" | "gatilhos">("grounding");

  // Grounding 5-4-3-2-1 state
  const [groundingStep, setGroundingStep] = useState(1);
  const groundingSteps = [
    { num: 5, sense: "Visão", icon: Eye, title: "Olhe ao redor e identifique 5 objetos", desc: "Perceba cores, formas ou luzes ao seu redor. Nomeie mentalmente cada um." },
    { num: 4, sense: "Tato", icon: Hand, title: "Sinta 4 texturas ou superfícies", desc: "Sinta a roupa na sua pele, a mesa com os dedos, os pés no chão, ou segure um objeto firme." },
    { num: 3, sense: "Audição", icon: Volume2, title: "Escute 3 sons diferentes", desc: "Mesmo em silêncio, perceba o zumbido do ar condicionado, passos distantes ou sua própria respiração." },
    { num: 2, sense: "Olfato", icon: Wind, title: "Perceba 2 aromas ou cheiros", desc: "Note o cheiro do ambiente, do café, da sua pele ou um óleo essencial." },
    { num: 1, sense: "Autoafirmação", icon: Heart, title: "Diga 1 palavra ou frase gentil a si mesmo(a)", desc: "Ex: 'Eu estou em segurança agora', 'Estou fazendo o meu melhor'." },
  ];

  // Breathing Pacer state (Respiração Quadrada 4-4-4-4)
  const [breathPhase, setBreathPhase] = useState<"Inalar" | "Reter" | "Exalar" | "Pausa">("Inalar");
  const [breathCounter, setBreathCounter] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathCounter((prev) => {
          if (prev > 1) return prev - 1;
          // Change phase when counter reaches 0
          setBreathPhase((current) => {
            if (current === "Inalar") return "Reter";
            if (current === "Reter") return "Exalar";
            if (current === "Exalar") return "Pausa";
            return "Inalar";
          });
          return 4; // Reset to 4 seconds
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  // Audio Synthesizer (Web Audio API)
  const [audioPlaying, setAudioPlaying] = useState<"brown" | "drone" | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  const startBrownNoise = () => {
    stopAudio();
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain adjustment
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const gain = ctx.createGain();
      gain.gain.value = 0.15; // Gentle volume

      whiteNoise.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();

      noiseNodeRef.current = whiteNoise;
      setAudioPlaying("brown");
    } catch (e) {
      console.error(e);
    }
  };

  const startCalmDrone = () => {
    stopAudio();
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Create dual binaural/soothing sine oscillators
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.value = 136.1; // OM tone (136.1 Hz calming frequency)
      osc2.type = "sine";
      osc2.frequency.value = 140.0;

      gain.gain.value = 0.1;

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      setAudioPlaying("drone");
    } catch (e) {
      console.error(e);
    }
  };

  const stopAudio = () => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setAudioPlaying(null);
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Sensory Triggers state
  const [triggers, setTriggers] = useState<SensoryTrigger[]>([]);
  const [newSense, setNewSense] = useState<SensoryTrigger["sense"]>("audicao");
  const [newTriggerText, setNewTriggerText] = useState("");
  const [newCopingText, setNewCopingText] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("neuroconecta_sensory_triggers");
      if (stored) setTriggers(JSON.parse(stored));
      else {
        setTriggers([
          {
            id: "tr-1",
            sense: "audicao",
            trigger: "Sons repentinos de apitos ou fogos de artifício",
            impactLevel: 4,
            copingStrategy: "Fones de ouvido com cancelamento ativo de ruído + música de fundo",
          },
          {
            id: "tr-2",
            sense: "visao",
            trigger: "Luzes fluorescentes de escritórios ou mercados",
            impactLevel: 3,
            copingStrategy: "Uso de óculos com lente levemente amarelada / boné",
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveTriggers = (updated: SensoryTrigger[]) => {
    setTriggers(updated);
    try {
      localStorage.setItem("neuroconecta_sensory_triggers", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTrigger = () => {
    if (!newTriggerText.trim() || !newCopingText.trim()) return;
    const item: SensoryTrigger = {
      id: `trig-${Date.now()}`,
      sense: newSense,
      trigger: newTriggerText.trim(),
      impactLevel: 3,
      copingStrategy: newCopingText.trim(),
    };
    saveTriggers([...triggers, item]);
    setNewTriggerText("");
    setNewCopingText("");
  };

  const handleDeleteTrigger = (id: string) => {
    saveTriggers(triggers.filter((t) => t.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className={`rounded-2xl p-6 border shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition ${
        isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
      }`}>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Waves className="w-6 h-6 text-teal-500 dark:text-teal-400" />
            <span>Central de Regulação Sensorial</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Técnicas de grounding, marcapasso de respiração, áudio ambiente sintetizado e registro de gatilhos.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: "grounding", label: "🧘 Grounding 5-4-3-2-1" },
          { id: "respiracao", label: "🫁 Respiração Guiada" },
          { id: "sons", label: "🎧 Ruído & Sons Calmantes" },
          { id: "gatilhos", label: "📝 Registro de Gatilhos" },
        ].map((sub) => (
          <button
            key={sub.id}
            onClick={() => setActiveSubTab(sub.id as any)}
            className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition whitespace-nowrap border ${
              activeSubTab === sub.id
                ? "bg-teal-600 text-white border-teal-500 shadow"
                : isDark
                ? "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* 1. Grounding 5-4-3-2-1 */}
      {activeSubTab === "grounding" && (
        <div className={`border rounded-2xl p-6 space-y-6 shadow-xl ${
          isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
        }`}>
          <div className="space-y-1">
            <h2 className="text-xl font-bold">Técnica de Grounding (Ancoragem)</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Reduza a ansiedade e a sobrecarga ancorando seus sentidos no momento presente.
            </p>
          </div>

          <div className={`p-6 border rounded-2xl space-y-6 text-center ${
            isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            {(() => {
              const currentG = groundingSteps[groundingStep - 1];
              const Icon = currentG.icon;
              return (
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                    <Icon className="w-8 h-8 animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Passo {groundingStep} de 5 • Sense: {currentG.sense}</span>
                    <h3 className="text-lg font-bold">{currentG.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{currentG.desc}</p>
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                disabled={groundingStep === 1}
                onClick={() => setGroundingStep((prev) => prev - 1)}
                className={`px-4 py-2 disabled:opacity-40 text-xs sm:text-sm rounded-xl transition border ${
                  isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700" : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                Anterior
              </button>
              <button
                disabled={groundingStep === 5}
                onClick={() => setGroundingStep((prev) => prev + 1)}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm rounded-xl transition shadow-md"
              >
                Próximo Passo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Respiração Quadrada Guiada */}
      {activeSubTab === "respiracao" && (
        <div className={`border rounded-2xl p-6 space-y-6 shadow-xl text-center ${
          isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
        }`}>
          <div className="space-y-1">
            <h2 className="text-xl font-bold">Marcapasso de Respiração Quadrada (4-4-4-4)</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Acalme o nervo vago e reduza batimentos cardíacos com ritmos suaves de respiração.
            </p>
          </div>

          <div className="py-8 flex flex-col items-center justify-center space-y-6">
            {/* Animated Breathing Circle */}
            <div
              className={`w-48 h-48 rounded-full border-4 flex items-center justify-center transition-all duration-1000 shadow-2xl ${
                breathPhase === "Inalar"
                  ? "scale-125 border-teal-500 bg-teal-500/10 text-teal-700 dark:text-teal-200"
                  : breathPhase === "Reter"
                  ? "scale-125 border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
                  : breathPhase === "Exalar"
                  ? "scale-90 border-cyan-500 bg-cyan-500/10 text-cyan-700 dark:text-cyan-200"
                  : "scale-90 border-slate-400 bg-slate-100 dark:bg-slate-950 text-slate-500"
              }`}
            >
              <div className="text-center space-y-1">
                <span className="text-xs uppercase font-bold tracking-widest">{breathPhase}</span>
                <div className="text-4xl font-extrabold font-mono">{breathCounter}s</div>
              </div>
            </div>

            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl shadow-lg transition flex items-center gap-2"
            >
              {isBreathingActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isBreathingActive ? "Pausar Respiração" : "Iniciar Respiração Guiada"}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Audio Synthesizer */}
      {activeSubTab === "sons" && (
        <div className={`border rounded-2xl p-6 space-y-6 shadow-xl ${
          isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
        }`}>
          <div className="space-y-1">
            <h2 className="text-xl font-bold">Gerador de Áudio Calmante Sintetizado</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Sons gerados em tempo real direto no seu navegador sem consumir dados de internet.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Brown Noise */}
            <div className={`p-5 border rounded-2xl space-y-4 ${
              isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
                  <Volume2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Ruído Marrom (Brownian Noise)</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Frequências graves suaves parecidas com cachoeira ou vento suave.</p>
                </div>
              </div>
              
              {audioPlaying === "brown" ? (
                <button
                  onClick={stopAudio}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2"
                >
                  <Square className="w-4 h-4" /> Parar Ruído Marrom
                </button>
              ) : (
                <button
                  onClick={startBrownNoise}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md"
                >
                  <Play className="w-4 h-4" /> Tocar Ruído Marrom
                </button>
              )}
            </div>

            {/* Calm Drone */}
            <div className={`p-5 border rounded-2xl space-y-4 ${
              isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Tom de Frequência Calma (136.1 Hz)</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Tom puro e suave de meditação profunda para desacelerar pensamentos.</p>
                </div>
              </div>

              {audioPlaying === "drone" ? (
                <button
                  onClick={stopAudio}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2"
                >
                  <Square className="w-4 h-4" /> Parar Frequência
                </button>
              ) : (
                <button
                  onClick={startCalmDrone}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md"
                >
                  <Play className="w-4 h-4" /> Tocar Frequência Calma
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 4. Sensory Triggers Log */}
      {activeSubTab === "gatilhos" && (
        <div className={`border rounded-2xl p-6 space-y-6 shadow-xl ${
          isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
        }`}>
          <div className="space-y-1">
            <h2 className="text-xl font-bold">Seu Diário de Gatilhos Sensoriais</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Anote o que te sobrecarrega e quais estratégias funcionam melhor para o seu perfil.
            </p>
          </div>

          <div className="space-y-3">
            {triggers.map((t) => (
              <div key={t.id} className={`p-4 border rounded-2xl space-y-2 ${
                isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    Canal: {t.sense}
                  </span>
                  <button
                    onClick={() => handleDeleteTrigger(t.id)}
                    className="text-slate-400 hover:text-rose-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="font-bold text-sm">⚡ Gatilho: {t.trigger}</h4>
                <p className={`text-xs p-2.5 rounded-xl border ${
                  isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-800"
                }`}>
                  🛡️ <strong>Estratégia de Adaptação:</strong> {t.copingStrategy}
                </p>
              </div>
            ))}
          </div>

          {/* Add Form */}
          <div className={`p-4 border rounded-2xl space-y-3 ${
            isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Cadastrar Novo Gatilho Pessoal:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={newSense}
                onChange={(e) => setNewSense(e.target.value as any)}
                className={`px-3 py-2 border rounded-xl text-xs ${
                  isDark ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-300 text-slate-900"
                }`}
              >
                <option value="audicao">Audição (Som/Barulho)</option>
                <option value="visao">Visão (Luzes/Cores)</option>
                <option value="tato">Tato (Tecidos/Toque)</option>
                <option value="olfato_paladar">Olfato / Paladar</option>
                <option value="propriocepcao">Propriocepção / Espaço</option>
              </select>

              <input
                type="text"
                placeholder="Qual é o gatilho? (Ex: Fita adesiva barulhenta)"
                value={newTriggerText}
                onChange={(e) => setNewTriggerText(e.target.value)}
                className={`px-3.5 py-2 border rounded-xl text-xs ${
                  isDark ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-300 text-slate-900"
                }`}
              />

              <input
                type="text"
                placeholder="Estratégia de alívio? (Ex: Usar protetor auricular)"
                value={newCopingText}
                onChange={(e) => setNewCopingText(e.target.value)}
                className={`sm:col-span-2 px-3.5 py-2 border rounded-xl text-xs ${
                  isDark ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-300 text-slate-900"
                }`}
              />
            </div>

            <button
              onClick={handleAddTrigger}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Salvar Gatilho</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
