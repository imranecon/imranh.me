import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isRequestAuthenticated } from "@/lib/auth";
import { STORAGE_BUCKET, getSupabaseServerClient, isSupabaseWriteConfigured } from "@/lib/supabase";

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

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

    // Vercel rejects request bodies over 4.5 MB before they reach this handler
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "PDF is too large (max 4 MB)" }, { status: 413 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let safeName = "";
    if (kind === "paper") {
      // Safe file name from the requested name (or the uploaded file's name)
      const rawName = String(formData.get("name") || file.name.replace(/\.pdf$/i, ""));
      safeName =
        rawName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 80) || `paper-${Date.now()}`;
    }

    // Production: the deployed filesystem is read-only, so store PDFs in Supabase Storage
    if (isSupabaseWriteConfigured()) {
      const supabase = getSupabaseServerClient()!;
      const objectPath = kind === "paper" ? `papers/${safeName}.pdf` : "cv/imranh_cv.pdf";
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(objectPath, buffer, { contentType: "application/pdf", upsert: true });
      if (error) {
        console.error("Supabase storage upload error:", error);
        return NextResponse.json({ error: `Failed to upload PDF: ${error.message}` }, { status: 500 });
      }
      const { publicUrl } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath).data;
      return NextResponse.json({
        success: true,
        // Cache-bust so a replaced file shows up immediately
        url: `${publicUrl}?v=${Date.now()}`,
        message: kind === "paper" ? "Paper PDF uploaded successfully" : "CV uploaded successfully",
      });
    }

    // Local development: write into public/
    if (kind === "paper") {
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
    const hint = isSupabaseWriteConfigured()
      ? ""
      : " (file storage is not configured on this server: set the Supabase environment variables)";
    return NextResponse.json({ error: `Failed to upload PDF file${hint}` }, { status: 500 });
  }
}
