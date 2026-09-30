import { ModuleController } from "@/src/controllers/module.controller.js";

export async function GET(req, context) {
  return ModuleController.getById(req, context);
}

export async function PUT(req, context) {
  return ModuleController.update(req, context);
}

export async function DELETE(req, context) {
  return ModuleController.delete(req, context);
}
