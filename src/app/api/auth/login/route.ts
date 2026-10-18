import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyPassword, generateAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!verifyPassword(password)) {
      return NextResponse.json(
        { success: false, error: "Incorrect password. Please try again." },
        { status: 401 }
      );
    }

    const token = generateAuthToken();
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
