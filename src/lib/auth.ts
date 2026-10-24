import crypto from "crypto";
import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "portfolio_admin_session";

// No fallbacks: if either variable is unset, admin auth is disabled (fails closed).
function getAdminPassword(): string | null {
  return process.env.ADMIN_PASSWORD?.trim() || null;
}

function getSecretSalt(): string | null {
  return process.env.AUTH_SECRET?.trim() || null;
}

export function isAuthConfigured(): boolean {
  return getAdminPassword() !== null && getSecretSalt() !== null;
}

export function generateAuthToken(): string | null {
  const password = getAdminPassword();
  const salt = getSecretSalt();
  if (!password || !salt) return null;
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

export function verifyPassword(inputPassword: string): boolean {
  if (!inputPassword || !isAuthConfigured()) return false;
  return inputPassword.trim() === getAdminPassword();
}

export function verifyAuthToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const expectedToken = generateAuthToken();
  return expectedToken !== null && token === expectedToken;
}

export async function isRequestAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    return verifyAuthToken(token);
  } catch {
    return false;
  }
}
