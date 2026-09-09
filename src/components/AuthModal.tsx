import React, { useState, useEffect } from "react";
import { LogIn, UserPlus, ShieldCheck, Lock, Mail, User, CheckCircle2, AlertCircle, Sparkles, Key, LogOut, X, Calendar, Server, RefreshCw, Check, Globe } from "lucide-react";
import { UserProfile, UserRole, ProfessionalRoleType, getAgeCategory, calculateAge } from "../types";
import { useCurrentUser } from "../contexts/AuthContext";
import { getSupabaseConfig, saveSupabaseConfig, resetSupabaseConfig, checkSupabaseHealth, SupabaseHealthReport } from "../lib/supabase";
import neuroconectaLogo from "../assets/logo";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  isDark?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  isDark = true,
}) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  
  // Form states
  const [email, setEmail] = useState("fomentocariri@gmail.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("Fomento Cariri");
  const [birthDate, setBirthDate] = useState("2012-05-15");
  const [userRole, setUserRole] = useState<UserRole>("superadmin");
  const [professionalRoleType, setProfessionalRoleType] = useState<ProfessionalRoleType>("medico");
  const [professionalRegisterNumber, setProfessionalRegisterNumber] = useState("");
  const [diagnosisStatus, setDiagnosisStatus] = useState("laudo_formal");
  const [lgpdConsent, setLgpdConsent] = useState(true);
  
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Supabase Endpoint Configuration Drawer State
  const [showEndpointConfig, setShowEndpointConfig] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [customAnonKey, setCustomAnonKey] = useState("");
  const [healthReport, setHealthReport] = useState<SupabaseHealthReport | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  const { signIn, signUp, signInLocal, isOfflineMode } = useCurrentUser();

  useEffect(() => {
    if (isOpen) {
      const cfg = getSupabaseConfig();
      setCustomUrl(cfg.url);
      setCustomAnonKey(cfg.anonKey);
      runQuickHealthCheck();
    }
  }, [isOpen]);

  const runQuickHealthCheck = async () => {
    setCheckingHealth(true);
    try {
      const rep = await checkSupabaseHealth();
      setHealthReport(rep);
    } catch {
      // Ignored
    } finally {
      setCheckingHealth(false);
    }
  };

  const handleSaveEndpoint = () => {
    if (!customUrl.trim() || !customAnonKey.trim()) {
      setErrorMessage("Informe a URL e a Anon Key do Supabase.");
      return;
    }
    saveSupabaseConfig(customUrl.trim(), customAnonKey.trim());
    setSuccessMessage("Configuração do Supabase salva com sucesso! Reconectando...");
    setTimeout(() => {
      runQuickHealthCheck();
    }, 500);
  };

  const handleResetEndpoint = () => {
    resetSupabaseConfig();
    const cfg = getSupabaseConfig();
    setCustomUrl(cfg.url);
    setCustomAnonKey(cfg.anonKey);
    setSuccessMessage("Configuração restaurada para o padrão oficial.");
    setTimeout(() => {
      runQuickHealthCheck();
    }, 500);
  };

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!name.trim()) {
      setErrorMessage("Por favor, informe seu nome ou apelido preferido.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Por favor, informe um e-mail válido.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("A confirmação de senha não confere com a senha digitada.");
      return;
    }
    if (!lgpdConsent) {
      setErrorMessage("Para sua segurança (LGPD), você precisa concordar com o isolamento dos seus dados.");
      return;
    }

    setLoading(true);

    try {
      const isSuperAdminEmail = email.trim().toLowerCase() === "sistemastop@gmail.com" || email.trim().toLowerCase() === "fomentocariri@gmail.com" || userRole === "superadmin";

      const res = await signUp(email, password, {
        preferredName: name.trim(),
        userRole: isSuperAdminEmail ? "superadmin" : userRole,
        professionalRoleType: isSuperAdminEmail ? "medico" : professionalRoleType,
        professionalRegisterNumber: professionalRegisterNumber.trim() || undefined,
        diagnosisStatus: diagnosisStatus as any,
        birthDate: birthDate,
      });

      if (res.error) {
        setErrorMessage(res.error);
        setLoading(false);
        return;
      }

      if (res.isOfflineFallback) {
        setSuccessMessage("Conta criada em Modo Local Seguro! Seus dados e preferências estão salvos neste dispositivo.");
      } else {
        setSuccessMessage("Conta criada com sucesso no Supabase! Sessão canônica ativa.");
      }

      setTimeout(() => {
        if (res.user) {
          onLoginSuccess({
            id: res.user.id,
            email: res.user.email,
            preferredName: name.trim(),
            pronouns: "não informado",
            birthDate: birthDate,
            userRole: isSuperAdminEmail ? "superadmin" : userRole,
            professionalRoleType: isSuperAdminEmail ? "medico" : professionalRoleType,
            professionalRegisterNumber: professionalRegisterNumber.trim() || undefined,
            diagnosisStatus: diagnosisStatus as any,
            supportLevel: "nao_especificado",
            currentFocus: "geral",
            emergencyContacts: [],
            lowStimulationMode: false,
            onboardingCompleted: true,
            isGuest: false,
            isSuperAdmin: isSuperAdminEmail,
          });
        }
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err?.message || "Ocorreu um erro ao criar a conta.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Preencha o e-mail e a senha para entrar.");
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await signIn(cleanEmail, password);

      if (res.error) {
        setErrorMessage(res.error);
        setLoading(false);
        return;
      }

      if (res.isOfflineFallback) {
        setSuccessMessage("Entrando em Modo Local Seguro (Nuvem offline - seus dados e perfil permanecem protegidos neste dispositivo).");
      } else {
        setSuccessMessage("Autenticado com sucesso via Supabase Auth!");
      }

      setTimeout(() => {
        if (res.user) {
          onLoginSuccess({
            id: res.user.id,
            email: res.user.email,
            preferredName: res.user.user_metadata?.preferred_name || cleanEmail.split("@")[0],
            pronouns: "não informado",
            diagnosisStatus: "nao_informado",
            supportLevel: "nao_especificado",
            currentFocus: "geral",
            emergencyContacts: [],
            lowStimulationMode: false,
            onboardingCompleted: true,
            isGuest: false,
          });
        }
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorMessage("Erro ao efetuar login. Ativando contingência local...");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDirectLogin = async (targetEmail: string, targetName?: string, targetRole?: UserRole) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("Acessando em Modo Local Seguro...");

    try {
      const res = await signInLocal(targetEmail, targetName, targetRole);
      setSuccessMessage(`Acesso liberado para ${targetEmail}!`);
      setTimeout(() => {
        if (res.user) {
          onLoginSuccess({
            id: res.user.id,
            email: res.user.email,
            preferredName: targetName || targetEmail.split("@")[0],
            pronouns: "não informado",
            diagnosisStatus: "laudo_formal",
            supportLevel: "nao_especificado",
            currentFocus: "geral",
            emergencyContacts: [],
            lowStimulationMode: false,
            onboardingCompleted: true,
            isGuest: false,
            isSuperAdmin: targetRole === "superadmin" || targetEmail === "fomentocariri@gmail.com" || targetEmail === "sistemastop@gmail.com",
          });
        }
        onClose();
      }, 400);
    } catch (err: any) {
      setErrorMessage("Erro no acesso local: " + (err?.message || "Tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn transition-colors">
      <div className={`border rounded-3xl max-w-lg w-full shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden transition ${
        isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
      }`}>
        
        {/* Header with White Logo Box */}
        <div className={`flex-shrink-0 p-4 sm:p-5 border-b flex items-center justify-between backdrop-blur transition ${
          isDark ? "bg-slate-900/95 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-900"
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white border border-teal-200 rounded-2xl shadow-sm shrink-0">
              <img 
                src={neuroconectaLogo} 
                alt="Logo NeuroConecta" 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain aspect-square"
              />
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-extrabold leading-tight ${
                isDark ? "text-slate-100" : "text-slate-900"
              }`}>
                Acesso Individual & LGPD
              </h2>
              <p className={`text-[11px] sm:text-xs font-medium ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}>
                NeuroConecta • Conexões que acolhem e transformam
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition text-sm font-bold ${
              isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Current Active Account Card */}
          {currentUser && (
            <div className={`p-3 border rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs ${
              isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="space-y-0.5 min-w-0">
                <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-600"}`}>Conectado atualmente como:</p>
                <p className={`font-bold flex items-center gap-1.5 truncate ${
                  isDark ? "text-teal-300" : "text-teal-700"
                }`}>
                  <User className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{currentUser.preferredName} ({currentUser.email || "Sessão Local"})</span>
                </p>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setSuccessMessage("Você saiu da conta atual.");
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl flex items-center gap-1 transition text-xs shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" /> Sair
              </button>
            </div>
          )}

          {/* Auth Mode Tabs */}
          <div className={`grid grid-cols-2 gap-2 p-1 rounded-2xl border text-xs font-bold ${
            isDark ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"
          }`}>
            <button
              onClick={() => { setMode("login"); setErrorMessage(""); }}
              className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                mode === "login"
                  ? "bg-teal-600 text-white shadow"
                  : isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" /> Entrar na Conta
            </button>
            <button
              onClick={() => { setMode("register"); setErrorMessage(""); }}
              className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                mode === "register"
                  ? "bg-teal-600 text-white shadow"
                  : isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Criar Conta
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className={`p-3 border rounded-xl text-xs flex items-center gap-2 ${
              isDark ? "bg-rose-950/60 border-rose-800 text-rose-300" : "bg-rose-50 border-rose-200 text-rose-800"
            }`}>
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className={`p-3 border rounded-xl text-xs flex items-center gap-2 ${
              isDark ? "bg-emerald-950/60 border-emerald-800 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1">
                <label className={`text-xs font-semibold flex items-center gap-1 ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}>
                  <Mail className="w-3.5 h-3.5 text-teal-500" /> E-mail de Acesso
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className={`w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${
                    isDark ? "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500" : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-semibold flex items-center gap-1 ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}>
                  <Lock className="w-3.5 h-3.5 text-teal-500" /> Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${
                    isDark ? "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500" : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition shadow-md"
              >
                {loading ? "Verificando..." : "Entrar com Senha"}
              </button>

              {/* Quick Offline / Local Contingency Access Block */}
              <div className={`p-3 rounded-2xl border space-y-2 mt-3 ${
                isDark ? "bg-slate-950/80 border-slate-800" : "bg-teal-50/70 border-teal-200"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Acesso Local Imediato (Sem Bloqueio de Rede)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-300 font-bold">
                    Offline Seguro
                  </span>
                </div>
                <p className={`text-[11px] leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Se o servidor Supabase estiver inacessível ou se preferir acesso imediato, entre direto no Modo Local Seguro:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleQuickDirectLogin("fomentocariri@gmail.com", "Fomento Cariri", "superadmin")}
                    disabled={loading}
                    className="py-2 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <Key className="w-3.5 h-3.5" /> Administrador (Cariri)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDirectLogin(email.trim() || "usuario@local.dev", name.trim() || "Usuário Local", userRole)}
                    disabled={loading}
                    className={`py-2 px-2.5 border rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${
                      isDark ? "bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800" : "bg-white border-teal-300 text-teal-900 hover:bg-teal-100"
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5 text-teal-500" /> Entrar com {email.trim() ? email.split("@")[0] : "E-mail"}
                  </button>
                </div>
              </div>

              {/* Collapsible Supabase Endpoint Settings */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowEndpointConfig(!showEndpointConfig)}
                  className={`text-[11px] font-bold flex items-center gap-1.5 transition ${
                    isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Server className="w-3.5 h-3.5 text-teal-500" />
                  <span>Configurar Endpoint Supabase {showEndpointConfig ? "▲" : "▼"}</span>
                  {healthReport && (
                    <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      healthReport.status === "connected"
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                    }`}>
                      {healthReport.status === "connected" ? "Supabase Online" : "Modo Local Ativo"}
                    </span>
                  )}
                </button>

                {showEndpointConfig && (
                  <div className={`mt-2 p-3 border rounded-2xl space-y-2 text-xs animate-fadeIn ${
                    isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">URL do Projeto Supabase</label>
                      <input
                        type="text"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        placeholder="https://seu-projeto.supabase.co"
                        className={`w-full px-2.5 py-1.5 border rounded-xl text-xs ${
                          isDark ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-300 text-slate-900"
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">Chave Anônima (Anon Key)</label>
                      <input
                        type="text"
                        value={customAnonKey}
                        onChange={(e) => setCustomAnonKey(e.target.value)}
                        placeholder="eyJhbGciOi..."
                        className={`w-full px-2.5 py-1.5 border rounded-xl text-xs ${
                          isDark ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white border-slate-300 text-slate-900"
                        }`}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={runQuickHealthCheck}
                        disabled={checkingHealth}
                        className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded-lg flex items-center gap-1 font-semibold"
                      >
                        <RefreshCw className={`w-3 h-3 ${checkingHealth ? "animate-spin" : ""}`} /> Testar
                      </button>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={handleResetEndpoint}
                          className="py-1 px-2.5 border border-slate-700 text-slate-400 hover:text-slate-200 text-[11px] rounded-lg"
                        >
                          Restaurar Padrão
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveEndpoint}
                          className="py-1 px-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] rounded-lg flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Salvar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          )}

          {/* Register Form */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`text-xs font-semibold flex items-center gap-1 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}>
                    <User className="w-3.5 h-3.5 text-teal-500" /> Nome / Apelido
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Como prefere ser chamado(a)"
                    className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${
                      isDark ? "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500" : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-semibold flex items-center justify-between ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-500" /> Data de Nascimento
                    </span>
                    <span className="text-[10px] font-bold text-teal-400 bg-teal-950/80 px-1.5 py-0.5 rounded border border-teal-800">
                      {getAgeCategory(birthDate)} ({calculateAge(birthDate) !== null ? `${calculateAge(birthDate)} anos` : "N/A"})
                    </span>
                  </label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${
                      isDark ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-semibold flex items-center gap-1 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}>
                    <Mail className="w-3.5 h-3.5 text-teal-500" /> Seu E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${
                      isDark ? "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500" : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-semibold flex items-center gap-1 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}>
                    <Lock className="w-3.5 h-3.5 text-teal-500" /> Criar Senha
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${
                      isDark ? "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500" : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-semibold flex items-center gap-1 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}>
                    <Lock className="w-3.5 h-3.5 text-teal-500" /> Confirmar Senha
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita sua senha"
                    className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${
                      isDark ? "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500" : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className={`text-xs font-semibold flex items-center gap-1 ${
                    isDark ? "text-teal-300" : "text-teal-700"
                  }`}>
                    <Sparkles className="w-3.5 h-3.5 text-teal-500" /> Perfil Módulo de Acesso
                  </label>
                  <select
                    value={userRole}
                    onChange={(e) => {
                      const newRole = e.target.value as any;
                      setUserRole(newRole);
                      if (newRole === "cuidador_educador" || newRole === "educador_aee") setProfessionalRoleType("educador");
                      else if (newRole === "profissional_apoio") setProfessionalRoleType("terapeuta");
                      else setProfessionalRoleType("pcd");
                    }}
                    className={`w-full px-3 py-2 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 truncate transition ${
                      isDark ? "bg-slate-950 border-teal-800/80 text-slate-100" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  >
                    <option value="pcd" className={isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}>🧩 Pessoa / Usuário(a) (Autonomia, rotinas e autorregulação)</option>
                    <option value="cuidador_familiar" className={isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}>🏡 Família / Cuidador(a) (Apoio compartilhado e diário)</option>
                    <option value="cuidador_educador" className={isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}>🎓 Educador(a) / Escola / AEE (Acomodações DUA e PEI)</option>
                    <option value="profissional_apoio" className={isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}>🤝 Profissional de Apoio (Terapia, Psicologia e Apoio Funcional)</option>
                    <option value="superadmin" className={isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}>⚡ Administrador(a) do Sistema (Gestão técnica)</option>
                  </select>
                </div>

                {/* Sub-role and Professional Registration Number */}
                {userRole === "profissional_apoio" && (
                  <>
                    <div className="space-y-1">
                      <label className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        Área de Atuação
                      </label>
                      <select
                        value={professionalRoleType}
                        onChange={(e) => setProfessionalRoleType(e.target.value as any)}
                        className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                          isDark ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300 text-slate-900"
                        }`}
                      >
                        <option value="terapeuta">Terapeuta Ocupacional / Fonoaudiólogo(a)</option>
                        <option value="psicologo">Psicólogo(a) / Neuropsicólogo(a)</option>
                        <option value="educador">Psicopedagogo(a) / Especialista em Inclusão</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                        Registro no Conselho Profissional
                      </label>
                      <input
                        type="text"
                        value={professionalRegisterNumber}
                        onChange={(e) => setProfessionalRegisterNumber(e.target.value)}
                        placeholder="Ex: CREFITO, CRP, CRFa, etc."
                        className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${
                          isDark ? "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500" : "bg-slate-50 border-slate-300 text-slate-900"
                        }`}
                      />
                    </div>
                  </>
                )}

                {(userRole === "cuidador_educador" || (userRole as string) === "educador_aee") && (
                  <div className="space-y-1 sm:col-span-2">
                    <label className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Instituição Escolar / Registro de Docência
                    </label>
                    <input
                      type="text"
                      value={professionalRegisterNumber}
                      onChange={(e) => setProfessionalRegisterNumber(e.target.value)}
                      placeholder="Ex: Matrícula Escolar ou Registro Docente"
                      className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                        isDark ? "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                )}

                {userRole === "pcd" && (
                  <div className="space-y-1 sm:col-span-2">
                    <label className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                      Carteira CIPTEA / Cartão BPC (Opcional)
                    </label>
                    <input
                      type="text"
                      value={professionalRegisterNumber}
                      onChange={(e) => setProfessionalRegisterNumber(e.target.value)}
                      placeholder="Ex: CIPTEA-CE 2026/001 ou NB BPC 123.456"
                      className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition ${
                        isDark ? "bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                )}

                <div className="space-y-1 sm:col-span-2">
                  <label className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                    Situação Diagnóstica
                  </label>
                  <select
                    value={diagnosisStatus}
                    onChange={(e) => setDiagnosisStatus(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 truncate transition ${
                      isDark ? "bg-slate-950 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  >
                    <option value="laudo_formal" className={isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}>Possuo laudo formal confirmado</option>
                    <option value="investigacao" className={isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}>Em processo de investigação</option>
                    <option value="autodiagnosticado" className={isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}>Autodiagnosticado / Identificação</option>
                    <option value="familiar_apoiador" className={isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}>Familiar / Cuidador</option>
                    <option value="nao_informado" className={isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}>Prefiro não informar</option>
                  </select>
                </div>
              </div>

              {/* LGPD Checkbox */}
              <div className="pt-1 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="lgpd"
                  checked={lgpdConsent}
                  onChange={(e) => setLgpdConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-400 bg-slate-100 dark:bg-slate-950 text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <label htmlFor="lgpd" className={`text-[11px] leading-snug cursor-pointer ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}>
                  Concordo com o tratamento seguro dos meus dados no meu espaço exclusivo, em conformidade com a <strong>LGPD (Lei Geral de Proteção de Dados)</strong>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition shadow-md"
              >
                {loading ? "Criando Conta..." : "Criar Minha Conta Segura"}
              </button>
            </form>
          )}

        </div>

        {/* Sticky Footer */}
        <div className={`flex-shrink-0 p-3 sm:px-5 border-t text-[11px] text-center leading-relaxed rounded-b-3xl ${
          isDark ? "bg-slate-950/90 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"
        }`}>
          🔒 Seus testes, rotinas, registros de humor e notas de atendimento não são expostos nem compartilhados com outros visitantes.
        </div>

      </div>
    </div>
  );
};
