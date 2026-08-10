import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession, createSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { nuevaPassword, confirmarPassword } = await req.json();

    if (!nuevaPassword || nuevaPassword.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
    }

    if (nuevaPassword !== confirmarPassword) {
      return NextResponse.json({ error: 'Las contraseñas no coinciden' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(nuevaPassword, 10);

    const { error } = await supabase
      .from('estudiantes')
      .update({
        password_hash: passwordHash,
        debe_cambiar_pass: false,
      })
      .eq('id', session.id);

    if (error) {
      return NextResponse.json({ error: 'Error al actualizar contraseña' }, { status: 500 });
    }

    await createSession({
      ...session,
      debe_cambiar_pass: false,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}