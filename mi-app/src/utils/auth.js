// Autenticación simulada con localStorage (solo demostración, sin backend).
// Ojo: la contraseña se guarda en texto plano; no usar así en producción.
const USERS_KEY = 'nextdocker_users';
const SESSION_KEY = 'nextdocker_session';

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage no disponible: se ignora
  }
};

// Registra un usuario nuevo e inicia sesión. Devuelve { ok, error }.
export function registerUser({ name, email, company, password }) {
  const users = read(USERS_KEY, []);
  const key = email.trim().toLowerCase();
  if (users.some((u) => u.email === key)) {
    return { ok: false, error: 'This email is already registered.' };
  }
  users.push({ name: name.trim(), email: key, company: company.trim(), password });
  write(USERS_KEY, users);
  write(SESSION_KEY, { email: key, name: name.trim() });
  return { ok: true };
}

// Valida credenciales e inicia sesión. Devuelve { ok, error }.
export function loginUser(email, password) {
  const key = email.trim().toLowerCase();
  const user = read(USERS_KEY, []).find((u) => u.email === key && u.password === password);
  if (!user) return { ok: false, error: 'Invalid email or password.' };
  write(SESSION_KEY, { email: user.email, name: user.name });
  return { ok: true };
}

export const getSession = () => read(SESSION_KEY, null);

export function logoutUser() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // se ignora
  }
}
