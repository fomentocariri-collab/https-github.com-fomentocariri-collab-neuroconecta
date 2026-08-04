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
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl text-slate-100 flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex-shrink-0 p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-teal-950 border border-teal-800 text-teal-400">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 leading-tight">Acesso Individual & LGPD</h2>
              <p className="text-[11px] sm:text-xs text-slate-400">Cada usuário tem seus dados 100% isolados</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition text-sm font-bold"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Current Active Account Card */}
          {currentUser && (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5 min-w-0">
                <p className="text-slate-400 text-[11px]">Conectado atualmente como:</p>
                <p className="font-bold text-teal-300 flex items-center gap-1.5 truncate">
                  <User className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{currentUser.preferredName} ({currentUser.email || "Sessão Local"})</span>
                </p>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setSuccessMessage("Você saiu da conta atual.");
                }}
                className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold rounded-xl flex items-center gap-1 transition text-xs"
              >
                <LogOut className="w-3.5 h-3.5" /> Sair
              </button>
            </div>
          )}

          {/* Auth Mode Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => { setMode("login"); setErrorMessage(""); }}
              className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                mode === "login" ? "bg-teal-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" /> Entrar na Conta
            </button>
            <button
              onClick={() => { setMode("register"); setErrorMessage(""); }}
              className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                mode === "register" ? "bg-teal-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Criar Conta
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-teal-400" /> E-mail de Acesso
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-teal-400" /> Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-teal-950/50"
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
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-teal-400" /> Nome / Apelido
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Como prefere ser chamado(a)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-teal-400" /> Seu E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-teal-400" /> Criar Senha
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-teal-400" /> Confirmar Senha
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita sua senha"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-teal-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Perfil de Acesso
                  </label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-teal-800/80 rounded-xl text-xs text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 truncate"
                  >
                    <option value="pcd">🧩 Pessoa Neurodivergente / PCD (Interface Calma & Autorregulação)</option>
                    <option value="cuidador_educador">🎓 Educador Especial / Cuidador / Pai (Módulo PEI & Orientação)</option>
                    <option value="saude_caps">🩺 Médico / Enfermeiro / Saúde Mental CAPS (Prontuário & Escalas)</option>
                    <option value="superadmin">⚡ Gestor / Superadmin de TI (Acesso Geral & Banco)</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Situação Diagnóstica
                  </label>
                  <select
                    value={diagnosisStatus}
                    onChange={(e) => setDiagnosisStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 truncate"
                  >
                    <option value="laudo_formal">Possuo laudo formal confirmado</option>
                    <option value="investigacao">Em processo de investigação</option>
                    <option value="autodiagnosticado">Autodiagnosticado / Identificação</option>
                    <option value="familiar_apoiador">Familiar / Cuidador</option>
                    <option value="nao_informado">Prefiro não informar</option>
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
                  className="mt-0.5 rounded border-slate-700 bg-slate-950 text-teal-500 focus:ring-teal-500"
                />
                <label htmlFor="lgpd" className="text-[11px] text-slate-300 leading-snug">
                  Concordo com o tratamento seguro dos meus dados no meu espaço exclusivo, em conformidade com a <strong>LGPD (Lei Geral de Proteção de Dados)</strong>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-teal-950/50"
              >
                {loading ? "Criando Conta..." : "Criar Minha Conta Segura"}
              </button>
            </form>
          )}

        </div>

        {/* Sticky Footer */}
        <div className="flex-shrink-0 p-3 sm:px-5 bg-slate-950/90 border-t border-slate-800/80 text-[11px] text-center text-slate-500 leading-relaxed rounded-b-3xl">
          🔒 Seus testes, rotinas, registros de humor e notas de atendimento não são expostos nem compartilhados com outros visitantes.
        </div>

      </div>
    </div>
  );
};
