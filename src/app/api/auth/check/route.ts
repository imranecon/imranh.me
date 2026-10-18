import { NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/auth";

export async function GET() {
  const authenticated = await isRequestAuthenticated();
  return NextResponse.json({ authenticated });
}
