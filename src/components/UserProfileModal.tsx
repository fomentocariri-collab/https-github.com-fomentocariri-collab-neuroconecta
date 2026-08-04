import React, { useState } from "react";
import { User, X, Plus, Trash2, Save, Shield, Users, Bell, Sparkles, Download, Upload, Database } from "lucide-react";
import { UserProfile, DiagnosisStatus, FocusArea, SupportLevel, UserRole } from "../types";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
}) => {
  const [name, setName] = useState(userProfile.preferredName);
  const [pronouns, setPronouns] = useState(userProfile.pronouns);
  const [role, setRole] = useState<UserRole>(userProfile.userRole || (userProfile.isSuperAdmin ? "superadmin" : "pcd"));
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

  if (!isOpen) return null;

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
      setBackupStatus("✓ Backup gerado com sucesso!");
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
          setBackupStatus("✓ Dados restaurados com sucesso! Recarregue para aplicar.");
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

  const handleSave = () => {
    onSaveProfile({
      ...userProfile,
      preferredName: name,
      pronouns,
      userRole: role,
      diagnosisStatus: diagnosis,
      supportLevel,
      currentFocus: focus,
      caregiverMode,
      notificationsEnabled: notifications,
      emergencyContacts: contacts,
      onboardingCompleted: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-800/90 border-b border-slate-700 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-950 text-teal-400 rounded-xl border border-teal-800/60">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Seu Perfil NeuroConecta</h2>
              <p className="text-xs text-slate-400">Personalize como o aplicativo e o assistente se comunicam com você.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          
          {/* Preferred Name */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-200">Como prefere ser chamado(a)?</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Ana, Lucas, Carol, Alex..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Pronouns */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-200">Pronomes de preferência</label>
            <input
              type="text"
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
              placeholder="Ex: ela/dela, ele/dele, elu/delu..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* User Role Selection */}
          <div className="space-y-1.5 p-3.5 bg-slate-950 border border-teal-800/80 rounded-2xl">
            <label className="block font-bold text-teal-300 text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-400" /> Perfil / Módulo Principal de Acesso
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs font-semibold focus:outline-none focus:border-teal-500"
            >
              <option value="pcd">🧩 Pessoa Neurodivergente / PCD (Interface Calma & Autorregulação)</option>
              <option value="cuidador_educador">🎓 Educador Especial / Cuidador / Pai (Módulo PEI & Orientação)</option>
              <option value="saude_caps">🩺 Médico / Enfermeiro / Saúde Mental CAPS (Prontuário & Escalas)</option>
              <option value="superadmin">⚡ Gestor / Superadmin de TI (Acesso Geral & Banco)</option>
            </select>
          </div>

          {/* Diagnosis & Support Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-200">Status do Diagnóstico</label>
              <select
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value as DiagnosisStatus)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-teal-500"
              >
                <option value="autodiagnosticado">Autodiagnosticado / Identificação autista</option>
                <option value="investigacao">Em avaliação / Investigação</option>
                <option value="laudo_formal">Laudo formal (Diagnóstico confirmed)</option>
                <option value="familiar_apoiador">Familiar ou cuidador(a)</option>
                <option value="nao_informado">Prefiro não informar</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-200">Nível de Suporte (TEA)</label>
              <select
                value={supportLevel}
                onChange={(e) => {
                  const val = e.target.value;
                  setSupportLevel(val === "1" ? 1 : val === "2" ? 2 : val === "3" ? 3 : "nao_especificado");
                }}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-teal-500"
              >
                <option value="1">Nível 1 (Apoio leve / Leve a moderado)</option>
                <option value="2">Nível 2 (Apoio substancial / Intermediário)</option>
                <option value="3">Nível 3 (Apoio muito substancial / Intenso)</option>
                <option value="nao_especificado">Não especificado / Em avaliação</option>
              </select>
            </div>
          </div>

          {/* Caregiver Mode & Notifications Toggles */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                <div>
                  <h4 className="font-semibold text-slate-100 text-xs">Modo Cuidador / Familiar / Rede de Apoio</h4>
                  <p className="text-[11px] text-slate-400">Exibe orientações específicas para familiares acompanharem no dia a dia.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={caregiverMode}
                onChange={(e) => setCaregiverMode(e.target.checked)}
                className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-teal-400" />
                <div>
                  <h4 className="font-semibold text-slate-100 text-xs">Notificações Inteligentes Ativas</h4>
                  <p className="text-[11px] text-slate-400">Lembretes para hidratação, pausas sensoriais e transição de rotina.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Current Focus Area */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-200">Área principal de foco hoje</label>
            <select
              value={focus}
              onChange={(e) => setFocus(e.target.value as FocusArea)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
            >
              <option value="rotina">Rotina Visual e Organização</option>
              <option value="testes">Testes e Autoavaliação</option>
              <option value="sensorial">Regulação Sensorial</option>
              <option value="comunicacao">Comunicação e Scripts Sociais</option>
              <option value="crise">Prevenção e Apoio em Crise</option>
              <option value="aprendizado">Educação e Empoderamento</option>
              <option value="geral">Geral / Diversos</option>
            </select>
          </div>

          {/* Backup & Local Data Export */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-teal-400 font-semibold">
              <Database className="w-4 h-4" />
              <span>Backup Local & Portabilidade dos Dados</span>
            </div>
            <p className="text-xs text-slate-400">
              Exporte seus registros (rotinas, humor, testes, medicamentos) para um arquivo JSON seguro ou restaure em outro aparelho:
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleExportBackup}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition"
              >
                <Download className="w-4 h-4" /> Exportar Backup (JSON)
              </button>

              <label className="cursor-pointer px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition">
                <Upload className="w-4 h-4 text-teal-400" /> Restaurar de Arquivo
                <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
              </label>
            </div>

            {backupStatus && (
              <p className="text-xs text-emerald-400 font-medium font-mono">{backupStatus}</p>
            )}
          </div>

          {/* Emergency Contacts */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-teal-400 font-semibold">
              <Shield className="w-4 h-4" />
              <span>Contatos de Emergência Pessoais</span>
            </div>
            <p className="text-xs text-slate-400">
              Esses contatos ficarão salvos localmente e estarão disponíveis para ligação instantânea na tela de crise/SOS.
            </p>

            {contacts.map((c, i) => (
              <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-200">{c.name} ({c.relationship})</p>
                  <p className="text-xs text-slate-400">{c.phone}</p>
                </div>
                <button
                  onClick={() => handleRemoveContact(i)}
                  className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Add contact form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              <input
                type="text"
                placeholder="Nome"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100"
              />
              <input
                type="text"
                placeholder="Telefone/WhatsApp"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Vínculo (Mãe, Amigo...)"
                  value={newContactRel}
                  onChange={(e) => setNewContactRel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100"
                />
                <button
                  onClick={handleAddContact}
                  className="px-3 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" /> Salvar Perfil
          </button>
        </div>

      </div>
    </div>
  );
};
