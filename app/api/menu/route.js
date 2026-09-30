import { MenuController } from "@/src/controllers/menu.controller.js";

export async function GET(req) {
  return MenuController.list(req);
}

export async function POST(req) {
  return MenuController.create(req);
}
