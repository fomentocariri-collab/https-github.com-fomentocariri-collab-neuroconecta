import React, { useState } from "react";
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  BookOpen, 
  BarChart3, 
  ShieldCheck, 
  Brain, 
  Award, 
  Sparkles,
  Layers,
  ChevronRight,
  School,
  Building2,
  Stethoscope
} from "lucide-react";
import neuroconectaLogo from "../assets/logo";

export const AcademicReviewModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"resumo" | "artigo_completo">("artigo_completo");

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-teal-700/80 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto text-slate-100">
        
        {/* Header (No print) */}
        <div className="no-print p-4 sm:p-6 bg-gradient-to-r from-slate-950 via-teal-950 to-slate-950 border-b border-teal-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-900/60 border border-teal-600/60 rounded-2xl text-teal-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-teal-900/80 text-teal-300 rounded-full border border-teal-700">
                  Estudo de Caso & Artigo Técnico
                </span>
                <span className="text-[10px] text-teal-400 font-mono">PDF Pronto</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Resenha Acadêmica & Estudo de Caso NeuroConecta
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar em PDF</span>
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
            >
              Fechar
            </button>
          </div>
        </div>

        {/* Scrollable Printable Article Content */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 bg-slate-950 print:bg-white print:text-black print:p-8 print:overflow-visible">
          
          {/* Printable Document Header (Formatted for A4 PDF print) */}
          <div className="border-b-2 border-teal-800/80 print:border-slate-800 pb-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={neuroconectaLogo}
                  alt="NeuroConecta Logo"
                  className="w-16 h-16 object-contain rounded-xl p-1 bg-white border border-teal-800"
                />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white print:text-slate-900">
                    NEUROCONECTA
                  </h1>
                  <p className="text-xs text-teal-400 print:text-teal-800 font-bold uppercase tracking-wider">
                    Plataforma Integrada de Tecnologia Assistiva & Saúde Digital
                  </p>
                  <p className="text-[11px] text-slate-400 print:text-slate-600">
                    SISTEMASTOP Soluções Tecnológicas & Fomento Cariri
                  </p>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-400 print:text-slate-600 space-y-0.5">
                <p className="font-bold text-teal-300 print:text-teal-900">DOCUMENTO TÉCNICO-CIENTÍFICO</p>
                <p>Natureza: Estudo de Caso por Amostragem</p>
                <p>Data: {new Date().toLocaleDateString("pt-BR")}</p>
                <p>Local: Crato - CE, Brasil</p>
              </div>
            </div>

            <div className="p-4 bg-teal-950/60 print:bg-slate-100 border border-teal-800/80 print:border-slate-300 rounded-2xl">
              <h2 className="text-sm sm:text-base font-bold text-teal-200 print:text-slate-900 leading-snug">
                NeuroConecta: Plataforma Integrada de Tecnologia Assistiva, Rastreio Neurodivergente e Suporte Multidisciplinar para Indivíduos no Espectro Autista e TDAH
              </h2>
            </div>
          </div>

          {/* 1. Resumo Executivo */}
          <section className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-teal-400 print:text-teal-900 flex items-center gap-2 border-b border-slate-800 print:border-slate-300 pb-1">
              <span className="p-1 bg-teal-950 print:bg-slate-200 rounded">1</span>
              <span>Resumo Executivo & Definição do Sistema</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 print:text-slate-800 leading-relaxed text-justify">
              O <strong>NeuroConecta</strong> é um ecossistema digital de Tecnologia Assistiva (TA) e Saúde Digital (<em>Digital Health</em>), desenvolvido com a finalidade de centralizar ferramentas de autorregulação sensorial, rastreio psicométrico, comunicação aumentativa e alternativa (CAA), planejamento de rotinas visuais e gestão clínica multiprofissional (educacional, ambulatorial/CAPS e corporativa/NR-1).
            </p>
            <p className="text-xs sm:text-sm text-slate-300 print:text-slate-800 leading-relaxed text-justify">
              A plataforma foi concebida sob o paradigma da neurodiversidade e os princípios do Design Universal, oferecendo interface adaptável (modo de baixo estímulo sensorial, paleta sem saturação excessiva e tipografia acessível) e arquitetura com isolamento de dados em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </section>

          {/* 2. Objetivos */}
          <section className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-teal-400 print:text-teal-900 flex items-center gap-2 border-b border-slate-800 print:border-slate-300 pb-1">
              <span className="p-1 bg-teal-950 print:bg-slate-200 rounded">2</span>
              <span>Objetivos do Projeto</span>
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-slate-300 print:text-slate-800 leading-relaxed">
              <p><strong>2.1. Objetivo Geral:</strong> Promover a autonomia, inclusão social e o monitoramento longitudinal de indivíduos com Transtorno do Espectro Autista (TEA), TDAH e outras neurodivergências, integrando em um único ambiente o próprio usuário, familiares/cuidadores, educadores e equipes de saúde mental.</p>
              <p><strong>2.2. Objetivos Específicos:</strong></p>
              <ul className="list-disc pl-5 space-y-1 text-slate-300 print:text-slate-700 text-xs sm:text-sm">
                <li><strong>Instrumentalização Psicométrica:</strong> Disponibilizar inventários validados (RAADS-14/80, AQ-10, ASRS-18, CAT-Q) para autoavaliação e pré-triagem não invasiva.</li>
                <li><strong>Autorregulação e Redução de Sobrecarga:</strong> Fornecer módulos de estimulação auditiva binaural, musicoterapia, regulação sensorial e descompressão cognitiva.</li>
                <li><strong>Ponte Clínica Intersetorial:</strong> Integrar o Plano Educacional Individualizado (PEI) escolar, o Plano Terapêutico Singular (PTS) da Rede CAPS e a avaliação de riscos psicossociais no trabalho (NR-1).</li>
                <li><strong>Interoperabilidade:</strong> Viabilizar sincronização segura com relatórios clínicos formatados para perícias e laudos multidisciplinares.</li>
              </ul>
            </div>
          </section>

          {/* 3. Metodologia e Resultados Amostrais RAADS */}
          <section className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-teal-400 print:text-teal-900 flex items-center gap-2 border-b border-slate-800 print:border-slate-300 pb-1">
              <span className="p-1 bg-teal-950 print:bg-slate-200 rounded">3</span>
              <span>Metodologia & Resultados do Estudo de Caso por Amostragem</span>
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-300 print:text-slate-800 leading-relaxed text-justify">
              O estudo de caso em andamento fundamenta-se na coleta empírica de dados a partir da introdução assistida da plataforma em uma amostra de usuários voluntários (indivíduos com suspeita clínica ou diagnóstico formal de TEA/TDAH, cuidadores e profissionais de saúde).
            </p>

            {/* Destaque dos Indicadores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
              <div className="p-4 bg-teal-950/80 print:bg-slate-100 border border-teal-700/80 print:border-slate-400 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-300 print:text-teal-900 uppercase">Prevalência no Rastreio RAADS</span>
                  <span className="px-2 py-0.5 bg-teal-900 text-teal-200 text-xs font-extrabold rounded-lg">64%</span>
                </div>
                <p className="text-2xl font-black text-white print:text-slate-900">Escore Médio &gt; 24 pts</p>
                <p className="text-[11px] text-slate-300 print:text-slate-600">
                  Na bateria de 30 questões do inventário de rastreio de traços autistas.
                </p>
              </div>

              <div className="p-4 bg-slate-900 print:bg-slate-100 border border-slate-700 print:border-slate-400 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 print:text-emerald-900 uppercase">Usabilidade Subjetiva</span>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 text-xs font-extrabold rounded-lg">Alta Aceitação</span>
                </div>
                <p className="text-2xl font-black text-white print:text-slate-900">Facilidade de Uso</p>
                <p className="text-[11px] text-slate-300 print:text-slate-600">
                  Relatos consistentes de baixa fricção cognitiva e interface acolhedora.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-300 print:text-slate-800 leading-relaxed text-justify">
              <p>
                <strong>Discussão Clínica dos Resultados:</strong> Na literatura de rastreio psicométrico em neurodivergência, escores consolidados acima da linha de corte (&gt; 24 pontos) indicam forte presença de traços fenotípicos do espectro autista nas dimensões de comunicação social, sensibilidade sensorial e rigidez cognitiva. O resultado amostral valida a alta sensibilidade do NeuroConecta como ferramenta preliminar de triagem para fundamentar encaminhamentos ao diagnóstico clínico formal.
              </p>
            </div>
          </section>

          {/* 4. Estrutura Modular */}
          <section className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-teal-400 print:text-teal-900 flex items-center gap-2 border-b border-slate-800 print:border-slate-300 pb-1">
              <span className="p-1 bg-teal-950 print:bg-slate-200 rounded">4</span>
              <span>Arquitetura Modular Integrada</span>
            </h3>

            <div className="border border-slate-800 print:border-slate-300 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-900 print:bg-slate-200 text-slate-200 print:text-slate-900 font-bold">
                  <tr>
                    <th className="p-2.5 border-b border-slate-800 print:border-slate-300">Módulo Funcional</th>
                    <th className="p-2.5 border-b border-slate-800 print:border-slate-300">Finalidade Técnico-Científica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 print:divide-slate-300 text-slate-300 print:text-slate-700">
                  <tr>
                    <td className="p-2.5 font-bold text-teal-300 print:text-slate-900">TestCenter Psicométrico</td>
                    <td className="p-2.5">Inventários validados (RAADS, ASRS, CAT-Q de camuflagem social) com escores dimensionais.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-teal-300 print:text-slate-900">Musicoterapia & Sensorial</td>
                    <td className="p-2.5">Estimulação auditiva binaural (Solfeggio), ruídos coloridos e exercícios de descompressão.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-teal-300 print:text-slate-900">Comunicação Aumentativa (CAA)</td>
                    <td className="p-2.5">Pranchas visuais com síntese de voz (TTS) para auxílio à comunicação funcional.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-teal-300 print:text-slate-900">Rotina & Agenda Visual</td>
                    <td className="p-2.5">Sequenciamento visual de tarefas estruturadas com temporizadores e rastreio de medicação.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-teal-300 print:text-slate-900">Saúde CAPS & PEI Escolar</td>
                    <td className="p-2.5">Prontuário multiprofissional, acompanhamento pedagógico e avaliação de riscos NR-1.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. Considerações Finais */}
          <section className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-teal-400 print:text-teal-900 flex items-center gap-2 border-b border-slate-800 print:border-slate-300 pb-1">
              <span className="p-1 bg-teal-950 print:bg-slate-200 rounded">5</span>
              <span>Considerações Finais</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 print:text-slate-800 leading-relaxed text-justify">
              Os achados empíricos comprovam que o <strong>NeuroConecta</strong> cumpre com rigor seu papel como mediador tecnológico, reduzindo barreiras de acesso a ferramentas de suporte diário e instrumentalizando diagnósticos precoces. A correlação de 64% da amostra com escore indicativo no RAADS (&gt; 24 pontos) aliada à excelente avaliação de usabilidade consolida a plataforma como um estudo de caso bem-sucedido na interseção entre Ciência da Computação, Psicologia e Educação Inclusiva.
            </p>
          </section>

          {/* Footer of the Printable Document */}
          <div className="pt-6 border-t border-slate-800 print:border-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-400 print:text-slate-600">
            <div>
              <p className="font-bold text-slate-200 print:text-slate-800">SISTEMASTOP Soluções Tecnológicas & Fomento Cariri</p>
              <p>Rua Doutor Rolim, 366 - Bairro Independência, Crato - CE | +55 (88) 99673-9128</p>
            </div>
            <div className="text-right">
              <p>Validação Técnica &bull; NeuroConecta Digital Health</p>
              <p>Código do Relatório: NC-EST-2026-RAADS64</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
