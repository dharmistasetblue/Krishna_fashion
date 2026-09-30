import { MenuController } from "@/src/controllers/menu.controller.js";

export async function GET(req) {
  return MenuController.tree(req);
}
