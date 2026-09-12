import { supabase } from "../lib/supabase";
import { auditService } from "./auditService";
import { 
  PlannedActivity, 
  ActivityApplicationRecord, 
  AssistedUserSummary, 
  ActivityFilterOptions,
  PsychopedagogyPlan,
  PsychopedagogyGoal,
  PsychologyTherapeuticProcess,
  TherapeuticProcessCheckIn,
  TherapeuticRuptureAlert,
  PlannerMode
} from "../types";

// Fallback seed de usuários assistidos com IDs canônicos (UUIDs padronizados)
const SEED_ASSISTED_USERS: AssistedUserSummary[] = [
  {
    id: "a1111111-1111-4111-8111-111111111111",
    displayName: "Maria Clara Santos",
    preferredName: "Clara",
    registrationNumber: "MAT-2026-084",
    birthDate: "2016-04-12",
    age: 10,
    educationStage: "fundamental_1",
    gradeLevel: "5º Ano do Ensino Fundamental",
    institutionName: "Escola Municipal Monteiro Lobato",
    classGroup: "Turma 501",
    relationshipType: "aluno",
    supportLevel: 2,
    activeGoalsCount: 3,
    knownStrengths: ["Atenção a detalhes visuais", "Interesse por robótica e Minecraft", "Excelente memória sequencial"],
    knownSensoryPreferences: ["Sensibilidade a eco de salas", "Usa abafador em momentos de barulho", "Gosta de pausas táteis"],
    knownEffectiveStrategies: ["Roteiro visual no canto do quadro", "Divisão em passos de 15 minutos", "Opção de desenhar em vez de cópia longa"],
  },
  {
    id: "b2222222-2222-4222-8222-222222222222",
    displayName: "Lucas Gabriel Andrade",
    preferredName: "Lucas",
    registrationNumber: "CLI-PSI-029",
    birthDate: "2013-09-24",
    age: 12,
    educationStage: "fundamental_2",
    gradeLevel: "7º Ano do Ensino Fundamental",
    institutionName: "Colégio Progresso",
    classGroup: "Turma 7B",
    relationshipType: "aprendente",
    supportLevel: 1,
    activeGoalsCount: 4,
    knownStrengths: ["Expressão oral rica", "Grande curiosidade científica", "Argumentação lógica"],
    knownSensoryPreferences: ["Inquietação motora leve", "Benefício com fidgets silenciosos"],
    knownEffectiveStrategies: ["Mapas mentais coloridos", "Instruções diretas sem rodeios", "Checklists com caixas de seleção"],
  },
  {
    id: "c3333333-3333-4333-8333-333333333333",
    displayName: "Enzo Henrique Ferreira",
    preferredName: "Enzo",
    registrationNumber: "PAC-MED-051",
    birthDate: "2010-02-18",
    age: 16,
    educationStage: "ensino_medio",
    gradeLevel: "1º Ano do Ensino Médio",
    institutionName: "Instituto Estadual de Educação",
    classGroup: "Turma 103",
    relationshipType: "paciente",
    supportLevel: 1,
    activeGoalsCount: 2,
    knownStrengths: ["Capacidade analítica", "Interesse por história e xadrez", "Compreensão de regras claras"],
    knownSensoryPreferences: ["Aversão a toques inesperados", "Preferência por iluminação indireta"],
    knownEffectiveStrategies: ["Previsibilidade rigorosa de cronograma", "Contrato terapêutico transparente", "Atividades reflexivas estruturadas"],
  },
];

