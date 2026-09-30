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
    const updated = await db.updateProduct(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    console.error("Error updating product:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  const session = checkAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    await db.deleteProduct(id);
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error("Error deleting product:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
