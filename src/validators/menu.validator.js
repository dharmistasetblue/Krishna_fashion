import Joi from "joi";

export const createMenuSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "any.required": "Menu name is required"
  }),
  slug: Joi.string().trim().optional(),
  type: Joi.string().valid("page", "product", "category", "project", "external", "custom").required().messages({
    "any.required": "type is required (page, product, category, project, external, custom)"
  }),
  pageId: Joi.when("type", {
    is: "page",
    then: Joi.string().required().messages({ "any.required": "pageId is required when type is 'page'" }),
    otherwise: Joi.string().allow(null, "").optional()
  }),
  productId: Joi.string().allow(null, "").optional(),
  categoryId: Joi.string().allow(null, "").optional(),
  projectId: Joi.string().allow(null, "").optional(),
  url: Joi.string().allow(null, "").optional(),
  parentId: Joi.string().allow(null, "").optional(),
  position: Joi.number().integer().min(1).required().messages({
    "any.required": "position is required"
  }),
  isActive: Joi.boolean().default(true)
});

export const updateMenuSchema = Joi.object({
  name: Joi.string().trim().optional(),
  slug: Joi.string().trim().optional(),
  type: Joi.string().valid("page", "product", "category", "project", "external", "custom").optional(),
  pageId: Joi.string().allow(null, "").optional(),
  productId: Joi.string().allow(null, "").optional(),
  categoryId: Joi.string().allow(null, "").optional(),
  projectId: Joi.string().allow(null, "").optional(),
  url: Joi.string().allow(null, "").optional(),
  parentId: Joi.string().allow(null, "").optional(),
  position: Joi.number().integer().min(1).optional(),
  isActive: Joi.boolean().optional()
});

export const reorderMenuSchema = Joi.object({
  menus: Joi.array().items(
    Joi.object({
      menuId: Joi.string().required(),
      position: Joi.number().integer().min(1).required(),
      parentId: Joi.string().allow(null, "").optional()
    })
  ).min(1).required()
});
