import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data } = await supabase.from('ventas_rifa').select('numero');
  const vendidos = data ? data.map((v) => v.numero) : [];
  return NextResponse.json({ vendidos });
}