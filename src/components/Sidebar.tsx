import React, { useState, useEffect } from "react";
import neuroconectaLogo from "../assets/logo";
import { 
  Bot, 
  ClipboardCheck, 
  CalendarCheck, 
  Waves, 
  MessageSquare, 
  BookOpen, 
  ShieldAlert, 
  Moon, 
  Sun,
  User, 
  Sparkles,
  Users,
  FileText,
  Database,
  Lock,
  Headphones,
  Gamepad2,
  GraduationCap,
  Pill,
  Settings,
  Share2,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Sliders,
  Smile,
  HeartHandshake
} from "lucide-react";
import { UserProfile, NavTab, InteractionProfile } from "../types";
import { 
  getInteractionProfile, 
  listPersonasForUser, 
  calculateProfileCompleteness 
} from "../services/interactionProfileService";

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  userProfile: UserProfile;
  activePersonaId?: string;
  onSelectPersona?: (personId: string) => void;
  onOpenCrisis: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  toggleLowStimMode: () => void;
  hiddenModules?: string[];
  onOpenModuleAdmin?: () => void;
  onOpenShareManager?: () => void;
  onOpenFunctionalPlan?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  activePersonaId,
  onSelectPersona,
  onOpenCrisis,
  onOpenProfile,
  onOpenAuth,
  toggleLowStimMode,
  hiddenModules = [],
  onOpenModuleAdmin,
  onOpenShareManager,
  onOpenFunctionalPlan,
  onLogout,
}) => {
  const isDark = userProfile.lowStimulationMode;
  const isSuperAdmin = userProfile.isSuperAdmin || userProfile.email?.toLowerCase() === "sistemastop@gmail.com" || userProfile.email?.toLowerCase() === "fomentocariri@gmail.com" || userProfile.userRole === "superadmin";

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Active interaction profile
  const activeUserId = userProfile.id || "guest_user";
  const currentPersonId = activePersonaId || activeUserId;
  const interactionProfile = getInteractionProfile(activeUserId, currentPersonId);
  const completeness = calculateProfileCompleteness(interactionProfile);

  // Personas available (self + child dependents)
  const { self, dependents } = listPersonasForUser(activeUserId);

  const navGroups = [
    {
      title: "Apoio & Comunicação",
      items: [
        { id: "chat", label: "Assistente IA", icon: Bot, badge: "P1.3" },
        { id: "comunicacao", label: "Comunicação AAC", icon: MessageSquare },
        { id: "scripts", label: "Scripts Sociais", icon: FileText },
      ],
    },
    {
      title: "Autonomia & Rotina",
      items: [
        { id: "rotina", label: "Rotina Visual", icon: CalendarCheck },
        { id: "agenda", label: "Agenda & Medicamentos", icon: Pill },
        { id: "relatorio", label: "Relatórios Funcionais", icon: FileText },
      ],
    },
    {
      title: "Sensorial & Bem-Estar",
      items: [
        { id: "humor", label: "Autoavaliação & Humor", icon: Smile },
        { id: "sensorial", label: "Regulação Sensorial", icon: Waves },
        { id: "musicoterapia", label: "Som & Autorregulação", icon: Headphones },
        { id: "jogos", label: "Jogos & Relaxamento", icon: Gamepad2 },
      ],
    },
    {
      title: "Inclusão & Aprendizagem",
      items: [
        { id: "cuidador", label: "Cuidadores & PEI", icon: Users },
        { id: "educacao", label: "Biblioteca Inclusiva", icon: BookOpen },
        { id: "testes", label: "Centro de Testes", icon: ClipboardCheck },
      ],
    },
  ];

  // Close mobile drawer on item click
  const handleNavClick = (tabId: NavTab) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  const isChildActive = interactionProfile.faixaEtaria === "crianca";

  return (
    <>
      {/* Mobile Top Header */}
      <header className={`md:hidden flex items-center justify-between px-4 py-3 border-b z-40 sticky top-0 ${
        isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900 shadow-sm"
      }`}>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMobileOpen(true)}
            aria-label="Abrir menu de navegação"
            className={`p-2 rounded-xl border transition ${
              isDark ? "border-slate-700 bg-slate-800 text-slate-200" : "border-slate-200 bg-slate-50 text-slate-700"
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <img src={neuroconectaLogo} alt="NeuroConecta" className="h-7 w-auto object-contain" />
            <span className="font-extrabold text-sm tracking-tight text-teal-600">NeuroConecta</span>
          </div>
        </div>

        {/* Active Person Badge on Mobile */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenProfile}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition ${
              isChildActive
                ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                : "bg-teal-500/10 text-teal-600 border-teal-500/30"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="truncate max-w-[100px]">{interactionProfile.personName || "Meu Perfil"}</span>
          </button>
          <button
            onClick={onOpenCrisis}
            className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs flex items-center gap-1"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)} 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300 border-r select-none ${
          isDark 
            ? "bg-slate-900/95 border-slate-800 text-slate-200 backdrop-blur-md" 
            : "bg-white border-slate-200 text-slate-800 shadow-sm"
        } ${
          isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0"
        } ${
          isCollapsed ? "md:w-20" : "md:w-64"
        }`}
      >
        {/* Sidebar Header / Branding */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isDark ? "border-slate-800" : "border-slate-100"
        }`}>
          <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? "md:justify-center w-full" : ""}`}>
            <img src={neuroconectaLogo} alt="Logo" className="w-8 h-8 rounded-lg object-contain flex-shrink-0" />
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col min-w-0">
                <span className="font-black text-sm tracking-tight text-teal-600 leading-none">NeuroConecta</span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide truncate">Apoio & Acessibilidade</span>
              </div>
            )}
          </div>

          {/* Collapse button on desktop, close on mobile */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`hidden md:flex p-1.5 rounded-lg border transition text-slate-400 hover:text-teal-500 ${
                isDark ? "border-slate-800 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-100"
              }`}
              title={isCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Active Person Card (Perfil Ativo Visível) */}
        {(!isCollapsed || isMobileOpen) ? (
          <div className={`p-3 mx-3 my-3 rounded-2xl border transition ${
            isChildActive
              ? isDark ? "bg-amber-950/30 border-amber-800/60" : "bg-amber-50 border-amber-200"
              : isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 border ${
                  isChildActive
                    ? "bg-amber-500/20 text-amber-500 border-amber-500/40"
                    : "bg-teal-500/20 text-teal-600 border-teal-500/40"
                }`}>
                  {interactionProfile.personName.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold truncate text-slate-900 dark:text-slate-100">
                      {interactionProfile.personName}
                    </span>
                    {isChildActive && (
                      <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-amber-500 text-white">
                        Criança
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate capitalize">
                    {interactionProfile.faixaEtaria} • {interactionProfile.tamanhoPreferidoDasRespostas}
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenProfile}
                title="Configurar Perfil de Interação"
                className={`p-1.5 rounded-lg border transition ${
                  isDark ? "border-slate-700 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-white text-slate-600 shadow-sm"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Persona switcher if dependents exist */}
            {dependents.length > 0 && onSelectPersona && (
              <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center gap-1 text-[11px]">
                <span className="text-slate-400 text-[10px]">Alternar:</span>
                <button
                  onClick={() => onSelectPersona(self.personId)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition ${
                    currentPersonId === self.personId
                      ? "bg-teal-600 text-white"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {self.personName}
                </button>
                {dependents.map((dep) => (
                  <button
                    key={dep.personId}
                    onClick={() => onSelectPersona(dep.personId)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition ${
                      currentPersonId === dep.personId
                        ? "bg-amber-600 text-white"
                        : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {dep.personName}
                  </button>
                ))}
              </div>
            )}

            {/* Discrete Profile Completeness indicator */}
            <div className="mt-2 pt-1.5 flex items-center justify-between text-[10px] text-slate-400">
              <span>Perfil de interação</span>
              <span className="font-bold text-teal-500">{completeness}%</span>
            </div>
            <div className="w-full bg-slate-700/30 rounded-full h-1 mt-1 overflow-hidden">
              <div 
                className="bg-teal-500 h-1 rounded-full transition-all duration-500" 
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="my-3 flex justify-center">
            <button
              onClick={onOpenProfile}
              title={`Perfil Ativo: ${interactionProfile.personName}`}
              className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-500 flex items-center justify-center font-bold text-xs"
            >
              {interactionProfile.personName.charAt(0).toUpperCase() || "U"}
            </button>
          </div>
        )}

        {/* Navigation Items (Categorized with "Onde Estou" indicator) */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-4 py-2 text-xs">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter((item) => !hiddenModules.includes(item.id));
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title} className="space-y-1">
                {(!isCollapsed || isMobileOpen) && (
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {group.title}
                  </div>
                )}
                <div className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        id={`nav-item-${item.id}`}
                        onClick={() => handleNavClick(item.id as NavTab)}
                        title={isCollapsed && !isMobileOpen ? item.label : undefined}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-semibold transition group relative ${
                          isActive
                            ? isDark
                              ? "bg-teal-950/80 text-teal-300 border border-teal-700/80 font-bold"
                              : "bg-teal-50 text-teal-800 border border-teal-200 font-bold shadow-sm"
                            : isDark
                            ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        } ${isCollapsed && !isMobileOpen ? "justify-center px-0" : ""}`}
                      >
                        {/* Active indicator bar */}
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-teal-500 rounded-r-full" />
                        )}

                        <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? "text-teal-500" : "text-slate-400 group-hover:text-teal-500"
                        }`} />

                        {(!isCollapsed || isMobileOpen) && (
                          <span className="truncate flex-1 text-left">{item.label}</span>
                        )}

                        {(!isCollapsed || isMobileOpen) && item.badge && (
                          <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Database & Cloud (discreet) */}
          <div className="pt-2 border-t border-slate-700/40">
            <button
              onClick={() => handleNavClick("supabase")}
              title={isCollapsed && !isMobileOpen ? "Banco de Dados & Nuvem" : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-semibold transition ${
                activeTab === "supabase"
                  ? "bg-teal-950/80 text-teal-300 border border-teal-700/80"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              } ${isCollapsed && !isMobileOpen ? "justify-center px-0" : ""}`}
            >
              <Database className="w-4 h-4 flex-shrink-0" />
              {(!isCollapsed || isMobileOpen) && <span className="truncate">Banco de Dados</span>}
            </button>
          </div>
        </nav>

        {/* Footer Actions */}
        <div className={`p-3 border-t space-y-1.5 ${
          isDark ? "border-slate-800 bg-slate-950/40" : "border-slate-100 bg-slate-50"
        }`}>
          {/* SOS Crise Button */}
          <button
            onClick={onOpenCrisis}
            title="Apoio Imediato SOS Crise"
            className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-sm"
          >
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span>SOS Crise</span>}
          </button>

          {/* Utility buttons grid */}
          <div className="flex items-center justify-between pt-1 gap-1">
            <button
              onClick={toggleLowStimMode}
              title={isDark ? "Modo Claro" : "Modo Baixo Estímulo"}
              className={`p-2 rounded-xl border flex-1 flex items-center justify-center transition ${
                isDark ? "border-slate-800 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-white text-slate-700"
              }`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
            </button>

            <button
              onClick={onOpenShareManager}
              title="Gerenciar Compartilhamentos (ShareGrant)"
              className={`p-2 rounded-xl border flex-1 flex items-center justify-center transition ${
                isDark ? "border-slate-800 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-white text-slate-700"
              }`}
            >
              <Share2 className="w-3.5 h-3.5 text-teal-500" />
            </button>

            <button
              onClick={onOpenFunctionalPlan}
              title="Plano Funcional de Apoio"
              className={`p-2 rounded-xl border flex-1 flex items-center justify-center transition ${
                isDark ? "border-slate-800 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-white text-slate-700"
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-indigo-400" />
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Sair / Encerrar Sessão com Limpeza de Estado"
                className={`p-2 rounded-xl border flex-1 flex items-center justify-center transition ${
                  isDark ? "border-slate-800 hover:bg-rose-950/40 text-rose-400" : "border-slate-200 hover:bg-rose-50 text-rose-600"
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
