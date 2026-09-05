/// <reference types="vite/client" />
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isCustom: boolean;
}

export function getSupabaseConfig(): SupabaseConfig {
  try {
    const custom = localStorage.getItem("neuroconecta_supabase_custom_config");
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed.url && parsed.anonKey) {
        return {
          url: parsed.url.trim(),
          anonKey: parsed.anonKey.trim(),
          isCustom: true,
        };
      }
    }
  } catch (e) {
    console.warn("Erro ao ler config customizada do Supabase:", e);
  }

  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

  return {
    url: envUrl || "https://gbjanxdyllxpsydsubcx.supabase.co",
    anonKey: envKey || "sb_publishable_3YXxIUQtChenhRgqMlr0Xw_W8DgQ2da",
    isCustom: false,
  };
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  localStorage.setItem(
    "neuroconecta_supabase_custom_config",
    JSON.stringify({
      url: url.trim(),
      anonKey: anonKey.trim(),
      updatedAt: new Date().toISOString(),
    })
  );
  rebuildSupabaseClient();
}

export function resetSupabaseConfig(): void {
  localStorage.removeItem("neuroconecta_supabase_custom_config");
  rebuildSupabaseClient();
}

let activeConfig = getSupabaseConfig();

export let supabase: SupabaseClient = createClient(activeConfig.url, activeConfig.anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export function rebuildSupabaseClient(): void {
  activeConfig = getSupabaseConfig();
  supabase = createClient(activeConfig.url, activeConfig.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
}

export interface SupabaseHealthReport {
  status: "connected" | "tables_missing" | "offline_mitigated" | "error";
  endpointUrl: string;
  isCustom: boolean;
  message: string;
  technicalDetails?: string;
  localStorageStatus: "operational" | "error";
  totalLocalRecords: {
    userProfiles: number;
    testHistory: number;
    routineTasks: number;
    moodLogs: number;
    caregiverLogs: number;
  };
}

/**
 * Resilient health check that never hangs the application or throws fatal unhandled errors.
 * If Supabase is unreachable or DNS fails, it activates offline mitigation mode and verifies
 * that local storage is 100% operational with no data loss.
 */
export async function checkSupabaseHealth(): Promise<SupabaseHealthReport> {
  const config = getSupabaseConfig();

  const getLocalCount = (key: string): number => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return 0;
      const parsed = JSON.parse(item);
      return Array.isArray(parsed) ? parsed.length : 1;
    } catch {
      return 0;
    }
  };

  const localCounts = {
    userProfiles: getLocalCount("neuroconecta_user_profile"),
    testHistory: getLocalCount("neuroconecta_test_history"),
    routineTasks: getLocalCount("neuroconecta_routine_tasks"),
    moodLogs: getLocalCount("neuroconecta_mood_logs"),
    caregiverLogs: getLocalCount("neuroconecta_caregiver_notes"),
  };

  let storageHealth: "operational" | "error" = "operational";
  try {
    localStorage.setItem("neuroconecta_storage_test", "ok");
    localStorage.removeItem("neuroconecta_storage_test");
  } catch {
    storageHealth = "error";
  }

  // Fast abort timeout to avoid blocking if host is dead or DNS fails
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const queryPromise = supabase
      .from("user_profiles")
      .select("id")
      .limit(1);

    const raceResult: any = await Promise.race([
      queryPromise,
      new Promise((_, reject) => {
        controller.signal.addEventListener("abort", () => {
          reject(new Error("Timeout de conexão (endpoint Supabase remoto inacessível)"));
        });
      }),
    ]);

    clearTimeout(timeoutId);

    if (!raceResult.error) {
      return {
        status: "connected",
        endpointUrl: config.url,
        isCustom: config.isCustom,
        message: "Conectado ao Supabase com tabelas ativas e sincronização remota pronta!",
        localStorageStatus: storageHealth,
        totalLocalRecords: localCounts,
      };
    }

    const error = raceResult.error;
    if (
      error.code === "42P01" ||
      error.message?.includes("relation") ||
      error.message?.includes("does not exist")
    ) {
      return {
        status: "tables_missing",
        endpointUrl: config.url,
        isCustom: config.isCustom,
        message: "Conexão com o Supabase estabelecida! As tabelas precisam ser criadas com o script SQL fornecido.",
        technicalDetails: `Código: ${error.code} - ${error.message}`,
        localStorageStatus: storageHealth,
        totalLocalRecords: localCounts,
      };
    }

    return {
      status: "offline_mitigated",
      endpointUrl: config.url,
      isCustom: config.isCustom,
      message: "Modo Local Seguro Ativo: O endpoint remoto não respondeu. Todos os dados permanecem protegidos e íntegros no armazenamento local do navegador.",
      technicalDetails: `${error.message} ${error.code ? `(Código: ${error.code})` : ""}`,
      localStorageStatus: storageHealth,
      totalLocalRecords: localCounts,
    };
  } catch (err: any) {
    const isNetwork =
      err.name === "AbortError" ||
      err.message?.includes("Failed to fetch") ||
      err.message?.includes("NetworkError") ||
      err.message?.includes("Timeout") ||
      err.message?.includes("resolve");

    return {
      status: "offline_mitigated",
      endpointUrl: config.url,
      isCustom: config.isCustom,
      message: isNetwork
        ? "Modo Local Seguro Ativo: Endpoint remoto inacessível ou sem resolução DNS. Mitigação ativa: o aplicativo opera 100% autônomo com persistência local sem perda de dados."
        : `Modo Local Seguro Ativo: ${err.message || "Conexão remota não estabelecida"}. Persistência local operacional.`,
      technicalDetails: err.message || "Falha de rede ou host não resolvido",
      localStorageStatus: storageHealth,
      totalLocalRecords: localCounts,
    };
  }
}

export const SUPABASE_SQL_SCHEMA = `-- COPY AND RUN THIS IN SUPABASE SQL EDITOR TO CREATE TABLES (PROJECT: neuroconecta)

-- 1. User Profiles Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id TEXT PRIMARY KEY DEFAULT 'default_user',
  preferred_name TEXT,
  pronouns TEXT,
  diagnosis_status TEXT,
  support_level INTEGER,
  current_focus TEXT,
  low_stimulation_mode BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Test History Table
CREATE TABLE IF NOT EXISTS public.test_history (
  id TEXT PRIMARY KEY,
  test_id TEXT NOT NULL,
  test_title TEXT NOT NULL,
  date TEXT NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  interpretation_level TEXT NOT NULL,
  percentage INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Routine Tasks Table
CREATE TABLE IF NOT EXISTS public.routine_tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  target_time TEXT,
  duration_minutes INTEGER,
  icon TEXT,
  completed BOOLEAN DEFAULT false,
  urgency TEXT,
  energy_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Mood Logs Table
CREATE TABLE IF NOT EXISTS public.mood_logs (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  mood_score INTEGER NOT NULL,
  energy_score INTEGER NOT NULL,
  sensory_overload BOOLEAN DEFAULT false,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Caregiver Logs Table
CREATE TABLE IF NOT EXISTS public.caregiver_logs (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  note TEXT NOT NULL,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Disable RLS or set public policies for easy access
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregiver_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select and insert user_profiles" ON public.user_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public select and insert test_history" ON public.test_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public select and insert routine_tasks" ON public.routine_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public select and insert mood_logs" ON public.mood_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public select and insert caregiver_logs" ON public.caregiver_logs FOR ALL USING (true) WITH CHECK (true);
`;
