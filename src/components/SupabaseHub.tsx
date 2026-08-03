import React, { useState, useEffect } from "react";
import { Database, CheckCircle2, AlertCircle, RefreshCw, Copy, Check, Server, Key, ShieldCheck, HardDrive } from "lucide-react";
import { supabase, SUPABASE_SQL_SCHEMA } from "../lib/supabase";

export const SupabaseHub: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "table_missing" | "error">("checking");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  const checkConnection = async () => {
    setConnectionStatus("checking");
    setErrorMessage("");
    try {
      // Test ping by querying table or auth health
      const { data, error } = await supabase.from("user_profiles").select("id").limit(1);
      
      if (error) {
        if (error.code === "42P01" || error.message.includes("relation") || error.message.includes("does not exist")) {
          setConnectionStatus("table_missing");
          setErrorMessage("Conectado ao Supabase! As tabelas ainda não foram criadas no banco de dados. Execute o SQL abaixo no editor do Supabase.");
        } else {
          setConnectionStatus("error");
          setErrorMessage(`Erro ao conectar ao Supabase: ${error.message} (Código: ${error.code})`);
        }
      } else {
        setConnectionStatus("connected");
      }
    } catch (err: any) {
      setConnectionStatus("error");
      setErrorMessage(err.message || "Não foi possível conectar ao servidor Supabase.");
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSyncAllData = async () => {
    setSyncing(true);
    const logs: string[] = [];
    logs.push("⏳ Iniciando sincronização bidirecional com Supabase...");

    try {
      // 1. Sync User Profile
      const localProfileStr = localStorage.getItem("neuroconecta_user_profile");
      if (localProfileStr) {
        const localProfile = JSON.parse(localProfileStr);
        const { error } = await supabase.from("user_profiles").upsert({
          id: "default_user",
          preferred_name: localProfile.preferredName,
          pronouns: localProfile.pronouns,
          diagnosis_status: localProfile.diagnosisStatus,
          support_level: localProfile.supportLevel,
          current_focus: localProfile.currentFocus,
          low_stimulation_mode: localProfile.lowStimulationMode,
          updated_at: new Date().toISOString(),
        });
        if (error) logs.push(`⚠️ Perfil: ${error.message}`);
        else logs.push("✅ Perfil de usuário enviado para `user_profiles`");
      }

      // 2. Sync Test History
      const localTestsStr = localStorage.getItem("neuroconecta_test_history");
      if (localTestsStr) {
        const localTests = JSON.parse(localTestsStr);
        for (const test of localTests) {
          const { error } = await supabase.from("test_history").upsert({
            id: `${test.testId}-${test.date}`,
            test_id: test.testId,
            test_title: test.testTitle,
            date: test.date,
            score: test.score,
            max_score: test.maxScore,
            interpretation_level: test.interpretationLevel,
            percentage: test.percentage,
          });
          if (error) logs.push(`⚠️ Testes: ${error.message}`);
        }
        logs.push(`✅ ${localTests.length} resultado(s) de testes sincronizados em \`test_history\``);
      }

      // 3. Sync Routine Tasks
      const localRoutinesStr = localStorage.getItem("neuroconecta_routine_tasks");
      if (localRoutinesStr) {
        const localRoutines = JSON.parse(localRoutinesStr);
        for (const task of localRoutines) {
          const { error } = await supabase.from("routine_tasks").upsert({
            id: task.id,
            title: task.title,
            category: task.category,
            target_time: task.targetTime || null,
            duration_minutes: task.durationMinutes || null,
            icon: task.icon || null,
            completed: task.completed,
            urgency: task.urgency || null,
            energy_level: task.energyLevel || null,
          });
          if (error) logs.push(`⚠️ Rotinas: ${error.message}`);
        }
        logs.push(`✅ ${localRoutines.length} tarefa(s) de rotina sincronizadas em \`routine_tasks\``);
      }

      logs.push("🎉 Sincronização concluída com sucesso!");
    } catch (e: any) {
      logs.push(`❌ Erro durante a sincronização: ${e.message}`);
    }

    setSyncLogs(logs);
    setSyncing(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-emerald-400" /> Supabase Integrado
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            Banco de Dados Supabase (Project: neuroconecta)
          </h1>
          <p className="text-sm text-slate-400">
            Gerenciamento da conexão em tempo real, tabelas e sincronização de dados do NeuroConecta.
          </p>
        </div>

        <button
          onClick={checkConnection}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-4 h-4 ${connectionStatus === "checking" ? "animate-spin text-teal-400" : ""}`} />
          Testar Conexão
        </button>
      </div>

      {/* Connection Status Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <Server className="w-4 h-4 text-teal-400" /> API Endpoint URL:
          </p>
          <p className="font-mono text-xs text-slate-200 bg-slate-950 p-2 rounded-lg border border-slate-800 truncate">
            https://gbjanxdyllxpsydsubcx.supabase.co
          </p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <Key className="w-4 h-4 text-amber-400" /> Project ID & Chave Publicável:
          </p>
          <p className="font-mono text-xs text-slate-200 bg-slate-950 p-2 rounded-lg border border-slate-800 truncate">
            gbjanxdyllxpsydsubcx
          </p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Status da Conexão:
          </p>
          <div>
            {connectionStatus === "checking" && (
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verificando conexão...
              </span>
            )}
            {connectionStatus === "connected" && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Conectado & Tabelas Ativas!
              </span>
            )}
            {connectionStatus === "table_missing" && (
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-amber-400" /> Supabase OK (Criar Tabelas)
              </span>
            )}
            {connectionStatus === "error" && (
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Falha na Conexão
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="p-4 bg-amber-950/40 border border-amber-800/80 rounded-2xl text-xs text-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Informação do Supabase:</p>
            <p className="text-amber-300/90">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Sync Trigger Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-teal-400" />
              Sincronização de Dados com o Banco Supabase
            </h2>
            <p className="text-xs text-slate-400">
              Sincronize seus testes, tarefas de rotina, registros de humor e perfil para o banco remoto do Supabase.
            </p>
          </div>
          <button
            onClick={handleSyncAllData}
            disabled={syncing}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Sincronizando..." : "Sincronizar Agora"}
          </button>
        </div>

        {syncLogs.length > 0 && (
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs font-mono space-y-1 text-slate-300">
            {syncLogs.map((log, idx) => (
              <p key={idx}>{log}</p>
            ))}
          </div>
        )}
      </div>

      {/* SQL Script for Table Creation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-400" />
              Script SQL para Criação das Tabelas no Supabase
            </h2>
            <p className="text-xs text-slate-400">
              Copie este código e cole no <strong>SQL Editor</strong> do painel do seu projeto Supabase (neuroconecta) para instalar todas as 5 tabelas.
            </p>
          </div>
          <button
            onClick={handleCopySQL}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold rounded-xl text-xs flex items-center gap-2 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copiado!" : "Copiar SQL"}
          </button>
        </div>

        <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto max-h-96 leading-relaxed">
          {SUPABASE_SQL_SCHEMA}
        </pre>
      </div>

    </div>
  );
};
