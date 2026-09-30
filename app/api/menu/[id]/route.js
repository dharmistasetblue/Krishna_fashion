import { MenuController } from "@/src/controllers/menu.controller.js";

export async function GET(req, context) {
  return MenuController.getById(req, context);
}

export async function PUT(req, context) {
  return MenuController.update(req, context);
}

export async function DELETE(req, context) {
  return MenuController.delete(req, context);
}
