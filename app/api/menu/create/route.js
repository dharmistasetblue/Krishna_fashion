import { MenuController } from "@/src/controllers/menu.controller.js";

export async function POST(req) {
  return MenuController.create(req);
}
