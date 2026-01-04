import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024
// Allowed image types
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]

/**
 * POST /api/upload
 * Handles image uploads to Vercel Blob Storage
 * 
 * Security features:
 * - File size validation (max 10MB)
 * - File type validation (images only)
 * - Error handling and sanitization
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type not allowed. Allowed types: ${ALLOWED_TYPES.join(", ")}` },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob with unique filename
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    })

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    // Log error for debugging but don't expose internal details
    console.error("Upload error:", error)
    
    // Return generic error message to prevent information leakage
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    )
  }
}
