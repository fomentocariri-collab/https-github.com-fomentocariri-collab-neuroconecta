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
import { UserProfile } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>("chat");
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    preferredName: "Ana",
    pronouns: "ela/dela",
    diagnosisStatus: "laudo_formal",
    supportLevel: 2,
    currentFocus: "geral",
    emergencyContacts: [],
    lowStimulationMode: false,
    onboardingCompleted: true,
  });

  // Load user profile from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("neuroconecta_user_profile");
      if (stored) {
        setUserProfile(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    try {
      localStorage.setItem("neuroconecta_user_profile", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
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
            userName={userProfile.preferredName || "Ana"}
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
    </div>
  );
}

