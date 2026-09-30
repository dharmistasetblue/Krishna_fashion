import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/lib/auth";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const all = searchParams.get("all") === "true";

  let products = await db.getProducts();

  if (!all) {
    products = products.filter(p => p.status === "active");
  }

  if (category && category !== "all") {
    products = products.filter(p => p.category === category);
  }

  return NextResponse.json({ products });
}

export async function POST(req) {
  const session = checkAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.category) {
      return NextResponse.json({ error: "Fabric name and category are required" }, { status: 400 });
    }

    const created = await db.createProduct(body);
    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (err) {
    console.error("Error creating product:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
