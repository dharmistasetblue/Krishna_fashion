import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/lib/auth";

export async function GET(req) {
  const session = checkAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const exportCsv = searchParams.get("export") === "csv";

  let inquiries = await db.getInquiries();

  if (status && status !== "all") {
    inquiries = inquiries.filter(i => i.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    inquiries = inquiries.filter(i =>
      (i.name && i.name.toLowerCase().includes(q)) ||
      (i.email && i.email.toLowerCase().includes(q)) ||
      (i.phone && i.phone.includes(q)) ||
      (i.inquiryType && i.inquiryType.toLowerCase().includes(q)) ||
      (i.message && i.message.toLowerCase().includes(q))
    );
  }

  if (exportCsv) {
    const header = "ID,Name,Email,Phone,Inquiry Type,Status,Message,Date\n";
    const rows = inquiries.map(i => {
      const cleanMsg = (i.message || "").replace(/"/g, '""').replace(/\n/g, " ");
      return `"${i.id}","${i.name}","${i.email}","${i.phone}","${i.inquiryType}","${i.status}","${cleanMsg}","${i.createdAt}"`;
    }).join("\n");

    return new Response(header + rows, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="krishna_fashion_inquiries_${Date.now()}.csv"`
      }
    });
  }

  return NextResponse.json({ inquiries });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, inquiryType, message } = body;

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { error: "Name and at least one contact method (email or phone) are required." },
        { status: 400 }
      );
    }

    const newInquiry = await db.createInquiry({
      name: name.trim(),
      email: (email || "").trim(),
      phone: (phone || "").trim(),
      inquiryType: inquiryType || "General Product Inquiry",
      message: (message || "").trim()
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully! Our sales team will get in touch shortly.",
      inquiry: newInquiry
    }, { status: 201 });
  } catch (err) {
    console.error("Inquiry submission error:", err);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}
