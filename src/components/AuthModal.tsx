import React, { useState } from "react";
import { LogIn, UserPlus, ShieldCheck, Lock, Mail, User, CheckCircle2, AlertCircle, Sparkles, Key, LogOut, X } from "lucide-react";
import { UserProfile } from "../types";
import { supabase } from "../lib/supabase";

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
  const [mode, setMode] = useState<"login" | "register">("register");
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [userRole, setUserRole] = useState<"pcd" | "cuidador_educador" | "saude_caps" | "superadmin">("pcd");
  const [diagnosisStatus, setDiagnosisStatus] = useState("laudo_formal");
  const [lgpdConsent, setLgpdConsent] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
      // Create user unique ID based on email or supabase auth
      const userId = `usr_${email.trim().toLowerCase().replace(/[^a-z0-9]/g, "_")}`;

      // Try Supabase Auth sign up or store user profile
      let authUserId = userId;
      try {
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: { preferred_name: name.trim() }
          }
        });
        if (authData?.user?.id) {
          authUserId = authData.user.id;
        }
      } catch (sbErr) {
        console.warn("Supabase auth fallback to local account:", sbErr);
      }

      // Special check for Superadmin / Programmer email
      const isSuperAdminEmail = email.trim().toLowerCase() === "sistemastop@gmail.com";

      const newUser: UserProfile = {
        id: authUserId,
        email: email.trim().toLowerCase(),
        preferredName: name.trim() || (isSuperAdminEmail ? "Programador Admin" : "Usuário"),
        pronouns: "não informado",
        userRole: isSuperAdminEmail ? "superadmin" : userRole,
        diagnosisStatus: diagnosisStatus as any,
        supportLevel: 2,
        currentFocus: "geral",
        emergencyContacts: [],
        lowStimulationMode: false,
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
        isGuest: false,
        isSuperAdmin: isSuperAdminEmail,
      };

      // Save user account metadata in local vault list
      const accountsRaw = localStorage.getItem("neuroconecta_registered_accounts") || "[]";
      const accounts = JSON.parse(accountsRaw);
      const existingIdx = accounts.findIndex((a: any) => a.email === newUser.email);
      if (existingIdx >= 0) {
        accounts[existingIdx] = { email: newUser.email, password, user: newUser };
      } else {
        accounts.push({ email: newUser.email, password, user: newUser });
      }
      localStorage.setItem("neuroconecta_registered_accounts", JSON.stringify(accounts));

      // Also attempt sync to Supabase table
      try {
        await supabase.from("user_profiles").upsert({
          id: authUserId,
          preferred_name: newUser.preferredName,
          diagnosis_status: newUser.diagnosisStatus,
          support_level: newUser.supportLevel,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn("Supabase upsert sync warning:", err);
      }

      setSuccessMessage("Conta criada com sucesso! Você foi conectado no seu ambiente isolado.");
      setTimeout(() => {
        onLoginSuccess(newUser);
        onClose();
      }, 1000);

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

      // Check Superadmin programmer master login
      if (cleanEmail === "sistemastop@gmail.com") {
        if (password === "^Shutdown0") {
          const superAdminUser: UserProfile = {
            id: "superadmin_sistemastop",
            email: "sistemastop@gmail.com",
            preferredName: "Programador Admin",
            pronouns: "ele/dele",
            diagnosisStatus: "laudo_formal",
            supportLevel: 2,
            currentFocus: "geral",
            emergencyContacts: [],
            lowStimulationMode: false,
            onboardingCompleted: true,
            isGuest: false,
            isSuperAdmin: true,
          };

          setSuccessMessage("Autenticado com Sucesso como Superadmin / Programador! Módulo Supabase DB liberado.");
          setTimeout(() => {
            onLoginSuccess(superAdminUser);
            onClose();
          }, 800);
          return;
        } else {
          setErrorMessage("Senha incorreta para a conta Superadmin/Programador.");
          setLoading(false);
          return;
        }
      }

      const accountsRaw = localStorage.getItem("neuroconecta_registered_accounts") || "[]";
      const accounts = JSON.parse(accountsRaw);

      const found = accounts.find((a: any) => a.email === cleanEmail && a.password === password);

      if (found && found.user) {
        setSuccessMessage(`Bem-vindo(a) de volta, ${found.user.preferredName}!`);
        setTimeout(() => {
          onLoginSuccess(found.user);
          onClose();
        }, 800);
        return;
      }

      // Try Supabase auth if not found locally
      try {
        const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (authData?.user) {
          const loadedUser: UserProfile = {
            id: authData.user.id,
            email: cleanEmail,
            preferredName: authData.user.user_metadata?.preferred_name || cleanEmail.split("@")[0],
            pronouns: "não informado",
            diagnosisStatus: "laudo_formal",
            supportLevel: 2,
            currentFocus: "geral",
            emergencyContacts: [],
            lowStimulationMode: false,
            onboardingCompleted: true,
            isGuest: false,
          };
          onLoginSuccess(loadedUser);
          onClose();
          return;
        }
      } catch (sErr) {
        console.warn("Supabase login check:", sErr);
      }

      setErrorMessage("E-mail ou senha incorretos. Se é sua primeira vez, clique na aba 'Criar Conta'.");
    } catch (err: any) {
      setErrorMessage("Erro ao efetuar login. Verifique seus dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md animate-fadeIn transition-colors ${
      isDark ? "bg-slate-950/80" : "bg-slate-900/50"
    }`}>
      <div className={`border rounded-3xl max-w-lg w-full shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden transition ${
        isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
      }`}>
        
        {/* Header */}
        <div className={`flex-shrink-0 p-4 sm:p-5 border-b flex items-center justify-between backdrop-blur transition ${
          isDark ? "bg-slate-900/95 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-900"
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 sm:p-2.5 rounded-2xl border ${
              isDark ? "bg-teal-950 border-teal-800 text-teal-400" : "bg-teal-50 border-teal-200 text-teal-600"
            }`}>
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-bold leading-tight ${
                isDark ? "text-slate-100" : "text-slate-900"
              }`}>
                Acesso Individual & LGPD
              </h2>
              <p className={`text-[11px] sm:text-xs ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}>
                Cada usuário tem seus dados 100% isolados
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
                {loading ? "Entrando..." : "Entrar com Meus Dados Isolados"}
              </button>
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
                    <Sparkles className="w-3.5 h-3.5 text-teal-500" /> Perfil de Acesso
                  </label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as any)}
                    className={`w-full px-3 py-2 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 truncate transition ${
                      isDark ? "bg-slate-950 border-teal-800/80 text-slate-100" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  >
                    <option value="pcd" className={isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}>🧩 Pessoa Neurodivergente / PCD (Interface Calma & Autorregulação)</option>
                    <option value="cuidador_educador" className={isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}>🎓 Educador Especial / Cuidador / Pai (Módulo PEI & Orientação)</option>
                    <option value="saude_caps" className={isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}>🩺 Médico / Enfermeiro / Saúde Mental CAPS (Prontuário & Escalas)</option>
                    <option value="superadmin" className={isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}>⚡ Gestor / Superadmin de TI (Acesso Geral & Banco)</option>
                  </select>
                </div>

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
