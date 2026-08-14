'use client';

import { useState } from 'react';
import { FiSearch, FiXCircle, FiCheck, FiX, FiLayers } from 'react-icons/fi';

interface Props {
  numerosVendidos: Set<number>;
  totalNumeros?: number;
}

export default function ChartNumbers({ numerosVendidos, totalNumeros = 721 }: Props) {
  const [busqueda, setBusqueda] = useState('');

  const numeros = Array.from({ length: totalNumeros }, (_, i) => i);

  const numerosFiltrados = busqueda
    ? numeros.filter((num) => num.toString().includes(busqueda.trim()))
    : numeros;

  const totalVendidos = numerosVendidos.size;
  const totalDisponibles = totalNumeros - totalVendidos;

  return (
    <div className="space-y-5">
      {/* Resumen de Estado */}
      <div className="grid grid-cols-3 gap-3">

        <div className="bg-emerald-50/60 p-3 sm:p-4 rounded-2xl border border-emerald-200/60 text-center shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-emerald-800 text-xs font-bold uppercase mb-1">
            <FiCheck />
            <span>Disponibles</span>
          </div>
          <span className="block text-xl sm:text-2xl font-black text-emerald-900">{totalDisponibles}</span>
        </div>

        <div className="bg-[#800020]/10 p-3 sm:p-4 rounded-2xl border border-[#800020]/20 text-center shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-[#800020] text-xs font-bold uppercase mb-1">
            <FiX />
            <span>Vendidos</span>
          </div>
          <span className="block text-xl sm:text-2xl font-black text-[#800020]">{totalVendidos}</span>
        </div>
        <div className="bg-[#F5EFEB] p-3 sm:p-4 rounded-2xl border border-[#EFE6DD] text-center shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-[#800020] text-xs font-bold uppercase mb-1">
            <FiLayers />
            <span className="hidden sm:inline">Total Rifas</span>
            <span className="sm:hidden">Total</span>
          </div>
          <span className="block text-xl sm:text-2xl font-black text-[#2D1A17]">{totalNumeros}</span>
        </div>
      </div>

      {/* Buscador de Número y Leyendas */}
      <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#EFE6DD] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Input con icono de búsqueda */}
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#800020]/60 text-base" />
          <input
            type="number"
            placeholder="Buscar número (ej: 42)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#EFE6DD] rounded-xl text-sm text-[#2D1A17] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent transition-all font-medium"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#800020] transition-colors"
              title="Limpiar búsqueda"
            >
              <FiXCircle className="text-base" />
            </button>
          )}
        </div>

        {/* Indicadores de Estado */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-emerald-100 border border-emerald-300 shadow-xs"></span>
            <span className="text-[#2D1A17]">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-md bg-[#800020] border border-[#5C0017] shadow-xs"></span>
            <span className="text-[#2D1A17]">Vendido</span>
          </div>
        </div>
      </div>

      {/* Grilla de Números */}
      <div className="bg-white p-3 sm:p-5 rounded-2xl border border-[#EFE6DD] shadow-sm">
        {numerosFiltrados.length === 0 ? (
          <div className="text-center text-stone-500 py-12 text-sm flex flex-col items-center gap-2">
            <FiSearch className="text-2xl text-[#800020]/40" />
            <p>
              No se encontró el número <strong className="text-[#800020]">#{busqueda}</strong>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 gap-2 max-h-[55vh] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-stone-300">
            {numerosFiltrados.map((num) => {
              const estaVendido = numerosVendidos.has(num);
              return (
                <div
                  key={num}
                  className={`flex items-center justify-center py-2 px-1 rounded-xl text-xs font-black transition-all select-none ${
                    estaVendido
                      ? 'bg-[#800020] text-[#FDFBF7] shadow-xs cursor-not-allowed opacity-90'
                      : 'bg-emerald-50/80 text-emerald-900 border border-emerald-200/80 hover:bg-emerald-100 hover:scale-105 cursor-default'
                  }`}
                  title={estaVendido ? `Número #${num} - Vendido` : `Número #${num} - Disponible`}
                >
                  {num}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}