import { FiGift, FiSmile, FiHeart, FiTag } from 'react-icons/fi';

export default function AwardsSection() {
  const premios = [
    {
      puesto: '1° Premio',
      titulo: 'Voucher en Ropa Deportiva',
      icono: <FiGift className="text-2xl text-[#800020]" />,
      destacado: true,
    },
    {
      puesto: '2° Premio',
      titulo: 'Voucher en Servicio de Estética',
      icono: <FiSmile className="text-2xl text-[#800020]" />,
      destacado: false,
    },
    {
      puesto: '3° Premio',
      titulo: 'Voucher de 1 Mes de Hatha Yoga',
      detalle: '2 veces por semana',
      icono: <FiHeart className="text-2xl text-[#800020]" />,
      destacado: false,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-[#EFE6DD] pb-3">
        <div>
          <h2 className="text-xl font-black text-[#800020] flex items-center gap-2">
            <FiGift /> Premios del Sorteo
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            ¡Gran Rifa del Día de la Madre! Apoyá a la Promo Grilli Monte Grande 2026.
          </p>
        </div>
        <div className="bg-[#800020] text-[#FDFBF7] px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm shrink-0">
          <FiTag />
          <span>Valor del número: $2.000</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {premios.map((premio, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              premio.destacado
                ? 'bg-[#FAF6F0] border-[#D4A373] shadow-md ring-2 ring-[#D4A373]/30'
                : 'bg-white border-[#EFE6DD] shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider bg-[#800020]/10 text-[#800020] px-3 py-1 rounded-full">
                  {premio.puesto}
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] border border-[#EFE6DD] flex items-center justify-center shadow-xs">
                  {premio.icono}
                </div>
              </div>
              <h3 className="text-base font-bold text-[#2D1A17] leading-snug">
                {premio.titulo}
              </h3>
              {premio.detalle && (
                <p className="text-xs text-stone-500 font-medium mt-1">
                  ({premio.detalle})
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}