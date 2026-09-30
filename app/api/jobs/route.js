import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/lib/auth";

export async function GET() {
  const jobs = await db.getJobs();
  return NextResponse.json({ jobs });
}

export async function POST(req) {
  const session = checkAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }
    const created = await db.createJob(body);
    return NextResponse.json({ success: true, job: created }, { status: 201 });
  } catch (err) {
    console.error("Error creating job opening:", err);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