// Fallback seed de atividades iniciais para garantir demonstração imediata
const SEED_ACTIVITIES: PlannedActivity[] = [
  {
    id: "act-001-eco-arte",
    professionalUserId: "00000000-0000-4000-8000-000000000001",
    professionalName: "Equipe NeuroConecta",
    assistedUserId: "a1111111-1111-4111-8111-111111111111",
    assistedUserName: "Maria Clara Santos",
    specialty: "escolar",
    title: "Mosaico da Paisagem: Relevo e Arte Interdisciplinar",
    objective: "Identificar diferentes formas de relevo e expressá-las por meio de colagem tátil e mapa esquemático",
    disciplines: ["Geografia", "Artes (Visuais, Música, Dança, Teatro)"],
    learningProcesses: ["Percepção Visuoespacial", "Coordenação Visomotora", "Compreensão e Interpretação Textual"],
    educationStage: "fundamental_1",
    gradeLevel: "5º Ano do Ensino Fundamental",
    duration: "45 minutos (divididos em blocos de 15 min)",
    format: "dupla",
    materials: "Cartolinas cortadas, papéis coloridos rasgados, cola bastão, imagens de relevos e mapa local",
    instructions: "Apresentar o relevo local com fotos reais. Cada dupla constrói um mosaico representando planalto, planície e vale com texturas diferentes.",
    stepByStep: [
      "1. Apresentação visual (5 min): Exibir 3 fotos de montanhas, vales e planícies.",
      "2. Escolha de texturas (10 min): Separar os papéis e planejar o relevo em conjunto.",
      "3. Colagem sensorial (20 min): Montar o relevo com liberdade para usar desenho ou colagem.",
      "4. Pausa de descompressão (5 min): Respiração suave e água.",
      "5. Compartilhamento voluntário (5 min): Expor o trabalho na mesa sem cobrança de fala pública."
    ],
    visualSupport: [
      "Quadro de referências com imagens de relevo e legendas em cores distintas",
      "Timer visual de 15 minutos para cada etapa",
      "Cartão com a legenda: Planície = Verde, Montanha = Marrom, Rio = Azul"
    ],
    multiplePathways: [
      { format: "Colagem Tátil", description: "Construção do relevo com sobreposição de papéis texturizados." },
      { format: "Desenho Digital ou Papel", description: "Ilustração esquemática com setas e legendas curtas." },
      { format: "Áudio Descritivo", description: "Gravação de áudio de 1 minuto explicando a diferença entre montanha e planície." }
    ],
    challengeLevel: "intermediario",
    adaptations: [
      "Tesoura com mola ou papéis já pré-rasgados para diminuir fadiga motora fina",
      "Disponibilização de abafador sonoro durante o corte de materiais",
      "Roteiro da atividade disponível na carteira do estudante"
    ],
    environmentalAdaptations: [
      "Mesa de trabalho próxima a materiais e longe de corredor de trânsito",
      "Iluminação sem reflexo direto nos papéis"
    ],
    studentInterestsBridging: "Conectar relevo com os biomas de jogos de construção (Minecraft: montanhas e planícies).",
    professionalNotes: "Focar na apropriação do conceito espacial, nunca na perfeição do traçado ou cópia.",
    status: "READY",
    version: 1,
    isTemplate: false,
    createdAt: "2026-09-01T10:00:00Z",
    updatedAt: "2026-09-01T10:00:00Z"
  },
  {
    id: "act-002-psi-leitura",
    professionalUserId: "00000000-0000-4000-8000-000000000001",
    professionalName: "Equipe NeuroConecta",
    assistedUserId: "b2222222-2222-4222-8222-222222222222",
    assistedUserName: "Lucas Gabriel Andrade",
    specialty: "psicopedagogia",
    title: "Detetive de Ideias Centrais: Estruturação Textual com Pistas Visuais",
    objective: "Desenvolver a capacidade de extrair a ideia central de parágrafos curtos sem sobrecarga de decodificação",
    disciplines: ["Língua Portuguesa"],
    learningProcesses: ["Compreensão e Interpretação Textual", "Funções Executivas (Planejamento e Organização)", "Atenção Sustentada e Seletiva"],
    educationStage: "fundamental_2",
    gradeLevel: "7º Ano do Ensino Fundamental",
    duration: "40 minutos (bloco 20 min + pausa 5 min + bloco 15 min)",
    format: "sessao_individual",
    materials: "Três cartões com micro-narrativas de curiosidades científicas, marcadores coloridos e ficha de pistas",
    instructions: "O estudante atua como investigador: grifa a palavra-chave de cada parágrafo com uma cor e desenha um ícone resumo ao lado.",
    stepByStep: [
      "Etapa 1: Leitura compartilhada da primeira curiosidade (leitura modelo pelo profissional).",
      "Etapa 2: Identificação da palavra âncora ('Qual é o assunto deste trecho?').",
      "Etapa 3: Registro por ícone no cartão (desenho simples ou palavra única).",
      "Etapa 4: Pausa de movimento e alongamento de dedos.",
      "Etapa 5: O aprendente resume com suas próprias palavras a ideia principal."
    ],
    visualSupport: [
      "Cartão Guia com símbolos: Lupa = Ideia Principal, Flecha = Causa, Estrela = Conclusão",
      "Régua de leitura com janela vazada para focar uma linha por vez"
    ],
    multiplePathways: [
      { format: "Seleção com Marcador", description: "Grifar apenas a palavra central no cartão de leitura." },
      { format: "Cartões de Resumo", description: "Associar o parágrafo a 3 títulos pré-elaborados." },
      { format: "Explicação Oral", description: "Resumo do que entendeu sem necessidade de escrever parágrafo longo." }
    ],
    challengeLevel: "intermediario",
    adaptations: [
      "Espaçamento entre linhas 1.5 e fonte sem serifa",
      "Frases curtas (máximo 12 palavras por sentença)",
      "Zero penalidade por hesitação na leitura em voz alta"
    ],
    environmentalAdaptations: [
      "Ambiente silencioso com estímulo visual controlado nas paredes",
      "Cadeira com suporte ergonômico e apoio para os pés"
    ],
    studentInterestsBridging: "Textos baseados em curiosidades de astrofísica e animais marinhos profundos.",
    professionalNotes: "Observar se a dificuldade é decodificação grafo-fonêmica ou sobrecarga de memória de trabalho.",
    status: "READY",
    version: 1,
    isTemplate: false,
    createdAt: "2026-09-02T14:00:00Z",
    updatedAt: "2026-09-02T14:00:00Z"
  }
];

