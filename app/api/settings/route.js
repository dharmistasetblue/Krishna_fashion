import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/lib/auth";

export async function GET() {
  const settings = await db.getSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(req) {
  const session = checkAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await db.updateSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err) {
    console.error("Error updating settings:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
