import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

// Definición oficial de números ganadores del sorteo
const GANADORES_SORTEO: Record<number, { puesto: number; premio: string }> = {
  530: { puesto: 1, premio: "1er Premio (6530)" },
  0:   { puesto: 2, premio: "2do Premio (6000)" },
  598: { puesto: 4, premio: "4to Premio (7598)" },
  315: { puesto: 5, premio: "5to Premio (2315)" },
  174: { puesto: 7, premio: "7mo Premio (9174)" },
};

export async function GET() {
  // 1. Obtener la sesión completa (que tiene todos los datos)
  const session = await getSession();

  // Si no hay sesión activa, responder tranquilamente con session null
  if (!session) {
    return NextResponse.json({ session: null, ventas: [] }, { status: 200 });
  }

  const userSessionForFrontend = {
    id: session.id,
    nombre_completo: session.nombre_completo,
    curso: session.curso,            
    numero_desde: session.numero_desde, 
    numero_hasta: session.numero_hasta, 
  };

  // 3. Consultar las ventas
  const { data: ventas, error } = await supabase
    .from('ventas_rifa')
    .select('*')
    .eq('estudiante_id', session.id)
    .order('numero', { ascending: true });

  // Manejo de error de base de datos 
  if (error) {
    console.error('Error Supabase Mis Ventas:', error);
    return NextResponse.json({ 
      session: userSessionForFrontend, 
      ventas: [] 
    }, { status: 200 });
  }

  // 4. Cruzar las ventas con los ganadores del sorteo (sin alterar tu lógica previa)
  const ventasConPremios = (ventas || []).map((v) => {
    const infoGanador = GANADORES_SORTEO[v.numero];
    return {
      ...v,
      esGanador: !!infoGanador,
      premioInfo: infoGanador || null,
    };
  });

  // 5. Enviar respuesta con la sesión sanitizada y las ventas con estado de ganador
  return NextResponse.json({ 
    session: userSessionForFrontend, 
    ventas: ventasConPremios 
  });
}

export async function POST() {
  // Cierre definitivo de carga tras el sorteo
  return NextResponse.json(
    { error: 'La carga de números se encuentra cerrada definitivamente por sorteo finalizado.' },
    { status: 400 }
  );
}