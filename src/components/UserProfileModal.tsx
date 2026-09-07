import React, { useState, useEffect } from "react";
import { 
  User, 
  X, 
  Plus, 
  Trash2, 
  Save, 
  Shield, 
  Users, 
  Bell, 
  Sparkles, 
  Download, 
  Upload, 
  Database, 
  Calendar,
  Sliders,
  MessageSquare,
  Baby,
  Eye,
  CheckCircle2,
  AlertCircle,
  RotateCcw
} from "lucide-react";
import { 
  UserProfile, 
  DiagnosisStatus, 
  FocusArea, 
  SupportLevel, 
  UserRole, 
  getAgeCategory, 
  calculateAge,
  InteractionProfile,
  AgeBand
} from "../types";
import { 
  getInteractionProfile, 
  saveInteractionProfile, 
  listPersonasForUser, 
  registerChildPersona,
  calculateProfileCompleteness,
  createDefaultInteractionProfile
} from "../services/interactionProfileService";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  activePersonaId?: string;
  onSelectPersona?: (personId: string) => void;
  onSaveProfile: (profile: UserProfile) => void;
}

type ModalTab = "pessoal" | "interacao" | "dependentes" | "privacidade";

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  activePersonaId,
  onSelectPersona,
  onSaveProfile,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>("pessoal");

  // Personal fields
  const [name, setName] = useState(userProfile.preferredName);
  const [pronouns, setPronouns] = useState(userProfile.pronouns);
  const [birthDate, setBirthDate] = useState(userProfile.birthDate || "2000-01-01");
  const [role, setRole] = useState<UserRole>(userProfile.userRole || (userProfile.isSuperAdmin ? "superadmin" : "pcd"));
  const [profRoleType, setProfRoleType] = useState(userProfile.professionalRoleType || "pcd");
  const [profRegisterNum, setProfRegisterNum] = useState(userProfile.professionalRegisterNumber || "");
  const [diagnosis, setDiagnosis] = useState<DiagnosisStatus>(userProfile.diagnosisStatus);
  const [supportLevel, setSupportLevel] = useState<SupportLevel>(userProfile.supportLevel || "nao_especificado");
  const [focus, setFocus] = useState<FocusArea>(userProfile.currentFocus);
  const [caregiverMode, setCaregiverMode] = useState<boolean>(userProfile.caregiverMode || false);
  const [notifications, setNotifications] = useState<boolean>(userProfile.notificationsEnabled || false);
  const [contacts, setContacts] = useState(userProfile.emergencyContacts || []);

  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactRel, setNewContactRel] = useState("");
  const [backupStatus, setBackupStatus] = useState("");

  // Interaction Profile state
  const activeUserId = userProfile.id || "guest_user";
  const currentPersonId = activePersonaId || activeUserId;
  const [intProfile, setIntProfile] = useState<InteractionProfile>(() => {
    return getInteractionProfile(activeUserId, currentPersonId);
  });

  // Reload interaction profile when active person changes
  useEffect(() => {
    setIntProfile(getInteractionProfile(activeUserId, currentPersonId));
  }, [activeUserId, currentPersonId]);

  // New child dependent form
  const [newChildName, setNewChildName] = useState("");
  const [newChildBirthDate, setNewChildBirthDate] = useState("2016-01-01");
  const [childSuccessMsg, setChildSuccessMsg] = useState("");

  if (!isOpen) return null;

  const completeness = calculateProfileCompleteness(intProfile);

  const handleExportBackup = () => {
    try {
      const dataToExport: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("neuroconecta_")) {
          dataToExport[key] = localStorage.getItem(key);
        }
      }
      const jsonStr = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `neuroconecta_backup_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setBackupStatus("✓ Backup exportado com sucesso!");
    } catch (e) {
      console.error(e);
      setBackupStatus("Erro ao exportar backup.");
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target?.result as string);
          Object.keys(importedData).forEach((key) => {
            if (key.startsWith("neuroconecta_")) {
              localStorage.setItem(key, importedData[key]);
            }
          });
          setBackupStatus("✓ Dados restaurados com sucesso! Recarregue a página.");
          setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
          setBackupStatus("Arquivo de backup inválido.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    setContacts([
      ...contacts,
      {
        name: newContactName.trim(),
        phone: newContactPhone.trim(),
        relationship: newContactRel.trim() || "Apoio",
      },
    ]);
    setNewContactName("");
    setNewContactPhone("");
    setNewContactRel("");
  };

  const handleRemoveContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleSaveInteractionProfile = (updated: Partial<InteractionProfile>) => {
    const next = { ...intProfile, ...updated, updatedAt: new Date().toISOString() };
    setIntProfile(next);
    saveInteractionProfile(next);
  };

  const handleSetDiscoverMode = () => {
    const reset = createDefaultInteractionProfile(activeUserId, currentPersonId, intProfile.personName, intProfile.faixaEtaria, "nao_sei_ainda");
    setIntProfile(reset);
    saveInteractionProfile(reset);
  };

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;

    const child = registerChildPersona(activeUserId, newChildName.trim(), newChildBirthDate);
    setChildSuccessMsg(`Perfil da criança "${child.personName}" criado com sucesso!`);
    setNewChildName("");
    if (onSelectPersona) {
      onSelectPersona(child.personId);
    }
    setTimeout(() => setChildSuccessMsg(""), 3500);
  };

  const handleSaveAll = () => {
    // 1. Save main user profile
    onSaveProfile({
      ...userProfile,
      preferredName: name,
      pronouns,
      birthDate,
      userRole: role,
      professionalRoleType: profRoleType as any,
      professionalRegisterNumber: profRegisterNum.trim() || undefined,
      diagnosisStatus: diagnosis,
      supportLevel,
      currentFocus: focus,
      caregiverMode,
      notificationsEnabled: notifications,
      emergencyContacts: contacts,
      onboardingCompleted: true,
    });

    // 2. Save interaction profile
    saveInteractionProfile({
      ...intProfile,
      personName: currentPersonId === activeUserId ? name : intProfile.personName,
    });

    onClose();
  };

  const { self, dependents } = listPersonasForUser(activeUserId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-800/90 border-b border-slate-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-950 text-teal-400 rounded-xl border border-teal-800/60">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">Meu Perfil & Preferências</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  {completeness}% Completo
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pessoa Ativa: <span className="font-semibold text-teal-300">{intProfile.personName}</span> ({intProfile.faixaEtaria})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("pessoal")}
            className={`py-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "pessoal"
                ? "border-teal-500 text-teal-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Perfil Pessoal
          </button>
          <button
            onClick={() => setActiveTab("interacao")}
            className={`py-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "interacao"
                ? "border-teal-500 text-teal-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Perfil de Interação (IA)
          </button>
          <button
            onClick={() => setActiveTab("dependentes")}
            className={`py-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "dependentes"
                ? "border-teal-500 text-teal-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Pessoa Ativa & Crianças ({dependents.length})
          </button>
          <button
            onClick={() => setActiveTab("privacidade")}
            className={`py-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "privacidade"
                ? "border-teal-500 text-teal-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Backup & Segurança
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-200 flex-1">
          
          {/* TAB 1: PERFIL PESSOAL */}
          {activeTab === "pessoal" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Como prefere ser chamado(a)?</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Ana, Lucas, Carol, Alex..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Pronomes (Opcional)</label>
                  <input
                    type="text"
                    value={pronouns}
                    onChange={(e) => setPronouns(e.target.value)}
                    placeholder="Ex: ela/dela, ele/dele, elu/delu..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" /> Data de Nascimento
                    </label>
                    <span className="text-[10px] font-bold text-teal-300 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                      {getAgeCategory(birthDate)} ({calculateAge(birthDate) !== null ? `${calculateAge(birthDate)} anos` : "N/A"})
                    </span>
                  </div>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Perfil / Módulo Principal</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500 truncate"
                  >
                    <option value="pcd">🧩 Pessoa / Autonomia pessoal</option>
                    <option value="cuidador_familiar">🏡 Família / Cuidador(a)</option>
                    <option value="cuidador_educador">🎓 Educador(a) / Escola / AEE</option>
                    <option value="profissional_apoio">🤝 Profissional de Apoio / Terapeuta</option>
                    <option value="superadmin">⚡ Administrador(a) Técnico</option>
                  </select>
                </div>
              </div>

              {/* Situação Diagnóstica - Totalmente Opcional com Aviso Transparente */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-teal-300 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-teal-400" /> Situação Diagnóstica (Totalmente Opcional)
                  </label>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Nunca obrigatório
                  </span>
                </div>
                <select
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value as DiagnosisStatus)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-teal-500"
                >
                  <option value="sem_diagnostico">Sem diagnóstico / Foco em organização e apoio prático</option>
                  <option value="autodiagnosticado">Autodeclaração / Identificação neurodivergente</option>
                  <option value="investigacao">Em processo de avaliação / Investigação</option>
                  <option value="laudo_formal">Laudo formal prévio / Confirmado por especialista</option>
                  <option value="necessidades_sensoriais_comunicacao">Necessidades sensoriais ou de comunicação específicas</option>
                  <option value="nao_informado">Prefiro não informar</option>
                </select>
                <p className="text-[10px] text-slate-400">
                  O NeuroConecta não exige laudo para liberar recursos. A IA nunca tentará confirmar ou inferir diagnóstico a partir das suas conversas.
                </p>
              </div>

              {/* Emergency Contacts */}
              <div className="space-y-2">
                <label className="block font-semibold text-slate-300">Contatos de Apoio / Emergência</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Nome do contato"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Telefone / WhatsApp"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddContact}
                    className="py-1.5 px-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar
                  </button>
                </div>

                {contacts.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {contacts.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs">
                        <span>{c.name} ({c.relationship}) — {c.phone}</span>
                        <button onClick={() => handleRemoveContact(i)} className="text-rose-400 hover:text-rose-300">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PERFIL DE INTERAÇÃO (P1.3) */}
          {activeTab === "interacao" && (
            <div className="space-y-4">
              <div className="p-3 bg-teal-950/40 border border-teal-800/80 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-teal-300 text-xs">Perfil Ativo: {intProfile.personName}</h4>
                  <p className="text-[11px] text-slate-300">
                    Faixa etária: <span className="font-semibold capitalize text-teal-400">{intProfile.faixaEtaria}</span> • Completude: {completeness}%
                  </p>
                </div>
                <button
                  onClick={handleSetDiscoverMode}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[11px] text-slate-300 flex items-center gap-1"
                  title="Restaurar modo padrão flexível"
                >
                  <RotateCcw className="w-3 h-3" />
                  Descobrir com o uso
                </button>
              </div>

              {/* Tamanho e Estilo das Respostas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Tamanho Preferido das Respostas</label>
                  <select
                    value={intProfile.tamanhoPreferidoDasRespostas}
                    onChange={(e) => handleSaveInteractionProfile({ tamanhoPreferidoDasRespostas: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                  >
                    <option value="curtas">Respostas Curtas e Diretas</option>
                    <option value="medias">Respostas Médias com Contexto</option>
                    <option value="detalhadas">Respostas Detalhadas e Explicativas</option>
                    <option value="nao_sei_ainda">Ainda não sei / Flexível</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Faixa Etária de Adaptação</label>
                  <select
                    value={intProfile.faixaEtaria}
                    onChange={(e) => handleSaveInteractionProfile({ faixaEtaria: e.target.value as AgeBand })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                  >
                    <option value="crianca">Criança (Linguagem concreta, sem infantilizar)</option>
                    <option value="adolescente">Adolescente (Direta, respeitosa à autonomia)</option>
                    <option value="adulto">Adulto (Linguagem analítica e funcional)</option>
                    <option value="idoso">Adulto mais velho (Clara e espaçada)</option>
                  </select>
                </div>
              </div>

              {/* Toggles de Acessibilidade Cognitiva */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5">
                <h5 className="font-bold text-slate-200 text-xs">Apoios de Comunicação & Raciocínio</h5>
                
                <label className="flex items-center justify-between cursor-pointer py-1">
                  <span className="text-xs text-slate-300">Respostas estruturadas em etapas (Passo 1, 2, 3)</span>
                  <input
                    type="checkbox"
                    checked={intProfile.prefereEtapas}
                    onChange={(e) => handleSaveInteractionProfile({ prefereEtapas: e.target.checked })}
                    className="w-4 h-4 accent-teal-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1 border-t border-slate-800/80">
                  <span className="text-xs text-slate-300">Incluir exemplos práticos do cotidiano</span>
                  <input
                    type="checkbox"
                    checked={intProfile.prefereExemplos}
                    onChange={(e) => handleSaveInteractionProfile({ prefereExemplos: e.target.checked })}
                    className="w-4 h-4 accent-teal-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1 border-t border-slate-800/80">
                  <span className="text-xs text-slate-300">Apoio visual (ícones, marcadores e listas)</span>
                  <input
                    type="checkbox"
                    checked={intProfile.prefereApoioVisual}
                    onChange={(e) => handleSaveInteractionProfile({ prefereApoioVisual: e.target.checked })}
                    className="w-4 h-4 accent-teal-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1 border-t border-slate-800/80">
                  <span className="text-xs text-slate-300">Linguagem literal (sem ironias ou duplos sentidos)</span>
                  <input
                    type="checkbox"
                    checked={intProfile.prefereLinguagemLiteral}
                    onChange={(e) => handleSaveInteractionProfile({ prefereLinguagemLiteral: e.target.checked })}
                    className="w-4 h-4 accent-teal-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1 border-t border-slate-800/80">
                  <span className="text-xs text-slate-300">Fazer apenas uma pergunta por vez</span>
                  <input
                    type="checkbox"
                    checked={intProfile.fazerUmaPerguntaPorVez}
                    onChange={(e) => handleSaveInteractionProfile({ fazerUmaPerguntaPorVez: e.target.checked })}
                    className="w-4 h-4 accent-teal-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1 border-t border-slate-800/80">
                  <span className="text-xs text-slate-300">Oferecer resumo prático no final da resposta</span>
                  <input
                    type="checkbox"
                    checked={intProfile.oferecerResumoNoFinal}
                    onChange={(e) => handleSaveInteractionProfile({ oferecerResumoNoFinal: e.target.checked })}
                    className="w-4 h-4 accent-teal-500 rounded"
                  />
                </label>
              </div>

              {/* Tópicos de Interesse e Conforto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Tópicos de Interesse / Hiperfoco</label>
                  <input
                    type="text"
                    value={intProfile.topicosDeInteresse?.join(", ") || ""}
                    onChange={(e) => handleSaveInteractionProfile({ 
                      topicosDeInteresse: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) 
                    })}
                    placeholder="Ex: Trens, dinossauros, programação, música..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                  />
                  <p className="text-[10px] text-slate-400">Usados para analogias úteis quando oportuno.</p>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-300">Tópicos a Evitar / Desconforto</label>
                  <input
                    type="text"
                    value={intProfile.topicosAEvitar?.join(", ") || ""}
                    onChange={(e) => handleSaveInteractionProfile({ 
                      topicosAEvitar: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) 
                    })}
                    placeholder="Ex: Barulhos repentinos, cobranças de prazos..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                  />
                  <p className="text-[10px] text-slate-400">A IA evitará abordagens que citem estes gatilhos.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PESSOAS & DEPENDENTES */}
          {activeTab === "dependentes" && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <h4 className="font-bold text-slate-200 text-xs mb-1">Pessoa Ativa na Sessão</h4>
                <p className="text-[11px] text-slate-400 mb-3">
                  Cada pessoa tem seu próprio histórico de conversas e perfil de interação isolados. O histórico da criança não se mistura com o do responsável.
                </p>

                <div className="space-y-2">
                  <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    currentPersonId === self.personId
                      ? "bg-teal-950/60 border-teal-700 text-teal-300"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-teal-400" />
                      <div>
                        <span className="font-bold text-xs">{self.personName} (Titular)</span>
                        <p className="text-[10px] text-slate-400">Perfil Principal do Usuário Logado</p>
                      </div>
                    </div>
                    {currentPersonId === self.personId ? (
                      <span className="text-[10px] font-bold bg-teal-500 text-slate-950 px-2 py-0.5 rounded-full">
                        Ativo Agora
                      </span>
                    ) : (
                      <button
                        onClick={() => onSelectPersona && onSelectPersona(self.personId)}
                        className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold"
                      >
                        Alternar para Titular
                      </button>
                    )}
                  </div>

                  {dependents.map((dep) => {
                    const isSelected = currentPersonId === dep.personId;
                    return (
                      <div key={dep.personId} className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        isSelected
                          ? "bg-amber-950/60 border-amber-700 text-amber-300"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                      }`}>
                        <div className="flex items-center gap-2">
                          <Baby className="w-4 h-4 text-amber-400" />
                          <div>
                            <span className="font-bold text-xs">{dep.personName}</span>
                            <p className="text-[10px] text-slate-400">Criança / Dependente • Modo Infantil Protegido</p>
                          </div>
                        </div>
                        {isSelected ? (
                          <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                            Ativo Agora
                          </span>
                        ) : (
                          <button
                            onClick={() => onSelectPersona && onSelectPersona(dep.personId)}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold"
                          >
                            Alternar para {dep.personName}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form to add child persona */}
              <form onSubmit={handleAddChild} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <h4 className="font-bold text-teal-300 text-xs flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Adicionar Perfil de Criança sob Meus Cuidados
                </h4>
                
                {childSuccessMsg && (
                  <div className="p-2 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-lg text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{childSuccessMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Nome da Criança (Ex: Sofia, Enzo, Ana)"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-teal-500"
                  />
                  <input
                    type="date"
                    required
                    value={newChildBirthDate}
                    onChange={(e) => setNewChildBirthDate(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Baby className="w-4 h-4" /> Cadastrar Perfil da Criança
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: BACKUP & PRIVACIDADE */}
          {activeTab === "privacidade" && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-teal-400" /> Princípios de Privacidade & Minimização de Dados
                </h4>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
                  <li>O NeuroConecta não compartilha seus dados pessoais com terceiros.</li>
                  <li>O assistente de IA recebe apenas o contexto estritamente necessário para responder a cada pergunta.</li>
                  <li>O histórico de conversas não é usado para treinamento de modelos de terceiros.</li>
                  <li>Você pode exportar ou apagar seus dados a qualquer momento.</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleExportBackup}
                  className="p-3 bg-slate-950 border border-slate-700 hover:border-teal-500 rounded-xl flex items-center gap-2.5 transition text-left"
                >
                  <Download className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-slate-100">Exportar Backup JSON</div>
                    <div className="text-[10px] text-slate-400">Baixar cópia de segurança de todos os registros locais.</div>
                  </div>
                </button>

                <label className="p-3 bg-slate-950 border border-slate-700 hover:border-teal-500 rounded-xl flex items-center gap-2.5 transition cursor-pointer text-left">
                  <Upload className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-slate-100">Restaurar Backup JSON</div>
                    <div className="text-[10px] text-slate-400">Restaurar preferências de um arquivo anterior.</div>
                  </div>
                  <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                </label>
              </div>

              {backupStatus && (
                <div className="p-2.5 bg-teal-950/80 border border-teal-700 rounded-xl text-xs text-teal-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>{backupStatus}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Save Actions */}
        <div className="bg-slate-800/90 border-t border-slate-700 p-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Fechar
          </button>
          <button
            onClick={handleSaveAll}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition shadow-lg"
          >
            <Save className="w-4 h-4" /> Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
};
