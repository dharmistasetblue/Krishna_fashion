import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/lib/auth";

export async function GET(req) {
  const session = checkAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const applications = await db.getCareers();
  return NextResponse.json({ applications });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, areaOfInterest, message, resumeLink } = body;

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { error: "Name and contact info (email or phone) are required." },
        { status: 400 }
      );
    }

    const application = await db.createCareerApplication({
      name: name.trim(),
      email: (email || "").trim(),
      phone: (phone || "").trim(),
      areaOfInterest: areaOfInterest || "Production & Operations",
      message: (message || "").trim(),
      resumeLink: (resumeLink || "").trim()
    });

    return NextResponse.json({
      success: true,
      message: "Application received! Our HR team will review your profile.",
      application
    }, { status: 201 });
  } catch (err) {
    console.error("Career application error:", err);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
