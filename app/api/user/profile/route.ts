
import { NextResponse } from 'next/server';
import { getSession, createSession } from '@/lib/session-server';
import { createClient } from '@/lib/supabase/server';

import { Tables } from '@/types/database';
import { AuthUser } from '@/lib/auth';

export async function PUT(request: Request) {
  let session;
  try {
    session = getSession();
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener la sesión' }, { status: 500 });
  }

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: Tables<'users'> = await request.json();

  if (!body.name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('users')
    .update({
      name: body.name,
      phone: body.phone,
      address: body.address,
    })
    .eq('id', session.user.id);


  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch the updated user data
  const { data: updatedUser, error: fetchError } = await supabase
    .from('users')
    .select('id, name, email, phone, address, user_type, status, created_at')
    .eq('id', session.user.id)
    .single();

  if (fetchError || !updatedUser) {
    console.error('Error fetching updated user:', fetchError);
    return NextResponse.json({ error: 'Error al obtener el usuario actualizado' }, { status: 500 });
  }

  // Refresh the session cookie with the updated user data
  const authUser: AuthUser = {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    address: updatedUser.address,
    user_type: updatedUser.user_type,
    status: updatedUser.status,
    created_at: updatedUser.created_at,
  };
  createSession(authUser);

  return NextResponse.json({ message: '¡Información actualizada con éxito!' });
}
