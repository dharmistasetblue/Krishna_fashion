import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSessionToken, checkAuth } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await db.verifyAdmin(email, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    const token = createSessionToken(user);
    const response = NextResponse.json({
      success: true,
      user,
      token
    });

    response.cookies.set("kf_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req) {
  const session = checkAuth(req);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: session });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set("kf_admin_session", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/"
  });
  return response;
}

export async function PUT(req) {
  const session = checkAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
    }

    const user = await db.verifyAdmin(session.email, currentPassword);
    if (!user) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    await db.updateAdminPassword(newPassword);
    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
