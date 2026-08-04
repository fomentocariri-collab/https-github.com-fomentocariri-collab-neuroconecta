import React, { useState, useEffect } from "react";
import { Navbar, NavTab } from "./components/Navbar";
import { ChatAssistant } from "./components/ChatAssistant";
import { TestCenter } from "./components/TestCenter";
import { RoutinePlanner } from "./components/RoutinePlanner";
import { SensoryHub } from "./components/SensoryHub";
import { MoodTracker } from "./components/MoodTracker";
import { CommunicationHub } from "./components/CommunicationHub";
import { ReportHub } from "./components/ReportHub";
import { SupabaseHub } from "./components/SupabaseHub";
import { CaregiverHub } from "./components/CaregiverHub";
import { EducationHub } from "./components/EducationHub";
import { CrisisModal } from "./components/CrisisModal";
import { UserProfileModal } from "./components/UserProfileModal";
import { AuthModal } from "./components/AuthModal";
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

        {activeTab === "testes" && (
          <TestCenter onNavigateToChat={() => setActiveTab("chat")} />
        )}

        {activeTab === "rotina" && <RoutinePlanner />}

        {activeTab === "sensorial" && <SensoryHub />}

        {activeTab === "humor" && <MoodTracker />}

        {activeTab === "comunicacao" && <CommunicationHub />}

        {activeTab === "relatorio" && <ReportHub userProfile={userProfile} />}

        {activeTab === "supabase" && <SupabaseHub />}

        {activeTab === "cuidador" && (
          <CaregiverHub
            currentSupportLevel={userProfile.supportLevel}
            userName={userProfile.preferredName || "Visitante"}
          />
        )}

        {activeTab === "educacao" && <EducationHub />}
      </main>

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
      />
    </div>
  );
}

