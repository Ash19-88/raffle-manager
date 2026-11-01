"use client";

import { LuAward } from "react-icons/lu";


interface Ganador {
  premio: number;
  numero: number;
  comprador: string;
  vendedor: string;
  curso: string;
  estado: "GANADOR" | "VACANTE";
}

const GANADORES_OFICIALES: Ganador[] = [
  { premio: 1, numero: 530, comprador: "Gilda Manzone", vendedor: "SUAREZ, Jerónimo", curso: "5to 1era", estado: "GANADOR" },
  { premio: 2, numero: 0, comprador: "Tomás Alexandre", vendedor: "ABIERI, Gianfranco", curso: "5to 1era", estado: "GANADOR" },
  { premio: 3, numero: 224, comprador: "Vacante (Pasa al 6to)", vendedor: "-", curso: "-", estado: "VACANTE" },
  { premio: 4, numero: 598, comprador: "Juan Villan", vendedor: "PETRONE, Catalina", curso: "5to 1era", estado: "GANADOR" },
  { premio: 5, numero: 315, comprador: "Juan Pablo Diaz", vendedor: "DIAZ DENIS, Lourdes", curso: "5to 1era", estado: "GANADOR" },
  { premio: 6, numero: 409, comprador: "Vacante (Pasa al 7mo)", vendedor: "-", curso: "-", estado: "VACANTE" },
  { premio: 7, numero: 174, comprador: "Gustavo Patrone", vendedor: "BASILE, Maximo", curso: "5to 1era", estado: "GANADOR" },
];

export default function WinningNumbersBanner() {
  return (
    <div className="bg-linear-to-r from-[#800020] to-[#5C0017] text-white p-6 rounded-3xl shadow-xl border-2 border-[#D4A373] space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#D4A373] text-[#800020] rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md">
          <LuAward />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider">
            ¡Resultados Oficiales del Sorteo!
          </h2>
          <p className="text-xs text-[#EFE6DD] font-medium">
            Listado completo de premios, ganadores y estudiantes vendedores
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
        {GANADORES_OFICIALES.map((g) => (
          <div
            key={g.premio}
            className={`p-4 rounded-2xl border transition-all ${
              g.estado === "VACANTE"
                ? "bg-amber-900/30 border-amber-500/40 text-amber-200"
                : "bg-white/10 border-white/20 text-white backdrop-blur-xs"
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4A373]">
                Premio #{g.premio}
              </span>
              <span className="text-lg font-black bg-black/30 px-2.5 py-0.5 rounded-lg">
                #{String(g.numero).padStart(4, '0')}
              </span>
            </div>
            {g.estado === "GANADOR" ? (
              <div className="space-y-1 mt-2 text-xs">
                <p className="font-semibold text-stone-200">
                  Comprador: <span className="text-white font-bold">{g.comprador}</span>
                </p>
                <p className="font-semibold text-stone-200">
                  Vendedor/a: <span className="text-[#F5EFEB] font-extrabold">{g.vendedor}</span>
                </p>
              </div>
            ) : (
              <p className="text-xs font-bold text-amber-300 mt-2 italic">
                {g.comprador}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}