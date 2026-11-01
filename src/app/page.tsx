"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ChartNumbers from "@/components/ChartNumbers";
import WinningNumbersBanner from "@/components/WinningNumbersBanner";
import Footer from "@/components/Footer";
import {
  FiUser,
  FiPieChart,
  FiCheckCircle,
  FiLoader,
  FiLock,
} from "react-icons/fi";
import { LuTicket } from "react-icons/lu";

interface UserSession {
  nombre_completo: string;
}

export default function HomePage() {
  const [vendidos, setVendidos] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<UserSession | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const TOTAL_NUMEROS = 1000;

  useEffect(() => {
    // 1. Cargar datos de la grilla pública (sigue mostrando los números vendidos en tiempo real)
    fetch("/api/rifas/publicas")
      .then((res) => res.json())
      .then((data) => {
        if (data.vendidos) {
          setVendidos(new Set(data.vendidos));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // 2. Verificar si hay una sesión activa
    fetch("/api/rifas/mis-ventas")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.session) {
          setSession(data.session);
        }
      })
      .catch(() => {})
      .finally(() => setCheckingAuth(false));
  }, []);

  const totalVendidos = vendidos.size;
  const totalDisponibles = TOTAL_NUMEROS - totalVendidos;
  const porcentajeVendido =
    Math.round((totalVendidos / TOTAL_NUMEROS) * 100) || 0;

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#2D1A17] flex flex-col">
      <nav className="bg-[#800020] text-[#FDFBF7] shadow-lg border-b-4 border-[#D4A373]">
        <div className="max-w-5xl mx-auto px-4 py-4 space-y-4 sm:space-y-0 sm:py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#FDFBF7] text-[#800020] flex items-center justify-center text-xl sm:text-2xl shadow-inner font-bold">
              <LuTicket />
            </div>
            <div>
              <h1 className="text-md sm:text-lg md:text-2xl font-black tracking-tight leading-tight">
                Rifa Egresados
              </h1>
              <p className="text-xs sm:text-sm text-[#EFE6DD] font-medium">
                Tablero de números en tiempo real
              </p>
            </div>
          </div>

          {/* Renderizado dinámico según el estado de la verificación */}
          {checkingAuth ? (
            <div className="flex items-center gap-2 bg-[#FDFBF7]/10 text-[#FDFBF7] text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl">
              <FiLoader className="animate-spin text-base" />
              <span>Verificando...</span>
            </div>
          ) : session ? (
            <Link
              href="/my-panel"
              className="flex items-center gap-2.5 bg-[#FDFBF7] hover:bg-[#F5EFEB] text-[#800020] text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl shadow-md transition-all border border-[#EFE6DD] hover:scale-105 active:scale-95"
            >
              <span className="w-6 h-6 rounded-full bg-[#800020] text-[#FDFBF7] flex items-center justify-center text-xs font-black uppercase">
                {session.nombre_completo.charAt(0)}
              </span>
              <span>Mi Panel</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 bg-[#FDFBF7] hover:bg-[#F5EFEB] text-[#800020] text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-all border border-[#EFE6DD] hover:scale-105 active:scale-95"
            >
              <FiUser className="text-base" />
              <span>Ingreso Egresados</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Contenido Principal */}
      <section className="max-w-5xl mx-auto w-full px-4 py-6 sm:py-8 flex-1 flex flex-col gap-6">
        
        {/* Banner con los ganadores oficiales del sorteo */}
        <WinningNumbersBanner />

        {/* BANNER DE CIERRE DE CARGA (Reutilizando la estructura anterior) */}
        <div className="bg-white border border-[#EFE6DD] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#800020]/10 text-[#800020] flex items-center justify-center shrink-0">
              <FiLock className="text-xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#800020] uppercase tracking-wider">
                Estado del Sorteo
              </p>
              <p className="text-sm font-semibold text-[#3A2D28]">
                El sorteo se realizó por{" "}
                <strong className="font-bold text-[#800020]">
                  Lotería Nacional Nocturna
                </strong>
                . La carga de números se encuentra cerrada.
              </p>
            </div>
          </div>

          <div className="bg-red-100 text-red-800 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shrink-0">
            <FiLock className="text-sm" />
            <span>Carga Cerrada Definitivamente</span>
          </div>
        </div>

        {/* Banner de resumen para padres */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-[#F5EFEB] p-4 rounded-2xl border border-[#EFE6DD] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#800020]/10 text-[#800020] flex items-center justify-center text-xl">
              <FiPieChart />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-[#800020]/80">
                Progreso Total
              </p>
              <p className="text-lg font-bold text-[#2D1A17]">
                {porcentajeVendido}% vendido
              </p>
            </div>
          </div>

          <div className="bg-[#F5EFEB] p-4 rounded-2xl border border-[#EFE6DD] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl">
              <FiCheckCircle />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-emerald-800">
                Vendidos
              </p>
              <p className="text-lg font-bold text-[#2D1A17]">
                {totalVendidos} números
              </p>
            </div>
          </div>

          <div className="bg-[#F5EFEB] p-4 rounded-2xl border border-[#EFE6DD] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-xl">
              <LuTicket />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-amber-900">
                Disponibles
              </p>
              <p className="text-lg font-bold text-[#2D1A17]">
                {totalDisponibles} números
              </p>
            </div>
          </div>
        </div>

        {/* Grilla de números (Sigue consultando y mostrando la grilla pública en tiempo real) */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#EFE6DD] shadow-md">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#800020]">
              <div className="w-8 h-8 border-4 border-[#800020] border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-semibold">
                Cargando grilla de rifas...
              </p>
            </div>
          ) : (
            <ChartNumbers
              numerosVendidos={vendidos}
              totalNumeros={TOTAL_NUMEROS}
            />
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
