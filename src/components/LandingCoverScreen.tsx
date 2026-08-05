import React from "react";
import { Lock, LogIn, UserPlus, Heart, Shield, Sparkles, Brain, Stethoscope, Building2, GraduationCap, Users } from "lucide-react";

interface LandingCoverScreenProps {
  onOpenAuth: () => void;
  isDark?: boolean;
}

export const LandingCoverScreen: React.FC<LandingCoverScreenProps> = ({ onOpenAuth, isDark = true }) => {
  return (
    <div className={`min-h-screen flex flex-col justify-between p-4 sm:p-8 animate-fadeIn ${
      isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* Top Bar Logo */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <img 
            src="/neuroconecta_logo.svg" 
            alt="NeuroConecta Logo" 
            className="w-12 h-12 object-contain rounded-2xl p-1 bg-slate-900 border border-teal-700/80 shadow-lg"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-teal-200 via-emerald-300 to-cyan-200 bg-clip-text text-transparent">
              NeuroConecta
            </h1>
            <p className="text-[11px] font-semibold text-teal-400/90 tracking-wide">
              SISTEMASTOP • Conexões que acolhem, informam e transformam.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAuth}
          className="px-5 py-2.5 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-2xl font-extrabold text-xs sm:text-sm shadow-xl shadow-teal-900/30 flex items-center gap-2 transition active:scale-95"
        >
          <LogIn className="w-4 h-4" />
          <span>Entrar / Cadastrar</span>
        </button>
      </div>

      {/* Main Hero Card with Prominent Logo Visual */}
      <div className="max-w-4xl mx-auto w-full my-auto py-10 space-y-8 text-center">
        
        {/* Large Central Brand Logo Box */}
        <div className="relative inline-block group">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 opacity-30 blur-xl group-hover:opacity-50 transition duration-500"></div>
          <div className="relative p-6 sm:p-8 bg-slate-900/90 border border-teal-800/80 rounded-3xl shadow-2xl flex flex-col items-center justify-center gap-4 max-w-sm mx-auto">
            <img 
              src="/neuroconecta_logo.svg" 
              alt="NeuroConecta Capa Logo" 
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-2xl"
            />
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-800">
                Acesso Seguro & Proteção LGPD
              </span>
              <h2 className="text-xl font-black text-white">
                Plataforma Neuroafirmativa
              </h2>
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Seja bem-vindo ao NeuroConecta
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Plataforma integrada de suporte a pessoas neurodivergentes (TEA, TDAH, AH/SD), equipes de saúde CAPS, professores, gestores de RH e cuidadores.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onOpenAuth}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-teal-950/60 flex items-center justify-center gap-3 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <LogIn className="w-5 h-5 text-slate-950" />
            <span>Clique aqui para Acessar / Entrar</span>
          </button>
        </div>

        {/* Module Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 text-left">
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-teal-400 p-2 bg-teal-950/80 rounded-xl w-fit border border-teal-800/60">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-white">Assistente IA</h3>
            <p className="text-[11px] text-slate-400">Escuta empática e triagem neurodivergente.</p>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-emerald-400 p-2 bg-emerald-950/80 rounded-xl w-fit border border-emerald-800/60">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-white">Saúde CAPS</h3>
            <p className="text-[11px] text-slate-400">Prontuário multiprofissional e laudos.</p>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-amber-400 p-2 bg-amber-950/80 rounded-xl w-fit border border-amber-800/60">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-white">Educação</h3>
            <p className="text-[11px] text-slate-400">PEI e acomodações inclusivas escolares.</p>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-blue-400 p-2 bg-blue-950/80 rounded-xl w-fit border border-blue-800/60">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-white">Gestão RH</h3>
            <p className="text-[11px] text-slate-400">Pareceres corporativos e NR-1 PCD.</p>
          </div>
        </div>

      </div>

      {/* Footer Copyright */}
      <div className="max-w-6xl mx-auto w-full text-center py-4 border-t border-slate-800/60 text-xs text-slate-400">
        <p>© 2026 NeuroConecta • SISTEMASTOP. Todos os direitos reservados. Em conformidade com a LGPD e Lei Berenice Piana.</p>
      </div>

    </div>
  );
};
