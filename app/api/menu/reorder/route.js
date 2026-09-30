import { MenuController } from "@/src/controllers/menu.controller.js";

export async function PUT(req) {
  return MenuController.reorder(req);
}
