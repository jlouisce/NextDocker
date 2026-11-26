import { supabase } from './supabaseClient';

const SESSION_KEY = 'nextdocker_session';
export const AUTH_CHANGE_EVENT = 'nextdocker_auth_changed';

const readSessionCache = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeSessionCache = (sessionObj, notify = true) => {
  try {
    const prevRaw = localStorage.getItem(SESSION_KEY) || '';
    const nextRaw = sessionObj ? JSON.stringify(sessionObj) : '';

    if (prevRaw === nextRaw) {
      return; // Evita disparar eventos si no hubo cambios reales
    }

    if (!sessionObj) {
      localStorage.removeItem(SESSION_KEY);
    } else {
      localStorage.setItem(SESSION_KEY, nextRaw);
    }

    if (notify && typeof window !== 'undefined') {
      window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
    }
  } catch {
    // se ignora
  }
};

export async function syncSupabaseSession({ notify = true } = {}) {
  try {
    const { data, error } = await supabase.auth.getSession();
    const session = data?.session;

    if (error || !session?.user) {
      writeSessionCache(null, notify);
      return null;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    const merged = {
      id: session.user.id,
      email: profile?.email || session.user.email,
      name: profile?.name || session.user.user_metadata?.name || session.user.email.split('@')[0],
      company: profile?.company || session.user.user_metadata?.company || '',
      phone: profile?.phone || '',
      role: profile?.role || 'Fleet Administrator',
      avatar: profile?.avatar_url || '',
    };

    writeSessionCache(merged, notify);
    return merged;
  } catch {
    return readSessionCache();
  }
}

export async function registerUser({ name, email, company, password }) {
  const cleanEmail = email.trim().toLowerCase();
  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        name: name.trim(),
        company: (company || '').trim(),
      },
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      email: cleanEmail,
      name: name.trim(),
      company: (company || '').trim(),
      role: 'Fleet Administrator',
    });
    await syncSupabaseSession({ notify: true });
  }

  return { ok: true };
}

export async function loginUser(email, password) {
  const cleanEmail = email.trim().toLowerCase();
  const { error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  await syncSupabaseSession({ notify: true });
  return { ok: true };
}

export const getSession = () => readSessionCache();

export const getCurrentUser = () => readSessionCache();

export async function uploadUserAvatar(file) {
  const current = readSessionCache();
  if (!current?.id) return { ok: false, error: 'No active user session.' };

  const ext = file.name.split('.').pop() || 'png';
  const filePath = `${current.id}/avatar-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    return { ok: false, error: uploadError.message };
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  return { ok: true, url: data.publicUrl };
}

export async function updateUserProfile(updates) {
  const current = readSessionCache();
  if (!current?.id) {
    return { ok: false, error: 'No active session found.' };
  }

  const nextEmail = (updates.email || current.email).trim().toLowerCase();

  if (nextEmail !== current.email) {
    const { error: emailErr } = await supabase.auth.updateUser({ email: nextEmail });
    if (emailErr) return { ok: false, error: emailErr.message };
  }

  if (updates.newPassword && updates.newPassword.trim().length >= 6) {
    const { error: passErr } = await supabase.auth.updateUser({
      password: updates.newPassword.trim(),
    });
    if (passErr) return { ok: false, error: passErr.message };
  }

  const payload = {
    id: current.id,
    email: nextEmail,
    name: (updates.name ?? current.name ?? '').trim() || current.name,
    company: (updates.company ?? current.company ?? '').trim(),
    phone: (updates.phone ?? current.phone ?? '').trim(),
    role: (updates.role ?? current.role ?? 'Fleet Administrator').trim(),
    avatar_url: updates.avatar !== undefined ? updates.avatar : current.avatar || '',
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('profiles').upsert(payload);
  if (error) {
    return { ok: false, error: error.message };
  }

  const updatedSession = {
    id: payload.id,
    email: payload.email,
    name: payload.name,
    company: payload.company,
    phone: payload.phone,
    role: payload.role,
    avatar: payload.avatar_url,
  };

  writeSessionCache(updatedSession, true);
  return { ok: true, user: updatedSession };
}

export async function logoutUser() {
  await supabase.auth.signOut();
  writeSessionCache(null, true);
}