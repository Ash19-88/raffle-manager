"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiPlus,
  FiLogOut,
  FiGrid,
  FiUser,
  FiLoader,
  FiCalendar,
  FiFileText,
  FiClock,
  FiLock,
  FiCheckCircle,
} from "react-icons/fi";
import { LuTicket } from "react-icons/lu";
import OfferedNumberModal from "@/components/OfferedNumberModal";

interface Venta {
  numero: number;
  comprador_nombre: string;
  comprador_apellido: string;
  comprobante_pago: string | null;
  fecha_venta: string;
}

interface UserSession {
  id: string;
  nombre_completo: string;
  curso: string;
  numero_desde: number;
  numero_hasta: number;
}

export default function MiPanelPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // --- LOGICA DE COUNTDOWN Y CIERRE (HOY 16:00 HS ARGENTINA) ---
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    // Definimos el límite de hoy 14/08/2026 a las 19:00 hs
    const FECHA_LIMITE = new Date("2026-08-14T19:00:00-03:00").getTime();

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
  // -------------------------------------------------------------

  const refrescarVentas = async () => {
    try {
      const res = await fetch("/api/rifas/mis-ventas");
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setSession(data.session);
      setVentas(data.ventas || []);
    } catch {
      router.push("/login");
    }
  };

  useEffect(() => {
    let active = true;

    const cargarDatosIniciales = async () => {
      try {
        const res = await fetch("/api/rifas/mis-ventas");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (active) {
          setSession(data.session);
          setVentas(data.ventas || []);
        }
      } catch {
        if (active) {
          router.push("/login");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    cargarDatosIniciales();

    return () => {
      active = false;
    };
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="flex items-center gap-2 text-[#800020] font-bold text-sm">
          <FiLoader className="w-5 h-5 animate-spin" />
          <span>Cargando tu panel...</span>
        </div>
      </main>
    );
  }

  const totalAsignados = session
    ? session.numero_hasta - session.numero_desde + 1
    : 0;
  const totalVendidos = ventas.length;
  // 1. Calculamos si completó todos sus números
  const completoTodosLosNumeros = totalVendidos >= totalAsignados;

  // 2. Definimos si el botón debe estar deshabilitado
  const botonDeshabilitado = isClosed || completoTodosLosNumeros;

  return (
    <main className="min-h-screen bg-[#FDFBF7] pb-12">
      {/* Header Superior */}
      <header className="bg-white border-b border-[#EFE8DC] p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#800020]/10 text-[#800020] rounded-xl flex items-center justify-center shrink-0">
              <FiUser className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-[#3A2D28] text-base sm:text-lg leading-tight">
                {session?.nombre_completo}
              </h1>
              <p className="text-xs text-[#7C6E65] font-medium">
                {session?.curso} • Números:{" "}
                <span className="font-bold text-[#800020]">
                  {session?.numero_desde}
                </span>{" "}
                al{" "}
                <span className="font-bold text-[#800020]">
                  {session?.numero_hasta}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5C4D44] bg-[#FAF6F0] hover:bg-[#EBE3D5] border border-[#EFE8DC] px-3 py-2 rounded-xl transition-all"
            >
              <FiGrid className="w-4 h-4 text-[#800020]" />
              <span className="hidden sm:inline">Ver Grilla</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-xl transition-all"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4 space-y-5">
        {/* COMPONENTE COUNTDOWN / ALERTA CIERRE */}
        {isClosed ? (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold shadow-sm">
            <FiLock className="w-5 h-5 text-red-700 shrink-0" />
            <span>Recepción de números finalizada (Cierre: 19:00 hs)</span>
          </div>
        ) : (
          timeLeft && (
            <div className="bg-linear-to-r from-[#800020] to-[#5A0017] text-white p-4 rounded-2xl shadow-md text-center">
              <p className="text-[11px] font-bold uppercase tracking-wider text-red-200 flex items-center justify-center gap-1.5 mb-1">
                <FiClock className="w-3.5 h-3.5" />
                Cierre de recepción de números
              </p>
              <div className="text-2xl sm:text-3xl font-black tracking-widest">
                {String(timeLeft.hours).padStart(2, "0")}h :{" "}
                {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
                {String(timeLeft.seconds).padStart(2, "0")}s
              </div>
              <p className="text-[10px] text-red-200/80 mt-1 font-medium">
                Límite: Hoy a las 19:00 hs
              </p>
            </div>
          )
        )}

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-5 rounded-2xl border border-[#EFE8DC] shadow-sm text-center">
            <span className="block text-2xl sm:text-3xl font-black text-[#800020]">
              {totalVendidos} / {totalAsignados}
            </span>
            <span className="text-[11px] font-bold text-[#7C6E65] uppercase tracking-wider">
              Vendidos
            </span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#EFE8DC] shadow-sm text-center">
            <span className="block text-2xl sm:text-3xl font-black text-[#3A2D28]">
              {totalAsignados - totalVendidos}
            </span>
            <span className="text-[11px] font-bold text-[#7C6E65] uppercase tracking-wider">
              Disponibles
            </span>
          </div>
        </div>

        {/* Botón Acción Principal (Se deshabilita a las 19 hs) */}
        <button
          onClick={() => setModalOpen(true)}
          disabled={botonDeshabilitado}
          className={`w-full py-4 font-bold rounded-2xl shadow-lg transition-all text-sm sm:text-base flex items-center justify-center gap-2 ${
            botonDeshabilitado
              ? "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none border border-gray-300"
              : "bg-[#800020] hover:bg-[#6B1124] active:scale-[0.99] text-[#FFFDF9] shadow-[#800020]/20 cursor-pointer"
          }`}
        >
          {isClosed ? (
            <>
              <FiLock className="w-5 h-5" />
              <span>Carga Cerrada (19:00 hs)</span>
            </>
          ) : completoTodosLosNumeros ? (
            <>
              <FiCheckCircle className="w-5 h-5 text-green-600" />
              <span>¡Completaste tus 10 números! 🎉</span>
            </>
          ) : (
            <>
              <FiPlus className="w-5 h-5" />
              <span>Registrar Nuevo Número Vendido</span>
            </>
          )}
        </button>

        {/* Listado de Números Vendidos */}
        <div className="bg-white rounded-2xl border border-[#EFE8DC] shadow-sm overflow-hidden mt-6">
          <div className="p-4 border-b border-[#EFE8DC] bg-[#FAF6F0] flex items-center justify-between">
            <h2 className="font-bold text-[#3A2D28] text-sm flex items-center gap-2">
              <LuTicket className="w-4 h-4 text-[#800020]" />
              <span>Mis Números Vendidos</span>
            </h2>
            <span className="text-xs text-[#7C6E65] font-semibold">
              Total: {ventas.length}
            </span>
          </div>

          {ventas.length === 0 ? (
            <div className="p-8 text-center text-[#9E8E85] text-sm">
              Aún no has registrado ningún número vendido.
            </div>
          ) : (
            <div className="divide-y divide-[#EFE8DC] max-h-[50vh] overflow-y-auto">
              {ventas.map((v) => (
                <div
                  key={v.numero}
                  className="p-4 flex items-center justify-between hover:bg-[#FAF6F0] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 bg-[#800020]/10 text-[#800020] font-black rounded-xl flex items-center justify-center text-sm border border-[#800020]/20">
                      #{v.numero}
                    </span>
                    <div>
                      <p className="font-bold text-[#3A2D28] text-sm">
                        {v.comprador_nombre} {v.comprador_apellido}
                      </p>
                      {v.comprobante_pago && (
                        <p className="text-xs text-[#7C6E65] flex items-center gap-1 mt-0.5">
                          <FiFileText className="w-3 h-3 text-[#800020]" />
                          <span>Comp: {v.comprobante_pago}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-[#7C6E65] font-medium flex items-center gap-1">
                    <FiCalendar className="w-3 h-3 text-[#9E8E85]" />
                    {v.fecha_venta}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {session && (
        <OfferedNumberModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={refrescarVentas}
          numeroDesde={session.numero_desde}
          numeroHasta={session.numero_hasta}
        />
      )}
    </main>
  );
}
