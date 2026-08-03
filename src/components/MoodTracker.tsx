import React, { useState, useEffect } from "react";
import { Smile, Frown, Meh, AlertTriangle, Battery, BatteryCharging, Zap, Plus, Trash2, Calendar, TrendingUp, Sparkles, HeartPulse } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from "recharts";
import { MoodLogEntry } from "../types";

export const MoodTracker: React.FC = () => {
  const [logs, setLogs] = useState<MoodLogEntry[]>([]);
  
  // New entry form state
  const [selectedMood, setSelectedMood] = useState<MoodLogEntry["mood"]>("calmo");
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [sensoryLevel, setSensoryLevel] = useState<number>(2);
  const [notes, setNotes] = useState<string>("");
  const [triggerTag, setTriggerTag] = useState<string>("");
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);

  // Load logs
  useEffect(() => {
    try {
      const stored = localStorage.getItem("neuroconecta_mood_logs");
      if (stored) {
        setLogs(JSON.parse(stored));
      } else {
        // Sample default historical logs for demonstration and nice charts
        const sampleLogs: MoodLogEntry[] = [
          {
            id: "ml-1",
            date: "01/08",
            time: "09:00",
            mood: "calmo",
            energyLevel: 4,
            sensoryLevel: 2,
            notes: "Manhã tranquila com música de fundo suave.",
            triggers: ["Música calma"],
          },
          {
            id: "ml-2",
            date: "01/08",
            time: "15:30",
            mood: "sobrecarregado",
            energyLevel: 2,
            sensoryLevel: 4,
            notes: "Barulho forte no escritório e luzes fluorescentes.",
            triggers: ["Barulho", "Luz forte"],
          },
          {
            id: "ml-3",
            date: "02/08",
            time: "10:00",
            mood: "excelente",
            energyLevel: 5,
            sensoryLevel: 1,
            notes: "Fiz pausa sensorial de 10 minutos e usei abafador.",
            triggers: ["Pausa sensorial"],
          },
          {
            id: "ml-4",
            date: "02/08",
            time: "18:00",
            mood: "calmo",
            energyLevel: 3,
            sensoryLevel: 2,
            notes: "Rotina concluída com calma.",
            triggers: [],
          },
          {
            id: "ml-5",
            date: "03/08",
            time: "11:00",
            mood: "neutro",
            energyLevel: 3,
            sensoryLevel: 3,
            notes: "Dia normal de trabalho.",
            triggers: ["Interações sociais"],
          },
        ];
        setLogs(sampleLogs);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveLogs = (updated: MoodLogEntry[]) => {
    setLogs(updated);
    try {
      localStorage.setItem("neuroconecta_mood_logs", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTriggerTag = () => {
    if (!triggerTag.trim()) return;
    if (!selectedTriggers.includes(triggerTag.trim())) {
      setSelectedTriggers([...selectedTriggers, triggerTag.trim()]);
    }
    setTriggerTag("");
  };

  const handleRemoveTriggerTag = (tag: string) => {
    setSelectedTriggers(selectedTriggers.filter((t) => t !== tag));
  };

  const handleSaveEntry = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    const newEntry: MoodLogEntry = {
      id: `log-${Date.now()}`,
      date: dateStr,
      time: timeStr,
      mood: selectedMood,
      energyLevel,
      sensoryLevel,
      notes: notes.trim(),
      triggers: selectedTriggers,
    };

    saveLogs([newEntry, ...logs]);
    setNotes("");
    setSelectedTriggers([]);
  };

  const handleDeleteEntry = (id: string) => {
    saveLogs(logs.filter((l) => l.id !== id));
  };

  const moodOptions: { id: MoodLogEntry["mood"]; label: string; icon: any; color: string }[] = [
    { id: "excelente", label: "Excelente", icon: Smile, color: "text-emerald-400 bg-emerald-950 border-emerald-700" },
    { id: "calmo", label: "Calmo / Regulado", icon: HeartPulse, color: "text-teal-400 bg-teal-950 border-teal-700" },
    { id: "neutro", label: "Neutro", icon: Meh, color: "text-slate-300 bg-slate-900 border-slate-700" },
    { id: "sobrecarregado", label: "Sobrecarregado", icon: AlertTriangle, color: "text-amber-400 bg-amber-950 border-amber-700" },
    { id: "exausto", label: "Exausto / Burnout", icon: Frown, color: "text-rose-400 bg-rose-950 border-rose-700" },
  ];

  // Chart data formatting
  const chartData = [...logs].reverse().map((entry) => ({
    label: `${entry.date} ${entry.time}`,
    energia: entry.energyLevel,
    sobrecarga: entry.sensoryLevel,
    mood: entry.mood,
  }));

  // Simple pattern insights
  const avgEnergy = logs.length > 0 ? (logs.reduce((a, b) => a + b.energyLevel, 0) / logs.length).toFixed(1) : "3.0";
  const avgSensory = logs.length > 0 ? (logs.reduce((a, b) => a + b.sensoryLevel, 0) / logs.length).toFixed(1) : "2.0";

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-teal-400" />
            Diário de Regulação & Gráfico de Humor
          </h1>
          <p className="text-sm text-slate-400">
            Acompanhe a oscilação de energia e sobrecarga sensorial ao longo do tempo para identificar gatilhos e prevenir o burnout.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center min-w-[100px]">
            <span className="text-[10px] uppercase font-bold text-teal-400">Energia Média</span>
            <div className="text-xl font-extrabold text-slate-100">{avgEnergy} / 5</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center min-w-[100px]">
            <span className="text-[10px] uppercase font-bold text-amber-400">Sobrecarga Média</span>
            <div className="text-xl font-extrabold text-slate-100">{avgSensory} / 5</div>
          </div>
        </div>
      </div>

      {/* New Log Registration Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Plus className="w-5 h-5 text-teal-400" />
          Registrar Estado Atual
        </h2>

        {/* Mood Selection Buttons */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">Como você se sente agora?</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {moodOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedMood === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedMood(option.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition text-xs font-semibold ${
                    isSelected
                      ? option.color + " shadow-md ring-2 ring-teal-500"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliders for Energy and Sensory Overload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                <BatteryCharging className="w-4 h-4 text-teal-400" />
                Nível de Energia Bateria Interna ({energyLevel}/5)
              </label>
              <span className="text-[11px] text-slate-400">
                {energyLevel <= 2 ? "Bateria Fraca" : energyLevel === 3 ? "Moderada" : "Alta Energia"}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full accent-teal-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 (Esgotado)</span>
              <span>3 (Ok)</span>
              <span>5 (Vigoroso)</span>
            </div>
          </div>

          <div className="space-y-2 p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                Sobrecarga Sensorial / Estresse ({sensoryLevel}/5)
              </label>
              <span className="text-[11px] text-slate-400">
                {sensoryLevel <= 2 ? "Tranquilo" : sensoryLevel === 3 ? "Atenção" : "Sobrecarga Alta"}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={sensoryLevel}
              onChange={(e) => setSensoryLevel(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 (Silencioso/Calmo)</span>
              <span>3 (Sensível)</span>
              <span>5 (Perto da Crise)</span>
            </div>
          </div>
        </div>

        {/* Notes & Trigger Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Anotação Pessoal (Opcional):</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Tive reunião barulhenta, fiz pausa de 10 minutos..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Gatilhos ou Fatores Notados:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={triggerTag}
                onChange={(e) => setTriggerTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTriggerTag()}
                placeholder="Ex: Barulho, Fone de Ouvido, Sono Ruim..."
                className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
              />
              <button
                onClick={handleAddTriggerTag}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                + Tag
              </button>
            </div>

            {selectedTriggers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedTriggers.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] bg-teal-950 text-teal-300 border border-teal-800 px-2.5 py-0.5 rounded-full"
                  >
                    {tag}
                    <button onClick={() => handleRemoveTriggerTag(tag)} className="hover:text-rose-400">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSaveEntry}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Salvar Registro de Regulação</span>
        </button>
      </div>

      {/* Visual Chart Trends */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-400" />
            Evolução Temporal: Energia vs. Sobrecarga Sensorial
          </h2>
        </div>

        {chartData.length < 2 ? (
          <div className="p-8 text-center text-slate-400 text-xs sm:text-sm bg-slate-950 rounded-xl border border-slate-800">
            Adicione pelo menos 2 registros para visualizar o gráfico de tendências emocionais e sensoriais.
          </div>
        ) : (
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[1, 5]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#020617", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line type="monotone" dataKey="energia" name="Energia (Bateria)" stroke="#2dd4bf" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="sobrecarga" name="Sobrecarga Sensorial" stroke="#fbbf24" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* History Log List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-400" />
          Histórico de Registros
        </h2>

        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                    {log.date} {log.time}
                  </span>
                  <span className="text-xs font-bold capitalize text-slate-200">
                    Estado: {log.mood}
                  </span>
                </div>
                {log.notes && <p className="text-xs text-slate-300 italic">"{log.notes}"</p>}
                {log.triggers && log.triggers.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {log.triggers.map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="text-teal-300">🔋 Energia: {log.energyLevel}/5</div>
                <div className="text-amber-300">⚡ Sobrecarga: {log.sensoryLevel}/5</div>
                <button
                  onClick={() => handleDeleteEntry(log.id)}
                  className="text-slate-500 hover:text-rose-400 transition"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
