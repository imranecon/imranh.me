import crypto from "crypto";
import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "portfolio_admin_session";

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "imran2026";
}

function getSecretSalt(): string {
  return process.env.AUTH_SECRET || "imran-portfolio-salt-2026";
}

export function generateAuthToken(): string {
  const password = getAdminPassword();
  const salt = getSecretSalt();
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

export function verifyPassword(inputPassword: string): boolean {
  if (!inputPassword) return false;
  const adminPassword = getAdminPassword();
  return inputPassword.trim() === adminPassword.trim();
}

export function verifyAuthToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const expectedToken = generateAuthToken();
  return token === expectedToken;
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
