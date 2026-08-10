'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiShield, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiAlertCircle, 
  FiLoader, 
  FiCheck, 
  FiX,
  FiArrowRight,
  FiArrowLeft,
  FiLogOut
} from 'react-icons/fi';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validaciones en tiempo real
  const tieneLargoMinimo = nuevaPassword.length >= 6;
  const coinciden = nuevaPassword.length > 0 && nuevaPassword === confirmarPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!tieneLargoMinimo) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (!coinciden) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevaPassword, confirmarPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cambiar la contraseña');

      router.push('/my-panel');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cambiar la contraseña';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 relative">
      
      {/* Botón superior de navegación para volver a la grilla principal */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-bold text-[#7C6E65] hover:text-[#800020] bg-white border border-[#EFE8DC] px-3.5 py-2 rounded-xl shadow-sm hover:shadow transition-all"
      >
        <FiArrowLeft className="w-4 h-4" />
        <span>Volver al inicio</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-[#EFE8DC] p-6 sm:p-8 transition-all mt-12 sm:mt-0">
        
        {/* Header & Icono */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#800020]/10 text-[#800020] rounded-2xl mb-3 shadow-inner">
            <FiShield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-[#3A2D28] tracking-tight">Primer Ingreso Detectado</h1>
          <p className="text-xs font-medium text-[#7C6E65] mt-1.5 leading-relaxed">
            Por seguridad, creá tu contraseña personal para reemplazar la clave por defecto.
          </p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-2xl flex items-center gap-2.5">
            <FiAlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nueva Contraseña */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#5C4D44] uppercase tracking-wider">
              Nueva Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E8E85]">
                <FiLock className="w-4 h-4" />
              </div>
              <input
                type={showNueva ? 'text' : 'password'}
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                className="w-full pl-10 pr-10 py-3 bg-[#FAF6F0] border border-[#EBE3D5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent text-[#3A2D28] font-medium text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNueva(!showNueva)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9E8E85] hover:text-[#5C4D44] transition-colors"
              >
                {showNueva ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#5C4D44] uppercase tracking-wider">
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E8E85]">
                <FiLock className="w-4 h-4" />
              </div>
              <input
                type={showConfirmar ? 'text' : 'password'}
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                placeholder="Repetí la contraseña"
                required
                className="w-full pl-10 pr-10 py-3 bg-[#FAF6F0] border border-[#EBE3D5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent text-[#3A2D28] font-medium text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmar(!showConfirmar)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9E8E85] hover:text-[#5C4D44] transition-colors"
              >
                {showConfirmar ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Lista de Requisitos / Checklist */}
          <div className="p-3 bg-[#FAF6F0] border border-[#EBE3D5] rounded-xl space-y-2 text-xs">
            <div className={`flex items-center gap-2 transition-colors ${tieneLargoMinimo ? 'text-emerald-700 font-medium' : 'text-[#7C6E65]'}`}>
              {tieneLargoMinimo ? <FiCheck className="w-4 h-4 text-emerald-600 shrink-0" /> : <FiX className="w-4 h-4 text-[#9E8E85] shrink-0" />}
              <span>Al menos 6 caracteres</span>
            </div>
            <div className={`flex items-center gap-2 transition-colors ${coinciden ? 'text-emerald-700 font-medium' : 'text-[#7C6E65]'}`}>
              {coinciden ? <FiCheck className="w-4 h-4 text-emerald-600 shrink-0" /> : <FiX className="w-4 h-4 text-[#9E8E85] shrink-0" />}
              <span>Las contraseñas coinciden</span>
            </div>
          </div>

          {/* Botón de Confirmación */}
          <button
            type="submit"
            disabled={loading || !tieneLargoMinimo || !coinciden}
            className="w-full py-3.5 px-4 bg-[#800020] hover:bg-[#6B1124] active:scale-[0.99] text-[#FFFDF9] font-bold text-sm rounded-xl shadow-lg shadow-[#800020]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mt-4 cursor-pointer"
          >
            {loading ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                <span>Guardando contraseña...</span>
              </>
            ) : (
              <>
                <span>Guardar y Continuar</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Opción para cancelar e ir al Login o Inicio */}
        <div className="mt-6 pt-4 border-t border-[#EFE8DC] text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7C6E65] hover:text-[#800020] transition-colors"
          >
            <FiLogOut className="w-3.5 h-3.5" />
            <span>Cancelar e iniciar sesión con otro usuario</span>
          </Link>
        </div>

      </div>
    </main>
  );
}