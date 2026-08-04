import React from "react";
import { 
  Bot, 
  ClipboardCheck, 
  CalendarCheck, 
  Waves, 
  MessageSquare, 
  BookOpen, 
  ShieldAlert, 
  Moon, 
  User, 
  Sparkles,
  HeartPulse,
  Users,
  FileText,
  Database,
  Lock,
  Headphones,
  Gamepad2,
  GraduationCap,
  Stethoscope,
} from "lucide-react";
import { UserProfile } from "../types";

export type NavTab = "chat" | "musicoterapia" | "jogos" | "testes" | "rotina" | "sensorial" | "humor" | "comunicacao" | "relatorio" | "cuidador" | "educacao" | "caps" | "supabase";

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  userProfile: UserProfile;
  onOpenCrisis: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  toggleLowStimMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenCrisis,
  onOpenProfile,
  onOpenAuth,
  toggleLowStimMode,
}) => {
  const isSuperAdmin = userProfile.isSuperAdmin || userProfile.email?.toLowerCase() === "sistemastop@gmail.com" || userProfile.userRole === "superadmin";
  const userRole = userProfile.userRole || (isSuperAdmin ? "superadmin" : "pcd");

  const allTabs = [
    { id: "chat", label: "Assistente IA", icon: Bot, roles: ["pcd", "cuidador_educador", "saude_caps", "superadmin"] },
    { id: "musicoterapia", label: "Musicoterapia & Som", icon: Headphones, roles: ["pcd", "cuidador_educador", "saude_caps", "superadmin"] },
    { id: "jogos", label: "Jogos & Relaxamento", icon: Gamepad2, roles: ["pcd", "cuidador_educador", "saude_caps", "superadmin"] },
    { id: "rotina", label: "Rotina Visual", icon: CalendarCheck, roles: ["pcd", "cuidador_educador", "superadmin"] },
    { id: "sensorial", label: "Regulação Sensorial", icon: Waves, roles: ["pcd", "cuidador_educador", "saude_caps", "superadmin"] },
    { id: "humor", label: "Diário & Humor", icon: HeartPulse, roles: ["pcd", "cuidador_educador", "saude_caps", "superadmin"] },
    { id: "comunicacao", label: "Comunicação AAC", icon: MessageSquare, roles: ["pcd", "cuidador_educador", "superadmin"] },
    { id: "testes", label: "Autoavaliação", icon: ClipboardCheck, roles: ["pcd", "cuidador_educador", "saude_caps", "superadmin"] },
    { id: "cuidador", label: "Cuidadores & PEI Especial", icon: GraduationCap, roles: ["cuidador_educador", "saude_caps", "superadmin"] },
    { id: "caps", label: "Saúde CAPS & Prontuário", icon: Stethoscope, roles: ["saude_caps", "superadmin"] },
    { id: "relatorio", label: "Relatórios & Laudo", icon: FileText, roles: ["cuidador_educador", "saude_caps", "superadmin"] },
    { id: "educacao", label: "Biblioteca", icon: BookOpen, roles: ["pcd", "cuidador_educador", "saude_caps", "superadmin"] },
    { id: "supabase", label: "Supabase DB (Admin)", icon: Database, adminOnly: true, roles: ["superadmin"] },
  ] as const;

  // Filter tabs by role unless superadmin or if user wants full view
  const tabs = allTabs.filter(tab => {
    if ('adminOnly' in tab && tab.adminOnly) return isSuperAdmin;
    if (isSuperAdmin) return true;
    return (tab.roles as readonly string[]).includes(userRole);
  });

  const getRoleLabel = () => {
    switch(userRole) {
      case "cuidador_educador": return "🎓 Educador / Cuidador";
      case "saude_caps": return "🩺 Saúde CAPS / Médico";
      case "superadmin": return "⚡ Superadmin TI";
      default: return "🧩 PCD Neurodivergente";
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("chat")}>
            <img 
              src="/neuroconecta_logo.svg" 
              alt="NeuroConecta Logo" 
              className="w-10 h-10 object-contain rounded-xl p-0.5 bg-slate-950 border border-teal-800/80 shadow-md"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-teal-200 via-emerald-300 to-cyan-200 bg-clip-text text-transparent">
                  NeuroConecta
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-bold">
                  SISTEMASTOP
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onOpenProfile(); }}
                className="text-left text-[11px] text-teal-400/90 font-medium hover:underline"
                title="Clique para alterar seu perfil de acesso"
              >
                {getRoleLabel()}
              </button>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* SOS Crisis Button */}
            <button
              onClick={onOpenCrisis}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-rose-900/30 flex items-center gap-1.5 transition active:scale-95 animate-pulse"
              title="Apoio imediato em sobrecarga ou meltdown"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>SOS Crise</span>
            </button>

            {/* Low-Stim Mode Toggle */}
            <button
              onClick={toggleLowStimMode}
              className={`p-2 rounded-xl border transition ${
                userProfile.lowStimulationMode
                  ? "bg-slate-800 text-teal-300 border-teal-600 shadow-inner"
                  : "bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800"
              }`}
              title={userProfile.lowStimulationMode ? "Modo de Baixa Estimulação Ativo" : "Ativar Modo Escuro de Baixa Estimulação"}
            >
              <Moon className="w-4 h-4" />
            </button>

            {/* Profile Button */}
            <button
              onClick={onOpenProfile}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition"
            >
              <User className="w-4 h-4 text-teal-400" />
              <span className="hidden md:inline max-w-[100px] truncate">
                {userProfile.preferredName || "Seu Perfil"}
              </span>
            </button>

            {/* Account / LGPD Auth Button */}
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-teal-950/90 hover:bg-teal-900 border border-teal-700/80 text-teal-200 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition shadow-sm"
              title="Acesso individual seguro & Proteção LGPD"
            >
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Acesso / Conta</span>
            </button>
          </div>

        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex overflow-x-auto no-scrollbar py-2 gap-1.5 border-t border-slate-800/60 text-xs sm:text-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as NavTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-teal-950 text-teal-200 border border-teal-700/80 shadow-md shadow-teal-950/50"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-teal-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
