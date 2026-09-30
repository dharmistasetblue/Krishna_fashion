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
    const updated = await db.updateJob(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Job opening not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, job: updated });
  } catch (err) {
    console.error("Error updating job:", err);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  const session = checkAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    await db.deleteJob(id);
    return NextResponse.json({ success: true, message: "Job deleted" });
  } catch (err) {
    console.error("Error deleting job:", err);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
