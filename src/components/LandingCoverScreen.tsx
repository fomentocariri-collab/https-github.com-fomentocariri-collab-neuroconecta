import React from "react";
import { Lock, LogIn, UserPlus, Heart, Shield, Sparkles, Brain, Stethoscope, Building2, GraduationCap, Users } from "lucide-react";

interface LandingCoverScreenProps {
  onOpenAuth: () => void;
  isDark?: boolean;
}

export const LandingCoverScreen: React.FC<LandingCoverScreenProps> = ({ onOpenAuth, isDark = false }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-8 animate-fadeIn bg-slate-50 text-slate-900">
      
      {/* Top Bar Logo */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white border border-teal-200 rounded-2xl shadow-md">
            <img 
              src="/neuroconecta_logo.svg" 
              alt="NeuroConecta Logo" 
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-teal-900">
              NeuroConecta
            </h1>
            <p className="text-[11px] font-extrabold text-teal-700 tracking-wide">
              SISTEMASTOP • Conexões que acolhem, informam e transformam.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAuth}
          className="px-5 py-2.5 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-2xl font-extrabold text-xs sm:text-sm shadow-lg shadow-teal-700/20 flex items-center gap-2 transition active:scale-95"
        >
          <LogIn className="w-4 h-4" />
          <span>Entrar / Cadastrar</span>
        </button>
      </div>

      {/* Main Hero Card with Prominent Logo Visual on Pure White Box */}
      <div className="max-w-4xl mx-auto w-full my-auto py-8 sm:py-12 space-y-8 text-center">
        
        {/* Large Central Brand Logo Box - PURE WHITE BACKGROUND FOR MAXIMUM LOGO VISIBILITY */}
        <div className="relative inline-block group">
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 opacity-20 blur-xl group-hover:opacity-40 transition duration-500"></div>
          <div className="relative p-6 sm:p-10 bg-white border-2 border-teal-200/90 rounded-3xl shadow-2xl flex flex-col items-center justify-center gap-5 max-w-md mx-auto">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl w-full flex items-center justify-center">
              <img 
                src="/neuroconecta_logo.svg" 
                alt="NeuroConecta Capa Logo" 
                className="w-48 h-48 sm:w-60 sm:h-60 object-contain drop-shadow-md"
              />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-black tracking-widest text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Acesso Seguro & Proteção LGPD
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                Plataforma Neuroafirmativa
              </h2>
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
            Seja bem-vindo ao NeuroConecta
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Plataforma integrada de suporte a pessoas neurodivergentes (TEA, TDAH, AH/SD), equipes de saúde CAPS, professores, gestores de RH e cuidadores.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onOpenAuth}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-black text-base rounded-2xl shadow-xl shadow-teal-700/30 flex items-center justify-center gap-3 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <LogIn className="w-5 h-5 text-white" />
            <span>Clique aqui para Acessar / Entrar</span>
          </button>
        </div>

        {/* Module Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 text-left">
          <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1.5 shadow-sm hover:shadow-md transition">
            <div className="text-teal-700 p-2 bg-teal-50 rounded-xl w-fit border border-teal-200">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-extrabold text-slate-900">Assistente IA</h3>
            <p className="text-[11px] text-slate-500 font-medium">Escuta empática e triagem neurodivergente.</p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1.5 shadow-sm hover:shadow-md transition">
            <div className="text-emerald-700 p-2 bg-emerald-50 rounded-xl w-fit border border-emerald-200">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-extrabold text-slate-900">Saúde CAPS</h3>
            <p className="text-[11px] text-slate-500 font-medium">Prontuário multiprofissional e laudos.</p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1.5 shadow-sm hover:shadow-md transition">
            <div className="text-amber-700 p-2 bg-amber-50 rounded-xl w-fit border border-amber-200">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-extrabold text-slate-900">Educação</h3>
            <p className="text-[11px] text-slate-500 font-medium">PEI e acomodações inclusivas escolares.</p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1.5 shadow-sm hover:shadow-md transition">
            <div className="text-cyan-700 p-2 bg-cyan-50 rounded-xl w-fit border border-cyan-200">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-extrabold text-slate-900">Gestão RH</h3>
            <p className="text-[11px] text-slate-500 font-medium">Pareceres corporativos e NR-1 PCD.</p>
          </div>
        </div>

      </div>

      {/* Footer Copyright */}
      <div className="max-w-6xl mx-auto w-full text-center py-4 border-t border-slate-200 text-xs text-slate-500 font-medium">
        <p>© 2026 NeuroConecta • SISTEMASTOP. Todos os direitos reservados. Em conformidade com a LGPD e Lei Berenice Piana.</p>
      </div>

    </div>
  );
};
