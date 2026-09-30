import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/lib/auth";

export async function PATCH(req, context) {
  const session = checkAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const body = await req.json();
    const updated = await db.updateCareerApplication(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, application: updated });
  } catch (err) {
    console.error("Error updating application:", err);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  const session = checkAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    await db.deleteCareerApplication(id);
    return NextResponse.json({ success: true, message: "Application deleted" });
  } catch (err) {
    console.error("Error deleting application:", err);
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}
