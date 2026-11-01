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
  FiCheckCircle,
} from "react-icons/fi";
import { LuTicket, LuAward } from "react-icons/lu";
import OfferedNumberModal from "@/components/OfferedNumberModal";
// import PersonalGridNumbers from "@/components/PersonalGridNumbers";

interface Venta {
  numero: number;
  comprador_nombre: string;
  comprador_apellido: string;
  comprobante_pago: string | null;
  fecha_venta: string;
  esGanador?: boolean;
  premioInfo?: { puesto: number; premio: string };
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
  const completoTodosLosNumeros = totalVendidos >= totalAsignados;

  // Identificar si este alumno vendió números ganadores gracias a la API
  const numerosGanadoresEstudiante = ventas.filter((v) => v.esGanador);

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
                {session?.curso} | Números:{" "}
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
        {/* 🌟 BANNER DE FELICITACIONES SI VENDIÓ NÚMEROS GANADORES */}
        {numerosGanadoresEstudiante.length > 0 && (
          <div className="bg-linear-to-r from-amber-500 to-amber-700 text-white p-5 rounded-2xl shadow-lg border-2 border-amber-300 flex items-center gap-4">
            <div className="w-12 h-12 bg-white text-amber-700 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0 shadow-md">
              <LuAward />
            </div>
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wide">
                🎉 ¡Felicitaciones! Vendiste número/s ganador/es
              </h2>
              <p className="text-xs text-amber-100 font-medium">
                Los siguientes números que registraste resultaron premiados:{" "}
                <span className="font-bold text-white">
                  {numerosGanadoresEstudiante
                    .map((v) => `#${v.numero} (${v.premioInfo?.premio})`)
                    .join(", ")}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Grilla de Números estilo Tarjeta para Capturas (Comentada pero preservada) */}
        {/* {session && (
          <PersonalGridNumbers
            nombreCompleto={session.nombre_completo}
            curso={session.curso}
            numeroDesde={session.numero_desde}
            numeroHasta={session.numero_hasta}
            numerosVendidos={ventas.map((v) => v.numero)}
          />
        )} */}

        {/* Botón Acción Principal - Se apoya en el cierre gestionado por la API */}
        <button
          onClick={() => setModalOpen(true)}
          disabled={completoTodosLosNumeros}
          className={`w-full py-4 font-bold rounded-2xl shadow-lg transition-all text-sm sm:text-base flex items-center justify-center gap-2 ${
            completoTodosLosNumeros
              ? "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none border border-gray-300"
              : "bg-[#800020] hover:bg-[#6B1124] active:scale-[0.99] text-[#FFFDF9] shadow-[#800020]/20 cursor-pointer"
          }`}
        >
          {completoTodosLosNumeros ? (
            <>
              <FiCheckCircle className="w-5 h-5 text-green-600" />
              <span>¡Completaste tus números asignados! 🎉</span>
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
                  className={`p-4 flex items-center justify-between transition-colors ${
                    v.esGanador
                      ? "bg-amber-50/80 hover:bg-amber-100/80"
                      : "hover:bg-[#FAF6F0]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-10 h-10 font-black rounded-xl flex items-center justify-center text-sm border ${
                        v.esGanador
                          ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                          : "bg-[#800020]/10 text-[#800020] border-[#800020]/20"
                      }`}
                    >
                      #{v.numero}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[#3A2D28] text-sm">
                          {v.comprador_nombre} {v.comprador_apellido}
                        </p>
                        {v.esGanador && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300 uppercase">
                            ⭐ {v.premioInfo?.premio}
                          </span>
                        )}
                      </div>
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
