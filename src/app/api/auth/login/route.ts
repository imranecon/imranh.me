import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyPassword, generateAuthToken, isAuthConfigured, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    if (!isAuthConfigured()) {
      console.error("Login disabled: ADMIN_PASSWORD and AUTH_SECRET must both be set.");
      return NextResponse.json(
        { success: false, error: "Admin login is not configured on this server." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!verifyPassword(password)) {
      return NextResponse.json(
        { success: false, error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    const token = generateAuthToken()!;
    const cookieStore = await cookies();

    cookieStore.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
