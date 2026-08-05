import React, { useState, useEffect } from "react";
import { Navbar, NavTab } from "./components/Navbar";
import { ChatAssistant } from "./components/ChatAssistant";
import { MusicotherapyHub } from "./components/MusicotherapyHub";
import { StimmingGamesHub } from "./components/StimmingGamesHub";
import { TestCenter } from "./components/TestCenter";
import { RoutinePlanner } from "./components/RoutinePlanner";
import { AgendaAndMeds } from "./components/AgendaAndMeds";
import { SensoryHub } from "./components/SensoryHub";
import { MoodTracker } from "./components/MoodTracker";
import { CommunicationHub } from "./components/CommunicationHub";
import { ReportHub } from "./components/ReportHub";
import { SupabaseHub } from "./components/SupabaseHub";
import { CaregiverHub } from "./components/CaregiverHub";
import { EducationHub } from "./components/EducationHub";
import { CapsHealthHub } from "./components/CapsHealthHub";
import { HrManagementHub } from "./components/HrManagementHub";
import { CrisisModal } from "./components/CrisisModal";
import { UserProfileModal } from "./components/UserProfileModal";
import { AuthModal } from "./components/AuthModal";
import { FooterAndContact } from "./components/FooterAndContact";
import { UserProfile } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("chat");
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Auto-open login/registration modal on initial load if user has not logged in yet
  useEffect(() => {
    const activeUserId = localStorage.getItem("neuroconecta_active_user_id");
    if (!activeUserId || userProfile.isGuest) {
      setIsAuthOpen(true);
    }
  }, []);

  // Initialize or load active user profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const activeUserId = localStorage.getItem("neuroconecta_active_user_id");
      if (activeUserId) {
        const stored = localStorage.getItem(`neuroconecta_profile_${activeUserId}`);
        if (stored) return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    // Default fallback initial session
    return {
      id: "guest_" + Math.random().toString(36).substring(2, 9),
      preferredName: "Visitante",
      pronouns: "não informado",
      diagnosisStatus: "laudo_formal",
      supportLevel: 2,
      currentFocus: "geral",
      emergencyContacts: [],
      lowStimulationMode: false,
      onboardingCompleted: false,
      isGuest: true,
    };
  });

  // Save profile to active user's isolated storage
  const handleSaveProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    try {
      const userId = updated.id || "guest_default";
      localStorage.setItem("neuroconecta_active_user_id", userId);
      localStorage.setItem(`neuroconecta_profile_${userId}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoginSuccess = (user: UserProfile) => {
    handleSaveProfile(user);
    setIsAuthOpen(false);

    // Intuitively route user to their specific module upon login
    if (user.isSuperAdmin || user.email?.toLowerCase() === "sistemastop@gmail.com") {
      setActiveTab("rh");
    } else if (user.professionalRoleType === "medico" || user.userRole === "medico" || user.professionalRoleType === "enfermeiro" || user.userRole === "caps_tecnico") {
      setActiveTab("caps");
    } else if (user.professionalRoleType === "professor" || user.userRole === "professor") {
      setActiveTab("educacao");
    } else if (user.professionalRoleType === "perito" || user.userRole === "rh_gestor") {
      setActiveTab("rh");
    } else if (user.userRole === "cuidador") {
      setActiveTab("cuidador");
    } else {
      setActiveTab("chat");
    }
  };

  const handleLogout = () => {
    const freshGuest: UserProfile = {
      id: "guest_" + Math.random().toString(36).substring(2, 9),
      preferredName: "Visitante",
      pronouns: "não informado",
      diagnosisStatus: "laudo_formal",
      supportLevel: 2,
      currentFocus: "geral",
      emergencyContacts: [],
      lowStimulationMode: false,
      onboardingCompleted: false,
      isGuest: true,
    };
    localStorage.removeItem("neuroconecta_active_user_id");
    setUserProfile(freshGuest);
    setIsAuthOpen(true);
  };

  const toggleLowStimMode = () => {
    const updated = { ...userProfile, lowStimulationMode: !userProfile.lowStimulationMode };
    handleSaveProfile(updated);
  };

  const isSuperAdmin = userProfile.isSuperAdmin || userProfile.email?.toLowerCase() === "sistemastop@gmail.com";

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 flex flex-col ${
        userProfile.lowStimulationMode
          ? "theme-dark bg-slate-950 text-slate-100"
          : "theme-light bg-slate-50 text-slate-900"
      }`}
    >
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onOpenCrisis={() => setIsCrisisOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        toggleLowStimMode={toggleLowStimMode}
      />

      {/* Main Content Body */}
      <main className="flex-1 pb-10">
        {activeTab === "chat" && (
          <ChatAssistant
            userProfile={userProfile}
            onUpdateProfile={handleSaveProfile}
            onNavigateToTab={setActiveTab}
            onOpenCrisis={() => setIsCrisisOpen(true)}
          />
        )}

        {activeTab === "musicoterapia" && (
          <MusicotherapyHub isDark={userProfile.lowStimulationMode} />
        )}

        {activeTab === "jogos" && (
          <StimmingGamesHub isDark={userProfile.lowStimulationMode} />
        )}

        {activeTab === "testes" && (
          <TestCenter onNavigateToChat={() => setActiveTab("chat")} userProfile={userProfile} />
        )}

        {activeTab === "rotina" && <RoutinePlanner />}

        {activeTab === "agenda" && <AgendaAndMeds isDark={userProfile.lowStimulationMode} />}

        {activeTab === "sensorial" && <SensoryHub />}

        {activeTab === "humor" && <MoodTracker />}

        {activeTab === "comunicacao" && <CommunicationHub />}

        {activeTab === "relatorio" && <ReportHub userProfile={userProfile} />}

        {activeTab === "rh" && (
          (isSuperAdmin || userProfile.userRole === "rh_gestor" || userProfile.professionalRoleType === "perito") ? (
            <HrManagementHub userProfile={userProfile} isDark={userProfile.lowStimulationMode} />
          ) : (
            <div className="max-w-md mx-auto my-12 p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3 text-slate-300">
              <h3 className="text-lg font-bold text-slate-100">Acesso Restrito ao Módulo RH Corporativo</h3>
              <p className="text-xs">Este módulo é exclusivo para Gestores de RH, Peritos Técnicos e Superadmin.</p>
              <button onClick={() => setActiveTab("chat")} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition">
                Voltar ao Assistente IA
              </button>
            </div>
          )
        )}

        {activeTab === "supabase" && (
          isSuperAdmin ? (
            <SupabaseHub />
          ) : (
            <div className="max-w-md mx-auto my-12 p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3 text-slate-300">
              <h3 className="text-lg font-bold text-slate-100">Acesso Restrito ao Superadmin</h3>
              <p className="text-xs">O módulo do Banco de Dados Supabase está invisível e restrito para o administrador técnico.</p>
              <button onClick={() => setActiveTab("chat")} className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition">
                Voltar ao Assistente IA
              </button>
            </div>
          )
        )}

        {activeTab === "cuidador" && (
          <CaregiverHub
            currentSupportLevel={userProfile.supportLevel}
            userName={userProfile.preferredName || "Visitante"}
          />
        )}

        {activeTab === "caps" && (
          (isSuperAdmin || userProfile.userRole === "medico" || userProfile.userRole === "caps_tecnico" || userProfile.professionalRoleType === "medico" || userProfile.professionalRoleType === "enfermeiro") ? (
            <CapsHealthHub
              isDark={userProfile.lowStimulationMode}
              patientName={userProfile.preferredName || "Paciente em Acompanhamento"}
            />
          ) : (
            <div className="max-w-md mx-auto my-12 p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3 text-slate-300">
              <h3 className="text-lg font-bold text-slate-100">Acesso Restrito ao Módulo Clínico / CAPS</h3>
              <p className="text-xs">Módulo reservado a Profissionais da Saúde, Médicos, Enfermeiros e Gestores CAPS.</p>
              <button onClick={() => setActiveTab("chat")} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition">
                Voltar ao Assistente IA
              </button>
            </div>
          )
        )}

        {activeTab === "educacao" && (
          (isSuperAdmin || userProfile.userRole === "professor" || userProfile.professionalRoleType === "professor") ? (
            <EducationHub />
          ) : (
            <div className="max-w-md mx-auto my-12 p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3 text-slate-300">
              <h3 className="text-lg font-bold text-slate-100">Acesso Restrito à Educação Inclusiva</h3>
              <p className="text-xs">Módulo reservado a Educadores, Professores e Equipe Pedagógica Inclusiva.</p>
              <button onClick={() => setActiveTab("chat")} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition">
                Voltar ao Assistente IA
              </button>
            </div>
          )
        )}
      </main>

      {/* SISTEMASTOP Footer & Fale Conosco */}
      <FooterAndContact isDark={userProfile.lowStimulationMode} />

      {/* Emergency Crisis / Meltdown Support Modal */}
      <CrisisModal
        isOpen={isCrisisOpen}
        onClose={() => setIsCrisisOpen(false)}
        userProfile={userProfile}
        toggleLowStimMode={toggleLowStimMode}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Interactive Account & LGPD Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={userProfile}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        isDark={userProfile.lowStimulationMode}
      />
    </div>
  );
}

