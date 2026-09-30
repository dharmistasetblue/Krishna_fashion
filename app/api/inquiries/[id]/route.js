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
    const updated = await db.updateInquiry(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, inquiry: updated });
  } catch (err) {
    console.error("Error updating inquiry:", err);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  const session = checkAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    await db.deleteInquiry(id);
    return NextResponse.json({ success: true, message: "Inquiry deleted" });
  } catch (err) {
    console.error("Error deleting inquiry:", err);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
