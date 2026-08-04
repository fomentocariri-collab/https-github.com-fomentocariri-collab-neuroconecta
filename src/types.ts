export type DiagnosisStatus = 
  | "autodiagnosticado" 
  | "investigacao" 
  | "laudo_formal" 
  | "familiar_apoiador" 
  | "nao_informado";

export type FocusArea = 
  | "rotina" 
  | "testes" 
  | "sensorial" 
  | "comunicacao" 
  | "crise" 
  | "aprendizado"
  | "geral";

export type SupportLevel = 1 | 2 | 3 | "nao_especificado";

export type UserRole = "pcd" | "cuidador_educador" | "saude_caps" | "superadmin";

export interface UserProfile {
  id?: string;
  email?: string;
  preferredName: string;
  pronouns: string;
  userRole?: UserRole;
  diagnosisStatus: DiagnosisStatus;
  supportLevel?: SupportLevel;
  currentFocus: FocusArea;
  emergencyContacts: {
    name: string;
    phone: string;
    relationship: string;
  }[];
  lowStimulationMode: boolean;
  caregiverMode?: boolean;
  notificationsEnabled?: boolean;
  onboardingCompleted: boolean;
  createdAt?: string;
  isGuest?: boolean;
  isSuperAdmin?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Question {
  id: number;
  text: string;
  category?: string;
  options: {
    label: string;
    score: number;
  }[];
}

export interface TestDefinition {
  id: "aq10" | "sqeq" | "sensory" | "burnout" | "catq";
  title: string;
  shortDescription: string;
  fullDescription: string;
  estimatedMinutes: number;
  questionsCount: number;
  questions: Question[];
  interpretResult: (score: number) => {
    level: string;
    summary: string;
    recommendation: string;
    tips: string[];
  };
}

export interface SavedTestResult {
  id: string;
  testId: string;
  testTitle: string;
  score: number;
  maxScore: number;
  date: string;
  interpretationLevel: string;
  interpretationSummary: string;
}

export interface RoutineTask {
  id: string;
  timeSlot: "manha" | "tarde" | "noite";
  title: string;
  description?: string;
  completed: boolean;
  estimatedMinutes: number;
  iconName?: string;
  category: "trabalho" | "autocuidado" | "refeicao" | "pausa_sensorial" | "lazer" | "estudo";
  steps?: string[];
  imageUrl?: string;
  reminderTime?: string;
}

export interface SensoryTrigger {
  id: string;
  sense: "audicao" | "visao" | "tato" | "olfato_paladar" | "propriocepcao";
  trigger: string;
  impactLevel: 1 | 2 | 3 | 4 | 5;
  copingStrategy: string;
  notes?: string;
}

export interface MoodLogEntry {
  id: string;
  date: string;
  time: string;
  mood: "excelente" | "calmo" | "neutro" | "sobrecarregado" | "exausto";
  energyLevel: number; // 1 to 5
  sensoryLevel: number; // 1 to 5 (1 = tranquilo, 5 = sobrecarga)
  notes?: string;
  triggers?: string[];
}

export interface CaregiverGuideItem {
  id: string;
  situation: string;
  category: "meltdown_shutdown" | "comunicacao" | "rotina_sensorial" | "escola_trabalho";
  levelTarget: "Todos" | "Nível 1" | "Nível 2" | "Nível 3";
  whatToDo: string[];
  whatToAvoid: string[];
  phrasesToUse: string[];
}

export interface SocialScript {
  id: string;
  title: string;
  category: "trabalho" | "saude" | "familia" | "social" | "acomodacoes";
  description: string;
  scriptText: string;
  tips: string[];
}

export interface EducationArticle {
  id: string;
  term: string;
  category: "direitos" | "educacao" | "comunicacao" | "conceito" | "estrategia" | "mito";
  shortDefinition: string;
  fullExplanation: string;
  practicalTips: string[];
}