export const smartPlannerService = {
  // =========================================================================
  // 1. GESTÃO DE USUÁRIOS ASSISTIDOS (VÍNCULOS E ESCOPO AUTORIZADO)
  // =========================================================================

  /**
   * Retorna os usuários do escopo autorizado do profissional.
   * Não expõe todos os usuários da base indiscriminadamente.
   */
  async getAuthorizedAssistedUsers(professionalUserId: string): Promise<AssistedUserSummary[]> {
    try {
      // 1. Tenta buscar da tabela de vínculos do Supabase
      const { data, error } = await supabase
        .from("professional_assisted_links")
        .select(`
          id,
          assisted_user_id,
          relationship_type,
          institution_name,
          class_group,
          status,
          profiles:assisted_user_id (
            id,
            display_name,
            preferred_name,
            birth_date,
            support_level,
            ciptea_number
          )
        `)
        .eq("professional_user_id", professionalUserId)
        .eq("status", "active");

      if (!error && data && data.length > 0) {
        return data.map((item: any) => {
          const prof = item.profiles || {};
          return {
            id: item.assisted_user_id,
            displayName: prof.display_name || "Usuário Assistido",
            preferredName: prof.preferred_name,
            birthDate: prof.birth_date,
            institutionName: item.institution_name,
            classGroup: item.class_group,
            relationshipType: item.relationship_type || "assistido",
            supportLevel: prof.support_level,
          };
        });
      }
    } catch (e) {
      console.warn("Aviso ao buscar vínculos remotos:", e);
    }

    // 2. Consulta cache local ou fallback seguro estruturado
    try {
      const localCacheKey = `neuroconecta_assisted_links_${professionalUserId}`;
      const localRaw = localStorage.getItem(localCacheKey);
      if (localRaw) {
        const parsed = JSON.parse(localRaw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn(e);
    }

    return SEED_ASSISTED_USERS;
  },

  /**
   * Salva ou vincula um novo usuário ao escopo do profissional
   */
  async linkAssistedUser(
    professionalUserId: string,
    assistedUser: AssistedUserSummary
  ): Promise<void> {
    try {
      await supabase.from("professional_assisted_links").upsert({
        professional_user_id: professionalUserId,
        assisted_user_id: assistedUser.id,
        relationship_type: assistedUser.relationshipType,
        institution_name: assistedUser.institutionName,
        class_group: assistedUser.classGroup,
        status: "active",
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn("Fallback ao vincular usuário:", e);
    }

    // Atualiza cache local
    const current = await this.getAuthorizedAssistedUsers(professionalUserId);
    const exists = current.some((u) => u.id === assistedUser.id);
    const updated = exists
      ? current.map((u) => (u.id === assistedUser.id ? assistedUser : u))
      : [assistedUser, ...current];

    try {
      localStorage.setItem(`neuroconecta_assisted_links_${professionalUserId}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  },

  /**
   * Recupera o contexto autorizado (mínimo necessário) de um usuário assistido
   */
  async getAssistedUserContext(assistedUserId: string): Promise<AssistedUserSummary | null> {
    if (!assistedUserId) return null;

    const all = SEED_ASSISTED_USERS;
    const match = all.find((u) => u.id === assistedUserId);
    if (match) return match;

    // Tenta no localStorage de usuários conhecidos
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith("neuroconecta_assisted_links_"));
      for (const k of keys) {
        const raw = localStorage.getItem(k);
        if (raw) {
          const list: AssistedUserSummary[] = JSON.parse(raw);
          const found = list.find((u) => u.id === assistedUserId);
          if (found) return found;
        }
      }
    } catch (e) {
      console.warn(e);
    }

    return null;
  },

  // =========================================================================
  // 2. ATIVIDADES PLANEJADAS (CRUD, PERSISTÊNCIA CANÔNICA, VERSIONAMENTO)
  // =========================================================================

  /**
   * Busca atividades aplicando filtros por especialidade, aluno, status ou busca textual
   */
  async getActivities(
    professionalUserId: string,
    filters?: ActivityFilterOptions
  ): Promise<PlannedActivity[]> {
    let remoteActivities: PlannedActivity[] = [];

    try {
      let query = supabase
        .from("planned_activities")
        .select("*")
        .or(`professional_user_id.eq.${professionalUserId},assisted_user_id.eq.${professionalUserId}`)
        .order("created_at", { ascending: false });

      if (filters?.specialty && filters.specialty !== "todos") {
        query = query.eq("specialty", filters.specialty);
      }
      if (filters?.assistedUserId && filters.assistedUserId !== "todos") {
        query = query.eq("assisted_user_id", filters.assistedUserId);
      }
      if (filters?.status && filters.status !== "todos") {
        query = query.eq("status", filters.status);
      }

      const { data, error } = await query;
      if (!error && data) {
        remoteActivities = data.map(this.mapDatabaseToActivity);
      }
    } catch (e) {
      console.warn("Aviso ao puxar atividades remotas:", e);
    }

    // Leitura do cache local para resiliência offline
    const localKey = `neuroconecta_activities_${professionalUserId}`;
    let localActivities: PlannedActivity[] = [];
    try {
      const localRaw = localStorage.getItem(localKey);
      if (localRaw) {
        localActivities = JSON.parse(localRaw);
      } else {
        localActivities = SEED_ACTIVITIES;
        localStorage.setItem(localKey, JSON.stringify(localActivities));
      }
    } catch (e) {
      console.warn(e);
    }

    // Mescla garantindo unicidade por ID
    const mergedMap = new Map<string, PlannedActivity>();
    for (const a of localActivities) mergedMap.set(a.id, a);
    for (const a of remoteActivities) mergedMap.set(a.id, a);

    let result = Array.from(mergedMap.values());

    // Aplicação de filtros em memória
    if (filters) {
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        result = result.filter(
          (a) =>
            a.title.toLowerCase().includes(term) ||
            a.objective.toLowerCase().includes(term) ||
            a.assistedUserName?.toLowerCase().includes(term) ||
            a.disciplines.some((d) => d.toLowerCase().includes(term)) ||
            a.learningProcesses.some((p) => p.toLowerCase().includes(term))
        );
      }
      if (filters.specialty && filters.specialty !== "todos") {
        result = result.filter((a) => a.specialty === filters.specialty);
      }
      if (filters.assistedUserId && filters.assistedUserId !== "todos") {
        result = result.filter((a) => a.assistedUserId === filters.assistedUserId);
      }
      if (filters.status && filters.status !== "todos") {
        result = result.filter((a) => a.status === filters.status);
      }
      if (filters.isTemplateOnly) {
        result = result.filter((a) => a.isTemplate);
      }
    }

    return result;
  },

  /**
   * Salva ou atualiza uma atividade no Supabase.
   * Regra estrita: Se a atividade já foi aplicada (status === APPLIED), ela NÃO é alterada retroativamente!
   * Uma nova versão (v2, v3...) é gerada com parentActivityId.
   */
  async saveActivity(
    activity: PlannedActivity,
    actorUserId: string
  ): Promise<{ activity: PlannedActivity; isNewVersion: boolean }> {
    let activityToSave = { ...activity };
    let isNewVersion = false;

    // Se já foi aplicada, preserva o histórico criando nova versão
    if (activity.status === "APPLIED") {
      isNewVersion = true;
      activityToSave = {
        ...activity,
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        version: (activity.version || 1) + 1,
        parentActivityId: activity.id,
        status: "READY",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      activityToSave.updatedAt = new Date().toISOString();
    }

    // 1. Tenta persistência canônica no Supabase
    try {
      const dbPayload = this.mapActivityToDatabase(activityToSave);
      const { error } = await supabase
        .from("planned_activities")
        .upsert(dbPayload, { onConflict: "id" });

      if (error) {
        console.warn("Aviso Supabase planned_activities:", error);
      }
    } catch (e) {
      console.warn("Fallback local para atividade:", e);
    }

    // 2. Atualiza cache local isolado
    try {
      const localKey = `neuroconecta_activities_${actorUserId}`;
      const existingRaw = localStorage.getItem(localKey);
      let list: PlannedActivity[] = existingRaw ? JSON.parse(existingRaw) : [];
      const index = list.findIndex((a) => a.id === activityToSave.id);
      if (index >= 0) {
        list[index] = activityToSave;
      } else {
        list = [activityToSave, ...list];
      }
      localStorage.setItem(localKey, JSON.stringify(list));

      // Também sincroniza no cache do usuário assistido se houver
      if (activityToSave.assistedUserId) {
        const studentKey = `neuroconecta_student_activities_${activityToSave.assistedUserId}`;
        const studentRaw = localStorage.getItem(studentKey);
        let studentList: PlannedActivity[] = studentRaw ? JSON.parse(studentRaw) : [];
        const sIndex = studentList.findIndex((a) => a.id === activityToSave.id);
        if (sIndex >= 0) {
          studentList[sIndex] = activityToSave;
        } else {
          studentList = [activityToSave, ...studentList];
        }
        localStorage.setItem(studentKey, JSON.stringify(studentList));
      }
    } catch (e) {
      console.error(e);
    }

    // 3. Auditoria Imutável
    await auditService.log({
      actorUserId,
      action: isNewVersion ? "ACTIVITY_CREATED" : "ACTIVITY_UPDATED",
      entityType: "planned_activity",
      entityId: activityToSave.id,
      afterData: {
        title: activityToSave.title,
        specialty: activityToSave.specialty,
        assistedUserId: activityToSave.assistedUserId,
        version: activityToSave.version,
        status: activityToSave.status,
      },
      source: "smartPlannerService.saveActivity",
    });

    return { activity: activityToSave, isNewVersion };
  },

  /**
   * Duplica uma atividade gerando NOVO ID independente.
   * Pode ser duplicada para o mesmo aluno, para outro aluno ou como modelo sem vínculo.
   */
  async duplicateActivity(
    sourceActivity: PlannedActivity,
    targetAssistedUser: AssistedUserSummary | null,
    actorUserId: string
  ): Promise<PlannedActivity> {
    const duplicated: PlannedActivity = {
      ...sourceActivity,
      id: `act-copy-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: `${sourceActivity.title} (Cópia)`,
      assistedUserId: targetAssistedUser ? targetAssistedUser.id : null,
      assistedUserName: targetAssistedUser ? targetAssistedUser.displayName : undefined,
      gradeLevel: targetAssistedUser?.gradeLevel || sourceActivity.gradeLevel,
      educationStage: targetAssistedUser?.educationStage || sourceActivity.educationStage,
      status: "READY",
      version: 1,
      parentActivityId: null,
      copiedFromActivityId: sourceActivity.id,
      isTemplate: !targetAssistedUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archivedAt: null,
      archivedBy: null,
    };

    await this.saveActivity(duplicated, actorUserId);

    await auditService.log({
      actorUserId,
      action: "ACTIVITY_DUPLICATED",
      entityType: "planned_activity",
      entityId: duplicated.id,
      beforeData: { sourceId: sourceActivity.id },
      afterData: { newId: duplicated.id, targetUserId: targetAssistedUser?.id },
      source: "smartPlannerService.duplicateActivity",
    });

    return duplicated;
  },

  /**
   * Arquivamento lógico de atividade. Para atividades aplicadas, nunca apaga fisicamente.
   */
  async archiveActivity(activityId: string, actorUserId: string): Promise<void> {
    const now = new Date().toISOString();

    try {
      await supabase
        .from("planned_activities")
        .update({
          status: "ARCHIVED",
          archived_at: now,
          archived_by: actorUserId,
          updated_at: now,
        })
        .eq("id", activityId);
    } catch (e) {
      console.warn("Fallback ao arquivar atividade:", e);
    }

    // Atualiza local cache
    const localKey = `neuroconecta_activities_${actorUserId}`;
    try {
      const raw = localStorage.getItem(localKey);
      if (raw) {
        const list: PlannedActivity[] = JSON.parse(raw);
        const updated = list.map((a) =>
          a.id === activityId
            ? { ...a, status: "ARCHIVED" as const, archivedAt: now, archivedBy: actorUserId, updatedAt: now }
            : a
        );
        localStorage.setItem(localKey, JSON.stringify(updated));
      }
    } catch (e) {
      console.error(e);
    }

    await auditService.log({
      actorUserId,
      action: "ACTIVITY_ARCHIVED",
      entityType: "planned_activity",
      entityId: activityId,
      source: "smartPlannerService.archiveActivity",
    });
  },

  // =========================================================================
  // 3. REGISTRO DE APLICAÇÃO (FEEDBACK, NÍVEL DE APOIO, MEMÓRIA PEDAGÓGICA)
  // =========================================================================

  async recordApplication(
    applicationData: Omit<ActivityApplicationRecord, "id" | "createdAt">,
    actorUserId: string
  ): Promise<ActivityApplicationRecord> {
    const record: ActivityApplicationRecord = {
      ...applicationData,
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    // 1. Salva na tabela activity_applications
    try {
      await supabase.from("activity_applications").insert({
        id: record.id,
        activity_id: record.activityId,
        activity_version: record.activityVersion,
        activity_title: record.activityTitle,
        professional_user_id: record.professionalUserId,
        professional_name: record.professionalName,
        assisted_user_id: record.assistedUserId,
        assisted_user_name: record.assistedUserName,
        applied_date: record.appliedDate,
        was_completed: record.wasCompleted,
        actual_duration_minutes: record.actualDurationMinutes,
        support_level: record.supportLevel,
        engagement_score: record.engagementScore,
        strategies_worked: record.strategiesWorked,
        difficulties_observed: record.difficultiesObserved,
        adaptations_made: record.adaptationsMade,
        learner_feedback: record.learnerFeedback,
        observations: record.observations,
        next_steps: record.nextSteps,
        created_at: record.createdAt,
      });

      // Marca a atividade como APPLIED
      await supabase
        .from("planned_activities")
        .update({ status: "APPLIED", updated_at: new Date().toISOString() })
        .eq("id", record.activityId);
    } catch (e) {
      console.warn("Fallback local para registro de aplicação:", e);
    }

    // 2. Cache local
    try {
      const appKey = `neuroconecta_applications_${record.assistedUserId}`;
      const raw = localStorage.getItem(appKey);
      const list: ActivityApplicationRecord[] = raw ? JSON.parse(raw) : [];
      list.unshift(record);
      localStorage.setItem(appKey, JSON.stringify(list));

      // Atualiza status da atividade no cache local
      const actKey = `neuroconecta_activities_${actorUserId}`;
      const actRaw = localStorage.getItem(actKey);
      if (actRaw) {
        const actList: PlannedActivity[] = JSON.parse(actRaw);
        const updatedActList = actList.map((a) => (a.id === record.activityId ? { ...a, status: "APPLIED" as const } : a));
        localStorage.setItem(actKey, JSON.stringify(updatedActList));
      }
    } catch (e) {
      console.error(e);
    }

    // 3. Auditoria
    await auditService.log({
      actorUserId,
      action: "ACTIVITY_APPLIED",
      entityType: "activity_application",
      entityId: record.id,
      afterData: {
        activityId: record.activityId,
        assistedUserId: record.assistedUserId,
        supportLevel: record.supportLevel,
        engagementScore: record.engagementScore,
      },
      source: "smartPlannerService.recordApplication",
    });

    return record;
  },

  async getApplicationsForStudent(assistedUserId: string): Promise<ActivityApplicationRecord[]> {
    try {
      const { data, error } = await supabase
        .from("activity_applications")
        .select("*")
        .eq("assisted_user_id", assistedUserId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          activityId: d.activity_id,
          activityVersion: d.activity_version,
          activityTitle: d.activity_title,
          professionalUserId: d.professional_user_id,
          professionalName: d.professional_name,
          assistedUserId: d.assisted_user_id,
          assistedUserName: d.assisted_user_name,
          appliedDate: d.applied_date,
          wasCompleted: d.was_completed,
          actualDurationMinutes: d.actual_duration_minutes,
          supportLevel: d.support_level,
          engagementScore: d.engagement_score,
          strategiesWorked: d.strategies_worked || [],
          difficultiesObserved: d.difficulties_observed,
          adaptationsMade: d.adaptations_made,
          learnerFeedback: d.learner_feedback,
          observations: d.observations,
          nextSteps: d.next_steps,
          createdAt: d.created_at,
        }));
      }
    } catch (e) {
      console.warn("Aviso ao buscar aplicações:", e);
    }

    try {
      const raw = localStorage.getItem(`neuroconecta_applications_${assistedUserId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn(e);
    }

    return [];
  },

  // =========================================================================
  // 4. PSICOPEDAGOGIA — PLANO E CICLO DE APRENDIZAGEM
  // =========================================================================

  async getPsychopedagogyPlan(
    assistedUserId: string,
    professionalUserId: string
  ): Promise<PsychopedagogyPlan> {
    const storageKey = `neuroconecta_psi_plan_${assistedUserId}`;

    try {
      const { data, error } = await supabase
        .from("psychopedagogy_plans")
        .select("*")
        .eq("assisted_user_id", assistedUserId)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          professionalUserId: data.professional_user_id,
          assistedUserId: data.assisted_user_id,
          assistedUserName: data.assisted_user_name,
          demandDescription: data.demand_description,
          developmentContext: data.development_context,
          strengthsObserved: data.strengths_observed || [],
          difficultiesObserved: data.difficulties_observed || [],
          priorityGoals: data.priority_goals || [],
          environmentalAdaptations: data.environmental_adaptations || [],
          indicatorsOfProgress: data.indicators_of_progress || [],
          status: data.status,
          lastReviewDate: data.last_review_date,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch (e) {
      console.warn("Aviso ao buscar plano psicopedagógico remoto:", e);
    }

    // Local fallback
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn(e);
    }

    // Default estruturado inicial
    const student = (await this.getAssistedUserContext(assistedUserId)) || {
      displayName: "Aprendente",
    };

    return {
      id: `plan-pp-${assistedUserId}`,
      professionalUserId,
      assistedUserId,
      assistedUserName: student.displayName,
      demandDescription: "Acompanhamento das estratégias de autorregulação e compreensão leitora no contexto escolar.",
      developmentContext: "Estudante com bom potencial criativo, ritmo próprio para tarefas com escrita manual exaustiva.",
      strengthsObserved: ["Raciocínio lógico dedutivo", "Interesse por tecnologia", "Sensibilidade estética"],
      difficultiesObserved: ["Hesitação inicial para iniciar produções longas", "Cansaço com ruído de fundo da sala"],
      priorityGoals: [
        {
          id: `goal-1`,
          description: "Compreender ideias principais de textos curtos utilizando apoio de esquemas visuais.",
          targetProcess: "Compreensão e Interpretação Textual",
          priority: "alta",
          status: "ativo",
          strategiesPlanned: ["Régua visual de leitura", "Sublinhado temático com duas cores", "Resumo por gravação de áudio"],
          reachCriteria: "Identificar o tema central em 4 de 5 leituras sem necessidade de mediação direta contínua.",
          reviewDate: "2026-10-15",
          linkedActivitiesCount: 1,
        },
        {
          id: `goal-2`,
          description: "Organizar etapas de estudo autônomo com temporizador visual e checklist.",
          targetProcess: "Funções Executivas (Planejamento e Organização)",
          priority: "media",
          status: "ativo",
          strategiesPlanned: ["Timer de 15 minutos", "Cartão de 'Primeiro / Depois'"],
          reachCriteria: "Completar a rotina de lição em 3 dias na semana de forma independente.",
          reviewDate: "2026-11-01",
          linkedActivitiesCount: 0,
        },
      ],
      environmentalAdaptations: [
        "Uso de abafador sonoro em avaliações ou momentos de concentração",
        "Disponibilização de cópias impressas com fonte sem serifa e bom espaçamento",
      ],
      indicatorsOfProgress: [
        "Aumento da autonomia na transição de tarefas",
        "Redução da frustração ao receber instruções com etapas visuais",
      ],
      status: "ativo",
      lastReviewDate: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async savePsychopedagogyPlan(
    plan: PsychopedagogyPlan,
    actorUserId: string
  ): Promise<PsychopedagogyPlan> {
    const updatedPlan: PsychopedagogyPlan = {
      ...plan,
      updatedAt: new Date().toISOString(),
    };

    try {
      await supabase.from("psychopedagogy_plans").upsert({
        id: updatedPlan.id,
        professional_user_id: updatedPlan.professionalUserId,
        assisted_user_id: updatedPlan.assistedUserId,
        assisted_user_name: updatedPlan.assistedUserName,
        demand_description: updatedPlan.demandDescription,
        development_context: updatedPlan.developmentContext,
        strengths_observed: updatedPlan.strengthsObserved,
        difficulties_observed: updatedPlan.difficultiesObserved,
        priority_goals: updatedPlan.priorityGoals,
        environmental_adaptations: updatedPlan.environmentalAdaptations,
        indicators_of_progress: updatedPlan.indicatorsOfProgress,
        status: updatedPlan.status,
        last_review_date: updatedPlan.lastReviewDate,
        created_at: updatedPlan.createdAt,
        updated_at: updatedPlan.updatedAt,
      });
    } catch (e) {
      console.warn("Fallback ao salvar plano psicopedagógico:", e);
    }

    try {
      localStorage.setItem(`neuroconecta_psi_plan_${updatedPlan.assistedUserId}`, JSON.stringify(updatedPlan));
    } catch (e) {
      console.error(e);
    }

    await auditService.log({
      actorUserId,
      action: "PLAN_UPDATED",
      entityType: "psychopedagogy_plan",
      entityId: updatedPlan.id,
      afterData: { goalsCount: updatedPlan.priorityGoals.length, status: updatedPlan.status },
      source: "smartPlannerService.savePsychopedagogyPlan",
    });

    return updatedPlan;
  },

  // =========================================================================
  // 5. PSICOLOGIA — PROCESSO TERAPÊUTICO & ALIANÇA (FUNDAMENTAÇÃO TCC JÚLIA)
  // =========================================================================

  async getPsychologyProcess(
    patientUserId: string,
    professionalUserId: string
  ): Promise<PsychologyTherapeuticProcess> {
    const storageKey = `neuroconecta_psy_process_${patientUserId}`;

    try {
      const { data, error } = await supabase
        .from("psychology_processes")
        .select("*")
        .eq("patient_user_id", patientUserId)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          professionalUserId: data.professional_user_id,
          patientUserId: data.patient_user_id,
          patientName: data.patient_name,
          startDate: data.start_date,
          therapeuticApproach: data.therapeutic_approach,
          collaborativeGoals: data.collaborative_goals || [],
          sessionAgendas: data.session_agendas || [],
          interSessionActivities: data.inter_session_activities || [],
          processCheckIns: data.process_check_ins || [],
          ruptureAlerts: data.rupture_alerts || [],
          status: data.status,
          updatedAt: data.updated_at,
        };
      }
    } catch (e) {
      console.warn("Aviso ao buscar processo psicológico remoto:", e);
    }

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn(e);
    }

    const patient = (await this.getAssistedUserContext(patientUserId)) || {
      displayName: "Paciente",
    };

    return {
      id: `psy-proc-${patientUserId}`,
      professionalUserId,
      patientUserId,
      patientName: patient.displayName,
      startDate: "2026-08-01",
      therapeuticApproach: "Terapia Cognitivo-Comportamental (TCC) Neuroafirmativa",
      collaborativeGoals: [
        {
          id: "t-goal-1",
          description: "Mapear situações disparadoras de sobrecarga e desenvolver estratégias antecipatórias de regulação.",
          priority: "alta",
          status: "ativo",
          discussedWithPatient: true,
          understoodByPatient: true,
          reviewDate: "2026-10-30",
          notes: "Objetivo construído na 2ª sessão; paciente identifica ambientes escolares ruidosos como foco principal.",
        },
        {
          id: "t-goal-2",
          description: "Identificar pensamentos automáticos de autocrítica em momentos de hesitação e reestruturá-los com compaixão.",
          priority: "media",
          status: "ativo",
          discussedWithPatient: true,
          understoodByPatient: true,
          reviewDate: "2026-11-15",
          notes: "Trabalhado com registro de pensamentos adaptado para formato visual.",
        },
      ],
      sessionAgendas: [
        {
          id: "agenda-1",
          sessionDate: "2026-09-08",
          patientPriorities: "Falar sobre o cansaço do trabalho em grupo da última terça-feira.",
          professionalPriorities: "Revisar o plano de descompressão e verificar se houve melhora na rotina de sono.",
          agreedAgendaTopics: [
            "1. Acolhimento e checagem de humor da semana",
            "2. Relato do trabalho em grupo e sentimentos evocados",
            "3. Estratégia de pausas combinadas com o professor",
            "4. Próximos passos e atividade entre sessões"
          ],
          summaryNotes: "Sessão colaborativa. O paciente participou ativamente da definição do tema central.",
          nextSessionTopic: "Aprofundar a comunicação assertiva com os pares.",
        },
      ],
      interSessionActivities: [
        {
          id: "task-1",
          title: "Diário de Pistas de Sobrecarga (Formato Visual)",
          resourceCategory: "identificacao_pensamentos",
          description: "Anotar em uma escala de 1 a 5 o nível de energia ao final de cada dia, notando se houve barulho excessivo.",
          objectiveExplanation: "Ajudar a identificar padrões para que possamos planejar pausas antes do cansaço extremo.",
          patientUnderstandsGoal: true,
          wasAgreedInSession: true,
          status: "em_andamento",
          createdAt: "2026-09-08",
        },
      ],
      processCheckIns: [
        {
          id: "chk-1",
          date: "2026-09-08",
          feltHeardScore: 5,
          sessionMadeSenseScore: 5,
          understoodGoalsScore: 4,
          taskFeasibleScore: 4,
          openMessageForTherapist: "Gostei de podermos dividir a tarefa em passos menores.",
          createdAt: "2026-09-08T16:50:00Z",
        },
      ],
      ruptureAlerts: [],
      status: "em_andamento",
      updatedAt: new Date().toISOString(),
    };
  },

  async savePsychologyProcess(
    process: PsychologyTherapeuticProcess,
    actorUserId: string
  ): Promise<PsychologyTherapeuticProcess> {
    const updated: PsychologyTherapeuticProcess = {
      ...process,
      updatedAt: new Date().toISOString(),
    };

    try {
      await supabase.from("psychology_processes").upsert({
        id: updated.id,
        professional_user_id: updated.professionalUserId,
        patient_user_id: updated.patientUserId,
        patient_name: updated.patientName,
        start_date: updated.startDate,
        therapeutic_approach: updated.therapeuticApproach,
        collaborative_goals: updated.collaborativeGoals,
        session_agendas: updated.sessionAgendas,
        inter_session_activities: updated.interSessionActivities,
        process_check_ins: updated.processCheckIns,
        rupture_alerts: updated.ruptureAlerts,
        status: updated.status,
        updated_at: updated.updatedAt,
      });
    } catch (e) {
      console.warn("Fallback ao salvar processo psicológico:", e);
    }

    try {
      localStorage.setItem(`neuroconecta_psy_process_${updated.patientUserId}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    await auditService.log({
      actorUserId,
      action: "PLAN_UPDATED",
      entityType: "psychology_process",
      entityId: updated.id,
      afterData: {
        patientId: updated.patientUserId,
        goalsCount: updated.collaborativeGoals.length,
        ruptureAlertsCount: updated.ruptureAlerts.length,
      },
      source: "smartPlannerService.savePsychologyProcess",
    });

    return updated;
  },

  // =========================================================================
  // MAPPERS DATABASE <-> FRONTEND
  // =========================================================================

  mapDatabaseToActivity(row: any): PlannedActivity {
    return {
      id: row.id,
      professionalUserId: row.professional_user_id,
      professionalName: row.professional_name,
      assistedUserId: row.assisted_user_id,
      assistedUserName: row.assisted_user_name,
      specialty: row.specialty,
      title: row.title,
      objective: row.objective,
      disciplines: row.disciplines || [],
      learningProcesses: row.learning_processes || [],
      educationStage: row.education_stage,
      gradeLevel: row.grade_level,
      duration: row.duration,
      format: row.format,
      materials: row.materials,
      instructions: row.instructions,
      stepByStep: row.step_by_step || [],
      visualSupport: row.visual_support || [],
      multiplePathways: row.multiple_pathways || [],
      challengeLevel: row.challenge_level,
      adaptations: row.adaptations || [],
      environmentalAdaptations: row.environmental_adaptations || [],
      studentInterestsBridging: row.student_interests_bridging,
      professionalNotes: row.professional_notes,
      status: row.status,
      version: row.version || 1,
      parentActivityId: row.parent_activity_id,
      copiedFromActivityId: row.copied_from_activity_id,
      isTemplate: !!row.is_template,
      tags: row.tags || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      archivedAt: row.archived_at,
      archivedBy: row.archived_by,
    };
  },

  mapActivityToDatabase(activity: PlannedActivity): any {
    return {
      id: activity.id,
      professional_user_id: activity.professionalUserId,
      professional_name: activity.professionalName,
      assisted_user_id: activity.assistedUserId || null,
      assisted_user_name: activity.assistedUserName || null,
      specialty: activity.specialty,
      title: activity.title,
      objective: activity.objective,
      disciplines: activity.disciplines,
      learning_processes: activity.learningProcesses,
      education_stage: activity.educationStage,
      grade_level: activity.gradeLevel,
      duration: activity.duration,
      format: activity.format,
      materials: activity.materials,
      instructions: activity.instructions,
      step_by_step: activity.stepByStep,
      visual_support: activity.visualSupport,
      multiple_pathways: activity.multiplePathways,
      challenge_level: activity.challengeLevel,
      adaptations: activity.adaptations,
      environmental_adaptations: activity.environmentalAdaptations,
      student_interests_bridging: activity.studentInterestsBridging,
      professional_notes: activity.professionalNotes,
      status: activity.status,
      version: activity.version,
      parent_activity_id: activity.parentActivityId || null,
      copied_from_activity_id: activity.copiedFromActivityId || null,
      is_template: activity.isTemplate,
      tags: activity.tags || [],
      created_at: activity.createdAt,
      updated_at: activity.updatedAt,
      archived_at: activity.archivedAt || null,
      archived_by: activity.archivedBy || null,
    };
  },
};
