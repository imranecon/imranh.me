import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isRequestAuthenticated } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const isAuth = await isRequestAuthenticated();
    if (!isAuth) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Verify it is a PDF file
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported for CV upload" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save directly to public/imranh_cv.pdf
    const publicPath = path.join(process.cwd(), "public", "imranh_cv.pdf");
    await fs.writeFile(publicPath, buffer);

    return NextResponse.json({
      success: true,
      url: `/imranh_cv.pdf?v=${Date.now()}`,
      message: "CV uploaded successfully",
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Failed to upload CV file" }, { status: 500 });
  }
}
