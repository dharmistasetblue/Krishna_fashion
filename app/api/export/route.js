import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "krishna-fashion-code.zip");

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Export archive not found" }, { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileStream = fs.createReadStream(filePath);

  return new Response(fileStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="krishna-fashion-complete-code.zip"',
      "Content-Length": stat.size.toString(),
    },
  });
}
