import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    // ----------------------------------------------------
    // VALIDACIÓN DE HORA LÍMITE (HOY 16:00 HS ARGENTINA)
    // ----------------------------------------------------
    const FECHA_LIMITE = new Date('2026-08-14T16:00:00-03:00');
    if (new Date() >= FECHA_LIMITE) {
      return NextResponse.json(
        { error: 'La recepción de números cerró a las 16:00 hs.' },
        { status: 400 }
      );
    }
    // 1. Verificación de Autenticación
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // 2. Extraer y limpiar el body
    const body = await req.json();
    const { numero, compradorNombre, compradorApellido, comprobante } = body;

    const nombreLimpio = compradorNombre?.toString().trim();
    const apellidoLimpio = compradorApellido?.toString().trim();

    if (!nombreLimpio || !apellidoLimpio) {
      return NextResponse.json(
        { error: 'El nombre y apellido del comprador son obligatorios' },
        { status: 400 }
      );
    }

    // 3. Conversión y validación del número
    const numInt = parseInt(numero, 10);
    if (isNaN(numInt)) {
      return NextResponse.json({ error: 'Número inválido' }, { status: 400 });
    }

    // 4. Validación del rango asignado al estudiante
    const numeroDesde = Number(session.numero_desde);
    const numeroHasta = Number(session.numero_hasta);

    if (isNaN(numeroDesde) || isNaN(numeroHasta)) {
      return NextResponse.json(
        { error: 'No tienes un rango de números asignado válido' },
        { status: 400 }
      );
    }

    if (numInt < numeroDesde || numInt > numeroHasta) {
      return NextResponse.json(
        { error: `El número ${numInt} está fuera de tu rango asignado (${numeroDesde} - ${numeroHasta})` },
        { status: 400 }
      );
    }

    // 5. Registrar venta en Supabase
    const { error } = await supabase.from('ventas_rifa').insert([
      {
        numero: numInt,
        estudiante_id: session.id,
        comprador_nombre: nombreLimpio,
        comprador_apellido: apellidoLimpio,
        comprobante_pago: comprobante ? comprobante.toString().trim() : null,
      },
    ]);

    if (error) {
      // Código PostgreSQL 23505: unique_violation (el número ya existe en ventas_rifa)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Este número ya fue registrado como vendido' },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: 'Error al registrar la venta' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}