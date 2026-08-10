import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const curso = searchParams.get('curso');

  if (!curso) {
    return NextResponse.json({ error: 'Curso requerido' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('estudiantes')
    .select('id, nombre_completo')
    .eq('curso', curso)
    .order('nombre_completo', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Error al obtener alumnos' }, { status: 500 });
  }

  return NextResponse.json({ estudiantes: data });
}