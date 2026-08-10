'use client';

import { useState } from 'react';
import { 
  FiX, 
  FiAlertCircle, 
  FiLoader, 
  FiCheck 
} from 'react-icons/fi';
import { LuTicket } from 'react-icons/lu';
import Swal from 'sweetalert2';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  numeroDesde: number;
  numeroHasta: number;
}

export default function OfferedNumberModal({ isOpen, onClose, onSuccess, numeroDesde, numeroHasta }: Props) {
  const [numero, setNumero] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [comprobante, setComprobante] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Mostrar confirmación previa con SweetAlert2
    const confirmResult = await Swal.fire({
      title: '¿Confirmar registro?',
      html: `
        <div style="text-align: left; font-size: 0.9rem; color: #3A2D28; line-height: 1.6; background-color: #FAF6F0; padding: 12px; border-radius: 12px; border: 1px solid #EBE3D5;">
          <p style="margin-bottom: 4px;"><strong>Número:</strong> <span style="color: #800020; font-weight: bold; font-size: 1.1rem;">#${numero}</span></p>
          <p style="margin-bottom: 4px;"><strong>Comprador:</strong> ${nombre.trim()} ${apellido.trim()}</p>
          <p style="margin-bottom: 0;"><strong>Comprobante:</strong> ${comprobante.trim() || '<i>Sin comprobante</i>'}</p>
        </div>
        <p style="margin-top: 12px; font-size: 0.8rem; color: #B91C1C; font-weight: 600;">
          ⚠️ Una vez guardado no podrás editar ni eliminar este número.
        </p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#800020',
      cancelButtonColor: '#7C6E65',
      confirmButtonText: 'Sí, guardar venta',
      cancelButtonText: 'Revisar datos',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-3xl',
        confirmButton: 'rounded-xl font-bold px-4 py-2.5',
        cancelButton: 'rounded-xl font-bold px-4 py-2.5',
      },
    });

    // Si el usuario presiona "Revisar datos" o cierra la ventana, se detiene la ejecución
    if (!confirmResult.isConfirmed) return;

    setLoading(true);

    try {
      const res = await fetch('/api/rifas/vender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero,
          compradorNombre: nombre,
          compradorApellido: apellido,
          comprobante,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar la venta');

      // Notificación de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Venta Guardada!',
        text: `El número #${numero} se registró correctamente.`,
        confirmButtonColor: '#800020',
        timer: 2000,
        customClass: {
          popup: 'rounded-3xl',
          confirmButton: 'rounded-xl font-bold px-4 py-2',
        },
      });

      setNumero('');
      setNombre('');
      setApellido('');
      setComprobante('');
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ocurrió un error inesperado';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#EFE8DC] p-6 sm:p-8 relative">
        
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 text-[#9E8E85] hover:text-[#3A2D28] p-1 rounded-full hover:bg-[#FAF6F0] transition-colors cursor-pointer"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#800020]/10 text-[#800020] rounded-2xl mb-3">
            <LuTicket className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-[#3A2D28]">Cargar Número Vendido</h2>
          <p className="text-xs text-[#7C6E65] mt-1 font-medium">
            Tus números asignados son del <strong className="text-[#800020]">{numeroDesde}</strong> al <strong className="text-[#800020]">{numeroHasta}</strong>.
          </p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-2xl flex items-center gap-2">
            <FiAlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Campo Número */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#5C4D44] uppercase tracking-wider">
              Número Vendido
            </label>
            <div className="relative">
              <input
                type="number"
                min={numeroDesde}
                max={numeroHasta}
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder={`Ej: ${numeroDesde}`}
                required
                className="w-full p-3 pl-4 bg-[#FAF6F0] border border-[#EBE3D5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800020] text-[#3A2D28] font-bold text-lg transition-all"
              />
            </div>
          </div>

          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#5C4D44] uppercase tracking-wider">
                Nombre
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre"
                  required
                  className="w-full p-3 bg-[#FAF6F0] border border-[#EBE3D5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800020] text-[#3A2D28] font-medium text-sm transition-all"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#5C4D44] uppercase tracking-wider">
                Apellido
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Apellido"
                  required
                  className="w-full p-3 bg-[#FAF6F0] border border-[#EBE3D5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800020] text-[#3A2D28] font-medium text-sm transition-all"
                />
              </div>
            </div>
          </div>

          {/* Comprobante */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#5C4D44] uppercase tracking-wider">
              Comprobante de Pago <span className="text-[#9E8E85] font-normal lowercase">(opcional)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={comprobante}
                onChange={(e) => setComprobante(e.target.value)}
                placeholder="Nro de transferencia o recibo"
                className="w-full p-3 bg-[#FAF6F0] border border-[#EBE3D5] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800020] text-[#3A2D28] font-medium text-sm transition-all"
              />
            </div>
          </div>

          {/* Botón Enviar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#800020] hover:bg-[#6B1124] active:scale-[0.99] text-[#FFFDF9] font-bold text-sm rounded-xl shadow-lg shadow-[#800020]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <FiCheck className="w-4 h-4" />
                <span>Confirmar Venta</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}