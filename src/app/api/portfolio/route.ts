import { NextResponse } from "next/server";
import { getPortfolioData, savePortfolioData } from "@/lib/portfolioData";
import { defaultPortfolioData } from "@/data/defaultPortfolioData";
import { PortfolioData } from "@/types/portfolio";
import { isRequestAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Enforce authentication on all mutations
    const isAuth = await isRequestAuthenticated();
    if (!isAuth) {
      return NextResponse.json(
        { error: "Unauthorized. Please enter admin password at /admin or /dashboard." },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (body.action === "reset") {
      const success = await savePortfolioData(defaultPortfolioData);
      if (!success) {
        return NextResponse.json({ error: "Failed to reset data" }, { status: 500 });
      }
      return NextResponse.json({ success: true, data: defaultPortfolioData });
    }

    const data = body as PortfolioData;
    if (!data.hero || !data.education || !data.research || !data.policy || !data.teaching || !data.writing) {
      return NextResponse.json({ error: "Invalid data structure" }, { status: 400 });
    }

    const success = await savePortfolioData(data);
    if (!success) {
      return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
