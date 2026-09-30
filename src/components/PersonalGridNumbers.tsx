import React from "react";
import { FiX, FiCheckCircle } from "react-icons/fi";

interface NumerosGridProps {
  nombreCompleto: string;
  curso: string;
  numeroDesde: number;
  numeroHasta: number;
  numerosVendidos: number[];
}

export default function PersonalGridNumbers({
  numeroDesde,
  numeroHasta,
  numerosVendidos,
}: NumerosGridProps) {
  // array de números asignados
  const numeros = Array.from(
    { length: numeroHasta - numeroDesde + 1 },
    (_, i) => numeroDesde + i
  );

  const totalVendidos = numerosVendidos.length;
  const totalAsignados = numeros.length;
  const vendidosSet = new Set(numerosVendidos);

  return (
    <div className="bg-linear-to-b from-white to-[#FAF6F0] border-2 border-[#800020]/20 rounded-3xl p-5 shadow-lg max-w-md mx-auto">
      {/* Encabezado */}
      <div className="text-center pb-4 border-b border-[#EFE8DC]">
        <h1 className="text-xl font-extrabold uppercase tracking-widest text-[#800020] bg-[#800020]/10 px-3 py-1 rounded-full">
          Rifa Día de la Madre
        </h1>

        {/* Progreso */}
        <div className="mt-3 inline-flex items-center gap-2 bg-white border border-[#EFE8DC] px-3 py-1.5 rounded-xl shadow-xs">
          <span className="text-sm font-bold text-[#3A2D28]">
            Vendidos: <span className="text-[#800020]">{totalVendidos}</span> / {totalAsignados}
          </span>
          {totalVendidos === totalAsignados && (
            <span className="text-xs text-green-600 font-bold flex items-center gap-1">
              <FiCheckCircle className="w-3.5 h-3.5" /> ¡Agotado!
            </span>
          )}
        </div>
      </div>


      {/* Grilla de Números */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 pt-1">
        {numeros.map((num) => {
          const estaVendido = vendidosSet.has(num);

          return (
            <div
              key={num}
              className={`relative aspect-square rounded-2xl flex items-center justify-center font-black text-2xl sm:text-xl transition-all border ${
                estaVendido
                  ? "bg-red-50/80 border-red-200 text-red-300 select-none"
                  : "bg-white border-[#800020]/30 text-[#800020] shadow-sm hover:border-[#800020]"
              }`}
            >
              <span className={estaVendido ? "line-through opacity-50" : ""}>
                {num}
              </span>

              {/* Cruz Roja / Marca de Vendido */}
              {estaVendido && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 rounded-2xl">
                  <FiX className="w-12 h-12 text-red-400 stroke-3" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}