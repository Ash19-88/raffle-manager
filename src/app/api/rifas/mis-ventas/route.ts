import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

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

  // 4. Enviar respuesta con la sesión sanitizada CORRECTAMENTE
  return NextResponse.json({ 
    session: userSessionForFrontend, 
    ventas 
  });
}