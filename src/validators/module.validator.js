import Joi from "joi";

export const createModuleSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "any.required": "Module name is required"
  }),
  slug: Joi.string().trim().optional(),
  type: Joi.string().valid("banner", "product", "project", "testimonial", "gallery", "blog", "contact", "custom").required().messages({
    "any.required": "Module type is required"
  }),
  title: Joi.string().allow("", null).optional(),
  subtitle: Joi.string().allow("", null).optional(),
  configuration: Joi.object().optional().default({}),
  isActive: Joi.boolean().default(true)
});

export const updateModuleSchema = Joi.object({
  name: Joi.string().trim().optional(),
  slug: Joi.string().trim().optional(),
  type: Joi.string().valid("banner", "product", "project", "testimonial", "gallery", "blog", "contact", "custom").optional(),
  title: Joi.string().allow("", null).optional(),
  subtitle: Joi.string().allow("", null).optional(),
  configuration: Joi.object().optional(),
  isActive: Joi.boolean().optional()
});
