import React, { useState } from "react";
import { ShieldAlert, Phone, Moon, VolumeX, MessageSquare, X, HeartHandshake, CheckCircle2 } from "lucide-react";
import { UserProfile } from "../types";

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  toggleLowStimMode: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  toggleLowStimMode,
}) => {
  const [activeTab, setActiveTab] = useState<"passos" | "fones" | "contatos" | "mensagem">("passos");
  const [step, setStep] = useState(1);
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!isOpen) return null;

  const defaultEmergencyMessage = `Olá. Eu sou ${userProfile.preferredName || "uma pessoa autista"} e estou passando por um momento de sobrecarga sensorial/meltdown no momento. Não consigo falar bem agora. Preciso de um ambiente silencioso, escuro e sem cobranças por alguns minutos. Agradeço sua compreensão.`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(defaultEmergencyMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 3000);
  };

  const handleWhatsAppAlert = () => {
    const encoded = encodeURIComponent(defaultEmergencyMessage);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Calmo */}
        <div className="bg-rose-950/70 border-b border-rose-800/50 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-900/60 text-rose-300 rounded-xl border border-rose-700/50">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-rose-100 flex items-center gap-2">
                Apoio em Crise & Sobrecarga
              </h2>
              <p className="text-xs text-rose-200/80">
                Respire fundo. Você está em um espaço seguro. Vamos reduzir os estímulos juntos.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action quick bar */}
        <div className="bg-slate-950 p-3 flex flex-wrap gap-2 border-b border-slate-800 justify-around text-xs sm:text-sm">
          <button
            onClick={toggleLowStimMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition ${
              userProfile.lowStimulationMode
                ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
            }`}
          >
            <Moon className="w-4 h-4" />
            {userProfile.lowStimulationMode ? "Modo Escuro Ativo" : "Escurecer Tela"}
          </button>

          <button
            onClick={() => setActiveTab("passos")}
            className={`px-3 py-1.5 rounded-lg border transition ${
              activeTab === "passos"
                ? "bg-teal-900 text-teal-200 border-teal-600"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
            }`}
          >
            🧘 Calma Passo a Passo
          </button>

          <button
            onClick={() => setActiveTab("contatos")}
            className={`px-3 py-1.5 rounded-lg border transition ${
              activeTab === "contatos"
                ? "bg-teal-900 text-teal-200 border-teal-600"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
            }`}
          >
            📞 Telefones de Apoio
          </button>

          <button
            onClick={() => setActiveTab("mensagem")}
            className={`px-3 py-1.5 rounded-lg border transition ${
              activeTab === "mensagem"
                ? "bg-teal-900 text-teal-200 border-teal-600"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
            }`}
          >
            💬 Enviar Alerta Rápido
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === "passos" && (
            <div className="space-y-6">
              <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700 space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold text-teal-400 uppercase tracking-wider">
                  <span>Passo {step} de 4</span>
                  <span>Guia de Acolhimento</span>
                </div>

                {step === 1 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-200 flex items-center gap-2">
                      <VolumeX className="w-5 h-5 text-teal-400" />
                      1. Reduza os estímulos imediatamente
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Se possível, vá para um ambiente mais calmo, feche os olhos ou coloque seus fones de ouvido. Se estiver em público, vire-se para o canto ou cubra os olhos delicadamente.
                    </p>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-200 flex items-center gap-2">
                      <HeartHandshake className="w-5 h-5 text-teal-400" />
                      2. Sem cobrança de fala ou explicação
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Você não precisa se explicar para ninguém agora. Não tente forçar conversa ou raciocínios complexos. Permita que seu cérebro desacelere.
                    </p>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-200">
                      3. Pressão profunda & Stimming liberado
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Aperte os braços ao redor do peito (auto-abraço firme), use um cobertor pesado se tiver, ou faça pequenos movimentos de balanço. O stimming ajuda seu corpo a liberar o excesso de energia sensorial.
                    </p>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-teal-200">
                      4. Lembrete: Isso vai passar
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      A crise de sobrecarga (meltdown/shutdown) é uma resposta física do seu sistema nervoso, não um fracasso seu. Dê a si mesmo o tempo necessário para recuperar o equilíbrio.
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-slate-700/60">
                  <button
                    disabled={step === 1}
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 disabled:opacity-40 rounded-lg text-slate-200 transition"
                  >
                    Anterior
                  </button>
                  <button
                    disabled={step === 4}
                    onClick={() => setStep(step + 1)}
                    className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-500 disabled:opacity-40 rounded-lg text-white transition font-medium"
                  >
                    Próximo Passo
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "contatos" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-200">Linhas de Emergência e Apoio (Gratuitas)</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="tel:188"
                  className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-950 text-emerald-400 rounded-lg">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100 group-hover:text-emerald-300">CVV - Apoio Emocional</h4>
                      <p className="text-xs text-slate-400">Atendimento 24h gratuito</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-emerald-400">188</span>
                </a>

                <a
                  href="tel:192"
                  className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-950 text-rose-400 rounded-lg">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100 group-hover:text-rose-300">SAMU - Emergência</h4>
                      <p className="text-xs text-slate-400">Socorro médico urgente</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-rose-400">192</span>
                </a>
              </div>

              {/* Contatos Pessoais */}
              <div className="pt-3 border-t border-slate-800">
                <h4 className="text-sm font-semibold text-slate-300 mb-2">Seus Contatos de Apoio Salvos:</h4>
                {userProfile.emergencyContacts && userProfile.emergencyContacts.length > 0 ? (
                  <div className="space-y-2">
                    {userProfile.emergencyContacts.map((c, idx) => (
                      <div key={idx} className="p-3 bg-slate-800/60 border border-slate-700 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-200 text-sm">{c.name} ({c.relationship})</p>
                          <p className="text-xs text-slate-400">{c.phone}</p>
                        </div>
                        <a
                          href={`tel:${c.phone}`}
                          className="px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-xs text-white rounded-md flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" /> Ligar
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Nenhum contato pessoal cadastrado ainda. Você pode adicionar seus familiares/amigos no menu do perfil no topo do app.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "mensagem" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-200">Mensagem Pronta de Pedido de Apoio</h3>
              <p className="text-xs text-slate-300">
                Você pode copiar ou enviar diretamente pelo WhatsApp para um familiar, amigo ou colega sem precisar digitar durante a crise:
              </p>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 leading-relaxed font-mono relative">
                {defaultEmergencyMessage}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCopyMessage}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs sm:text-sm font-medium border border-slate-700 flex items-center gap-2 transition"
                >
                  {copiedMessage ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <MessageSquare className="w-4 h-4" />}
                  {copiedMessage ? "Copiado com sucesso!" : "Copiar Texto"}
                </button>

                <button
                  onClick={handleWhatsAppAlert}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  Enviar via WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition"
          >
            Concluir / Voltar
          </button>
        </div>

      </div>
    </div>
  );
};
