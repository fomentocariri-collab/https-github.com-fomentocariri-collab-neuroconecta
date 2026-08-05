import React from "react";
import { Eye, EyeOff, ShieldCheck, X, Check, Lock, Sparkles } from "lucide-react";
import { NavTab } from "./Navbar";

interface SuperAdminModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  hiddenModules: string[];
  onToggleModule: (tabId: string) => void;
  onResetAll: () => void;
}

export const MODULE_DEFINITIONS: { id: NavTab; label: string; desc: string; category: string }[] = [
  { id: "chat", label: "Assistente IA Neuroafirmativo", desc: "Triagem com IA, escuta empática e tira-dúvidas", category: "Geral" },
  { id: "musicoterapia", label: "Musicoterapia & Frequências", desc: "Gerador binaural de ondas Alpha/Theta e som 432Hz", category: "Sensorial" },
  { id: "jogos", label: "Jogos Neurocognitivos & Relaxamento", desc: "Estímulos visuais, memória e desaceleração", category: "Sensorial" },
  { id: "rotina", label: "Rotina Visual Interativa", desc: "Quadros de apoio visual e transição de tarefas", category: "Organização" },
  { id: "agenda", label: "Agenda & Medicamentos", desc: "Lembretes de farmácia e compromissos", category: "Organização" },
  { id: "sensorial", label: "Manejo e Regulação Sensorial", desc: "Diagnóstico de gatilhos visuais, auditivos e táteis", category: "Sensorial" },
  { id: "humor", label: "Diário de Humor & Energia", desc: "Rastreio de bateria social e sintomas", category: "Bem-estar" },
  { id: "comunicacao", label: "Comunicação Aumentativa (AAC)", desc: "Pranchas de comunicação por pictogramas", category: "Acessibilidade" },
  { id: "testes", label: "Escalas de Autoavaliação", desc: "AQ-10, ASRS-18, M-CHAT e CAT-Q Masking", category: "Avaliação" },
  { id: "cuidador", label: "Apoio a Cuidadores & Família", desc: "Orientações de suporte e manejo doméstico", category: "Acompanhamento" },
  { id: "caps", label: "Módulo Clínico / CAPS", desc: "Prontuário multiprofissional e desescalada", category: "Clínico" },
  { id: "relatorio", label: "Relatórios & Laudos Periciais", desc: "Emissão de laudos para INSS/BPC/Escola", category: "Documentos" },
  { id: "rh", label: "Gestão de RH & Cota PCD (NR-1)", desc: "Mapeamento de riscos psicossociais e vaga PCD", category: "Corporativo" },
  { id: "educacao", label: "Biblioteca & Educação Inclusiva", desc: "Guias escolares e plano de ensino", category: "Educação" },
  { id: "supabase", label: "Banco de Dados Supabase", desc: "Sincronização em nuvem para administrador", category: "Técnico" },
];

export const SuperAdminModuleModal: React.FC<SuperAdminModuleModalProps> = ({
  isOpen,
  onClose,
  hiddenModules,
  onToggleModule,
  onResetAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-800/80 text-slate-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-cyan-950 to-slate-950 border-b border-cyan-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-950 border border-cyan-700/80 text-cyan-300 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/60">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Superadmin • Controle de Visibilidade</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-white">
                Ocultar / Exibir Módulos
              </h2>
              <p className="text-xs text-cyan-200/80">
                Torne módulos visíveis ou invisíveis para os demais usuários do sistema.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs">
            <span className="text-slate-300">
              <strong className="text-cyan-400">{hiddenModules.length}</strong> de {MODULE_DEFINITIONS.length} módulo(s) invisível(is) para usuários comuns.
            </span>
            {hiddenModules.length > 0 && (
              <button
                onClick={onResetAll}
                className="text-[11px] text-cyan-400 hover:underline font-bold"
              >
                Tornar Todos Visíveis
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MODULE_DEFINITIONS.map((m) => {
              const isHidden = hiddenModules.includes(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() => onToggleModule(m.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isHidden
                      ? "bg-slate-950/90 border-slate-800/90 opacity-70 hover:opacity-100"
                      : "bg-slate-800/50 border-cyan-900/50 hover:border-cyan-700"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{m.label}</span>
                      <span className="text-[9px] px-2 py-0.2 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                        {m.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">{m.desc}</p>
                  </div>

                  <button
                    type="button"
                    className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                      isHidden
                        ? "bg-rose-950/80 border-rose-800 text-rose-300"
                        : "bg-emerald-950/80 border-emerald-800 text-emerald-300"
                    }`}
                  >
                    {isHidden ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        <span className="text-[10px]">Oculto</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        <span className="text-[10px]">Visível</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <p className="text-slate-400">
            As alterações são salvas automaticamente na sessão do sistema.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg transition"
          >
            Concluir & Aplicar
          </button>
        </div>

      </div>
    </div>
  );
};
