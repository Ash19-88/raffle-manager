'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ChartNumbers from '@/components/ChartNumbers';
import Footer from '@/components/Footer';
import { 
  FiUser, 
  FiPieChart, 
  FiCheckCircle, 
  FiLoader, 
  FiClock, 
  FiCalendar, 
  FiLock,
} from 'react-icons/fi';
import { LuTicket } from 'react-icons/lu';

interface UserSession {
  nombre_completo: string;
}

export default function HomePage() {
  const [vendidos, setVendidos] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<UserSession | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // --- CONTADOR LÍMITE (HOY 16:00 HS ARGENTINA) ---
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    // Límite de hoy a las 16:00 hs (ART / UTC-3)
    const FECHA_LIMITE = new Date('2026-08-14T16:00:00-03:00').getTime();

    const checkTime = () => {
      const now = new Date().getTime();
      const difference = FECHA_LIMITE - now;

      if (difference <= 0) {
        setIsClosed(true);
        setTimeLeft(null);
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    checkTime();
    const timer = setInterval(checkTime, 1000);
    return () => clearInterval(timer);
  }, []);
  // ------------------------------------------------

  const TOTAL_NUMEROS = 721;

  useEffect(() => {
    // 1. Cargar datos de la grilla pública
    fetch('/api/rifas/publicas')
      .then((res) => res.json())
      .then((data) => {
        if (data.vendidos) {
          setVendidos(new Set(data.vendidos));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // 2. Verificar si hay una sesión activa
    fetch('/api/rifas/mis-ventas')
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
  const porcentajeVendido = Math.round((totalVendidos / TOTAL_NUMEROS) * 100) || 0;

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#2D1A17] flex flex-col">
      <header className="bg-[#800020] text-[#FDFBF7] shadow-lg border-b-4 border-[#D4A373]">
        <div className="max-w-5xl mx-auto px-4 py-4 space-y-4 sm:space-y-0 sm:py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#FDFBF7] text-[#800020] flex items-center justify-center text-xl sm:text-2xl shadow-inner font-bold">
              <LuTicket />
            </div>
            <div>
              <h1 className="text-md sm:text-lg md:text-2xl font-black tracking-tight leading-tight">
                Rifa Egresados 2026
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
      </header>

      {/* Contenido Principal */}
      <section className="max-w-5xl mx-auto w-full px-4 py-6 sm:py-8 flex-1 flex flex-col gap-6">
        
        {/* BANNER INFORMATIVO / COUNTDOWN */}
        <div className="bg-white border border-[#EFE6DD] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#800020]/10 text-[#800020] flex items-center justify-center shrink-0">
              <FiCalendar className="text-xl" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#800020] uppercase tracking-wider">Información del Sorteo</p>
              <p className="text-sm font-semibold text-[#3A2D28]">
                Sortea el <strong className="font-bold text-[#800020]">15 de Agosto por Lotería Nacional Nocturna</strong>. Cierre de recepción: 14 de Agosto 16:00 hs.
              </p>
            </div>
          </div>

          {isClosed ? (
            <div className="bg-red-100 text-red-800 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shrink-0">
              <FiLock className="text-sm" />
              <span>Carga de números cerrada</span>
            </div>
          ) : (
            timeLeft && (
              <div className="bg-[#FAF6F0] border border-[#EFE8DC] text-[#3A2D28] px-4 py-2 rounded-xl flex items-center gap-2 shrink-0">
                <FiClock className="text-[#800020] text-sm" />
                <span className="text-xs font-medium">Tiempo restante:</span>
                <span className="text-sm font-black text-[#800020]">
                  {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            )
          )}
        </div>

        {/* Banner de resumen para padres */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-[#F5EFEB] p-4 rounded-2xl border border-[#EFE6DD] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#800020]/10 text-[#800020] flex items-center justify-center text-xl">
              <FiPieChart />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-[#800020]/80">Progreso Total</p>
              <p className="text-lg font-bold text-[#2D1A17]">{porcentajeVendido}% vendido</p>
            </div>
          </div>

          <div className="bg-[#F5EFEB] p-4 rounded-2xl border border-[#EFE6DD] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl">
              <FiCheckCircle />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-emerald-800">Vendidos</p>
              <p className="text-lg font-bold text-[#2D1A17]">{totalVendidos} números</p>
            </div>
          </div>

          <div className="bg-[#F5EFEB] p-4 rounded-2xl border border-[#EFE6DD] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-xl">
              <LuTicket />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-amber-900">Disponibles</p>
              <p className="text-lg font-bold text-[#2D1A17]">{totalDisponibles} números</p>
            </div>
          </div>
        </div>

        {/* Grilla de números */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#EFE6DD] shadow-md">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#800020]">
              <div className="w-8 h-8 border-4 border-[#800020] border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-semibold">Cargando grilla de rifas...</p>
            </div>
          ) : (
            <ChartNumbers numerosVendidos={vendidos} totalNumeros={TOTAL_NUMEROS} />
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}