'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiUsers, 
  FiUser, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiAlertCircle, 
  FiLoader,
  FiArrowRight,
  FiArrowLeft,
  FiInfo
} from 'react-icons/fi';
import { LuTicket } from 'react-icons/lu';

interface Estudiante {
  id: string;
  nombre_completo: string;
}

const CURSOS = ['6to 1ra', '6to 2da', '6to 3ra'];

export default function LoginPage() {
  const router = useRouter();
  const [curso, setCurso] = useState('');
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [estudianteId, setEstudianteId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loadingEstudiantes, setLoadingEstudiantes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCursoChange = (nuevoCurso: string) => {
    setCurso(nuevoCurso);
    setEstudianteId('');
    if (!nuevoCurso) {
      setEstudiantes([]);
    }
  };

  useEffect(() => {
    if (!curso) return;

    let isMounted = true;
    
    const fetchEstudiantes = async () => {
      setLoadingEstudiantes(true);
      setError('');
      try {
        const res = await fetch(`/api/auth/students?curso=${encodeURIComponent(curso)}`);
        const data = await res.json();
        
        if (isMounted && data.estudiantes) {
          setEstudiantes(data.estudiantes);
        }
      } catch {
        if (isMounted) {
          setError('Error al cargar la lista de alumnos. Intenta de nuevo.');
        }
      } finally {
        if (isMounted) {
          setLoadingEstudiantes(false);
        }
      }
    };

    fetchEstudiantes();

    return () => {
      isMounted = false;
    };
  }, [curso]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estudianteId, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');

      if (data.debeCambiarPass) {
        router.push('/reset-password');
      } else {
        router.push('/my-panel');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ocurrió un error inesperado';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 relative">
      
      {/* Botón superior para volver al inicio */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-bold text-[#7C6E65] hover:text-[#800020] bg-white border border-[#EFE8DC] px-3.5 py-2 rounded-xl shadow-sm hover:shadow transition-all"
      >
        <FiArrowLeft className="w-4 h-4" />
        <span>Atrás</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-[#EFE8DC] p-6 sm:p-8 transition-all mt-12 sm:mt-0">
        
        {/* Branding & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#800020]/10 text-[#800020] rounded-2xl mb-3 shadow-inner">
            <LuTicket className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-[#3A2D28] tracking-tight">Control de Rifas</h1>
          <p className="text-xs font-medium text-[#7C6E65] mt-1">
            Ingreso exclusivo para alumnos egresados
          </p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-2xl flex items-center gap-2.5">
            <FiAlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Paso 1: Selección de Curso */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#5C4D44] uppercase tracking-wider">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#800020]/10 text-[#800020] text-[10px]">1</span>
              Selecciona tu Curso
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E8E85]">
                <FiUsers className="w-4 h-4" />
              </div>
              <select
                value={curso}
                onChange={(e) => handleCursoChange(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#FAF6F0] border border-[#EBE3D5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent text-[#3A2D28] font-medium text-sm transition-all appearance-none cursor-pointer"
              >
                <option value="">-- Seleccionar curso --</option>
                {CURSOS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Paso 2: Selección de Nombre */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#5C4D44] uppercase tracking-wider">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#800020]/10 text-[#800020] text-[10px]">2</span>
              Selecciona tu Nombre
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E8E85]">
                {loadingEstudiantes ? (
                  <FiLoader className="w-4 h-4 animate-spin text-[#800020]" />
                ) : (
                  <FiUser className="w-4 h-4" />
                )}
              </div>
              <select
                value={estudianteId}
                onChange={(e) => setEstudianteId(e.target.value)}
                disabled={!curso || loadingEstudiantes}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#FAF6F0] border border-[#EBE3D5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent text-[#3A2D28] font-medium text-sm disabled:opacity-50 transition-all appearance-none cursor-pointer"
              >
                <option value="">
                  {loadingEstudiantes ? 'Cargando lista de alumnos...' : '-- Selecciona tu nombre --'}
                </option>
                {estudiantes.map((est) => (
                  <option key={est.id} value={est.id}>{est.nombre_completo}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Paso 3: Contraseña */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#5C4D44] uppercase tracking-wider">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#800020]/10 text-[#800020] text-[10px]">3</span>
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9E8E85]">
                <FiLock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Clave inicial"
                required
                className="w-full pl-10 pr-10 py-3 bg-[#FAF6F0] border border-[#EBE3D5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent text-[#3A2D28] font-medium text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9E8E85] hover:text-[#5C4D44] transition-colors"
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[#7C6E65] pl-1">
              ¿Primer ingreso? Ingresa la clave por defecto
            </p>
          </div>

          {/* Botón de Ingreso */}
          <button
            type="submit"
            disabled={loading || !estudianteId || !password}
            className="w-full py-3.5 px-4 bg-[#800020] hover:bg-[#6B1124] active:scale-[0.99] text-[#FFFDF9] font-bold text-sm rounded-xl shadow-lg shadow-[#800020]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mt-4 cursor-pointer"
          >
            {loading ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                <span>Ingresando...</span>
              </>
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Sección aclaratoria para Padres / Tutores */}
        <div className="mt-8 pt-5 border-t border-[#EFE8DC] text-center">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#7C6E65]">
            <FiInfo className="w-3.5 h-3.5 text-[#800020] shrink-0" />
            <span>¿Sos padre o comprador de rifas?</span>
          </div>
          <p className="text-xs mt-1">
            <Link href="/" className="font-bold text-[#800020] hover:underline">
              Hacé clic acá para regresar al sitio principal
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}