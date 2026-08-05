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

export type UserRole = "pcd" | "cuidador_educador" | "saude_caps" | "rh_gestor" | "superadmin";

export type ProfessionalRoleType = "medico" | "enfermeiro" | "perito" | "rh" | "educador" | "pcd";

export interface UserProfile {
  id?: string;
  email?: string;
  preferredName: string;
  pronouns: string;
  userRole?: UserRole;
  professionalRoleType?: ProfessionalRoleType;
  professionalRegisterNumber?: string; // e.g. CRM/SP 123456, COREN/RJ 654321, CRA/BR 98765, MEC/PE 45678, CIPTEA 001/2026
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
  category?: string; // Sub-domain / sub-scale name e.g. "Relacionamento Social", "Talento", "Linguagem"
  options: {
    label: string;
    score: number;
  }[];
}

export interface TestDefinition {
  id: string; // "raads-r" | "aq50" | "aspie-quiz" | "aq10" | "sqeq" | "sensory" | "burnout" | "catq"
  title: string;
  shortDescription: string;
  fullDescription: string;
  validatedClinically: boolean;
  validationReference?: string;
  usageType: "Triagem Clínica Adultos" | "Triagem Geral" | "Triagem Rápida" | "Reflexão Pessoal Online";
  estimatedMinutes: number;
  questionsCount: number;
  domains?: string[];
  questions: Question[];
  interpretResult: (score: number, domainScores?: Record<string, { scored: number; max: number }>) => {
    level: string;
    technicalReview: string; // Resenha técnica em prosa contínua e denso referencial psicométrico sem marcadores
    recommendation: string;
    aspieScore?: number;
    neurotypicalScore?: number;
  };
}

export interface SavedTestResult {
  id: string;
  userId?: string;
  userName?: string;
  userRole?: string;
  testId: string;
  testTitle: string;
  score: number;
  maxScore: number;
  date: string;
  interpretationLevel: string;
  technicalReview: string; // Resenha técnica densa em texto único sem marcadores
  recommendation: string;
  clinicalStatus?: string;
  domainScores?: Record<string, { scored: number; max: number }>;
  validatedClinically?: boolean;
  validationReference?: string;
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
