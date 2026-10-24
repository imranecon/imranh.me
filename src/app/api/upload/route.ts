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
    // "cv" (default) replaces public/imranh_cv.pdf; "paper" saves to public/papers/<name>.pdf
    const kind = formData.get("kind") === "paper" ? "paper" : "cv";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Verify it is a PDF file
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (kind === "paper") {
      // Safe file name from the requested name (or the uploaded file's name)
      const rawName = String(formData.get("name") || file.name.replace(/\.pdf$/i, ""));
      const safeName =
        rawName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 80) || `paper-${Date.now()}`;

      const papersDir = path.join(process.cwd(), "public", "papers");
      await fs.mkdir(papersDir, { recursive: true });
      await fs.writeFile(path.join(papersDir, `${safeName}.pdf`), buffer);

      return NextResponse.json({
        success: true,
        url: `/papers/${safeName}.pdf`,
        message: "Paper PDF uploaded successfully",
      });
    }

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
    return NextResponse.json({ error: "Failed to upload PDF file" }, { status: 500 });
  }
}
