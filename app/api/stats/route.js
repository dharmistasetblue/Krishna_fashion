import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkAuth } from "@/lib/auth";

export async function GET(req) {
  const session = checkAuth(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const [inquiries, products, careers, jobs, settings] = await Promise.all([
    db.getInquiries(),
    db.getProducts(),
    db.getCareers(),
    db.getJobs(),
    db.getSettings()
  ]);

  const newInquiriesCount = inquiries.filter(i => i.status === "new").length;
  const inProgressInquiriesCount = inquiries.filter(i => i.status === "in_progress").length;
  const circularProductsCount = products.filter(p => p.category === "circular").length;
  const warpProductsCount = products.filter(p => p.category === "warp").length;
  const newApplicationsCount = careers.filter(c => c.status === "under_review").length;

  return NextResponse.json({
    stats: {
      totalInquiries: inquiries.length,
      newInquiries: newInquiriesCount,
      inProgressInquiries: inProgressInquiriesCount,
      totalProducts: products.length,
      circularProducts: circularProductsCount,
      warpProducts: warpProductsCount,
      totalApplications: careers.length,
      newApplications: newApplicationsCount,
      activeJobs: jobs.filter(j => j.status === "active").length,
      dailyCapacity: settings.dailyCapacity,
      knittingMachines: settings.knittingMachines
    },
    recentInquiries: inquiries.slice(0, 5),
    recentApplications: careers.slice(0, 5)
  });
}
