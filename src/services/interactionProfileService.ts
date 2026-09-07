import { 
  InteractionProfile, 
  AgeBand, 
  UserUsageType, 
  UserProfile, 
  ActivePersonContext 
} from "../types";

const PROFILE_KEY_PREFIX = "neuroconecta_interaction_profile_";
const PERSONAS_KEY_PREFIX = "neuroconecta_personas_";

/**
 * Creates a default sensible Interaction Profile
 */
export function createDefaultInteractionProfile(
  userId: string, 
  personId: string = userId, 
  name: string = "Usuário",
  faixaEtaria: AgeBand = "adulto",
  tipoDeUsuario: UserUsageType = "para_mim"
): InteractionProfile {
  const isChild = faixaEtaria === "crianca";
  return {
    userId,
    personId,
    personName: name,
    faixaEtaria,
    tipoDeUsuario,
    linguagemPreferida: isChild ? "simples_concreta" : "direta",
    tamanhoPreferidoDasRespostas: isChild ? "curtas" : "medias",
    nivelDeDetalhamento: isChild ? "essencial" : "equilibrado",
    prefereEtapas: true,
    prefereExemplos: true,
    prefereRecursosVisuais: true,
    prefereLinguagemLiteral: true,
    prefereResumoFinal: false,
    prefereUmaPerguntaPorVez: isChild,
    toleranciaAInformacaoSimultanea: isChild ? "baixa" : "media",
    modoDeAprendizagemPreferido: isChild ? "visual e concreto" : "estruturado em etapas",
    interesses: [],
    objetivosAtuais: ["Apoio à organização diária"],
    necessidadesDeAcessibilidade: ["Instruções diretas", "Previsibilidade"],
    preferenciasDeComunicacao: ["Linguagem clara", "Sem ambiguidades"],
    contextoPadrao: tipoDeUsuario === "educador_professor" ? "educacao" : tipoDeUsuario === "familiar_cuidador" ? "familia_cuidado" : "meu_apoio",
    isChildDependent: isChild && personId !== userId,
    guardianUserId: isChild && personId !== userId ? userId : undefined,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Retrieves Interaction Profile with IDOR isolation check
 */
export function getInteractionProfile(userId: string, personId: string = userId): InteractionProfile {
  if (!userId) {
    return createDefaultInteractionProfile("guest_user");
  }

  try {
    const key = `${PROFILE_KEY_PREFIX}${userId}_${personId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure ownership integrity
      if (parsed.userId === userId) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Erro ao carregar perfil de interação:", e);
  }

  return createDefaultInteractionProfile(userId, personId);
}

/**
 * Saves Interaction Profile ensuring IDOR check (actor can only save their own or authorized dependents)
 */
export function saveInteractionProfile(profile: InteractionProfile, activeUserId: string): boolean {
  if (!activeUserId || profile.userId !== activeUserId) {
    console.warn("IDOR Block: Tentativa não autorizada de salvar perfil de outro usuário.");
    return false;
  }

  try {
    profile.updatedAt = new Date().toISOString();
    const key = `${PROFILE_KEY_PREFIX}${profile.userId}_${profile.personId}`;
    localStorage.setItem(key, JSON.stringify(profile));

    // Register in user's personas list
    registerPersonaForUser(profile.userId, profile);
    return true;
  } catch (e) {
    console.error("Erro ao salvar perfil de interação:", e);
    return false;
  }
}

/**
 * Registers persona into user's list
 */
function registerPersonaForUser(userId: string, profile: InteractionProfile) {
  try {
    const key = `${PERSONAS_KEY_PREFIX}${userId}`;
    const stored = localStorage.getItem(key);
    let personas: InteractionProfile[] = stored ? JSON.parse(stored) : [];

    personas = personas.filter((p) => p.personId !== profile.personId);
    personas.push(profile);

    localStorage.setItem(key, JSON.stringify(personas));
  } catch (e) {
    console.error(e);
  }
}

/**
 * Lists all personas accessible to this user (self + authorized dependents)
 */
export function listPersonasForUser(userId: string): { self: InteractionProfile; dependents: InteractionProfile[] } {
  const selfProfile = getInteractionProfile(userId, userId);
  let dependents: InteractionProfile[] = [];

  try {
    const key = `${PERSONAS_KEY_PREFIX}${userId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      const all: InteractionProfile[] = JSON.parse(stored);
      dependents = all.filter((p) => p.personId !== userId && p.userId === userId);
    }
  } catch (e) {
    console.error(e);
  }

  return { self: selfProfile, dependents };
}

/**
 * Adds a child / adolescent dependent linked to guardian
 */
export function addChildDependent(
  guardianUserId: string,
  childName: string,
  faixaEtaria: AgeBand = "crianca",
  interesses: string[] = []
): InteractionProfile {
  const childPersonId = `child_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const childProfile: InteractionProfile = {
    ...createDefaultInteractionProfile(guardianUserId, childPersonId, childName, faixaEtaria, "para_crianca"),
    isChildDependent: true,
    guardianUserId,
    interesses,
  };

  saveInteractionProfile(childProfile, guardianUserId);
  return childProfile;
}

/**
 * Calculates profile completeness score for discrete progress bar
 */
export function calculateProfileCompleteness(profile: InteractionProfile): number {
  let score = 0;
  let total = 8;

  if (profile.personName && profile.personName !== "Usuário") score++;
  if (profile.faixaEtaria) score++;
  if (profile.tipoDeUsuario) score++;
  if (profile.tamanhoPreferidoDasRespostas) score++;
  if (profile.linguagemPreferida) score++;
  if (profile.interesses && profile.interesses.length > 0) score++;
  if (profile.objetivosAtuais && profile.objetivosAtuais.length > 0) score++;
  if (profile.necessidadesDeAcessibilidade && profile.necessidadesDeAcessibilidade.length > 0) score++;

  return Math.min(100, Math.round((score / total) * 100));
}

/**
 * Purges active memory and conversation cache upon switching personas or logging out
 */
export function purgeActivePersonaState(userId: string) {
  try {
    sessionStorage.removeItem(`neuroconecta_active_convo_${userId}`);
    sessionStorage.removeItem("neuroconecta_active_student_context");
  } catch (e) {
    console.error(e);
  }
}

/**
 * Builds MINIMAL interaction context for Gemini API
 * Strictly enforces DATA MINIMIZATION:
 * - NO personal diary entries
 * - NO unneeded family private issues
 * - NO diagnostic inferencing
 * - Clear tone adaptations (child vs adult, without infantalizing adults or condescending children)
 * - Educational context strictly constrained to authorized pedagogical items
 */
export function buildMinimalInteractionContext(
  profile: InteractionProfile,
  activeContext: string,
  currentInstruction?: string,
  authorizedStudent?: { name: string; authorizedGoals?: string[]; accommodations?: string[]; interests?: string[] }
): string {
  const isChild = profile.faixaEtaria === "crianca";
  const isTeen = profile.faixaEtaria === "adolescente";
  const isElder = profile.faixaEtaria === "idoso";

  const lines: string[] = [];

  lines.push("--- CONTEXTO DE INTERAÇÃO (DATA MINIMIZATION) ---");
  lines.push(`Interlocutor(a): ${profile.personName || "Pessoa"} • Faixa Etária: ${profile.faixaEtaria.toUpperCase()}`);
  lines.push(`Papel no Sistema: ${profile.tipoDeUsuario}`);

  // Tone & Style adaptation
  if (isChild) {
    lines.push("DIRETRIZ INFANTIL: Use frases curtas, uma ideia por vez, exemplos concretos e acolhedores. Proibido usar linguagem condescendente, caricata ou diminutivos excessivos.");
  } else if (isTeen) {
    lines.push("DIRETRIZ ADOLESCENTE: Comunicação direta, respeitosa, focada na autonomia, sem tom paternalista ou infantil.");
  } else {
    lines.push("DIRETRIZ ADULTA: Manter tom adulto, respeitoso e analítico. Jamais infantilizar.");
  }

  // Structural preferences
  const prefs: string[] = [];
  prefs.push(`Tamanho de resposta preferido: ${profile.tamanhoPreferidoDasRespostas}`);
  if (profile.prefereEtapas) prefs.push("Organizar em etapas/passos");
  if (profile.prefereExemplos) prefs.push("Incluir exemplos práticos");
  if (profile.prefereLinguagemLiteral) prefs.push("Linguagem literal e direta (evitar metáforas ambíguas)");
  if (profile.prefereUmaPerguntaPorVez) prefs.push("Fazer no máximo uma pergunta por vez");
  if (profile.prefereResumoFinal) prefs.push("Incluir resumo final objetivo");

  lines.push(`Preferências de Formatação: ${prefs.join("; ")}.`);

  // Current context
  lines.push(`Contexto do Apoio Selecionado: ${activeContext}`);

  // Educational Student Context (if active & authorized by ShareGrant)
  if (authorizedStudent) {
    lines.push(`CONTEXTO EDUCACIONAL AUTORIZADO (ShareGrant Ativo):`);
    lines.push(`Estudante: ${authorizedStudent.name}`);
    if (authorizedStudent.interests?.length) {
      lines.push(`Interesses Pedagógicos: ${authorizedStudent.interests.join(", ")}`);
    }
    if (authorizedStudent.accommodations?.length) {
      lines.push(`Acomodações em Sala: ${authorizedStudent.accommodations.join(", ")}`);
    }
    if (authorizedStudent.authorizedGoals?.length) {
      lines.push(`Metas DUA/PEI: ${authorizedStudent.authorizedGoals.join("; ")}`);
    }
    lines.push("AVISO: Foco estritamente pedagógico e DUA. Não realizar diagnósticos nem análises clínicas.");
  }

  // Precedence rule
  lines.push("REGRA DE PRECEDÊNCIA: Se a mensagem do usuário pedir formato específico (ex: 'explique em detalhes'), a solicitação imediata prevalece sobre preferências persistidas.");
  lines.push("ASSISTENTE GERAL: Responda perguntas sobre temas gerais (ciência, literatura, culinária, etc.) diretamente sem introduzir diagnósticos ou termos clínicos desnecessários.");
  lines.push("--------------------------------------------------");

  return lines.join("\n");
}
