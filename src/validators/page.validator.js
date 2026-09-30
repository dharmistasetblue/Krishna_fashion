import Joi from "joi";

export const createPageSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "any.required": "Title is required",
    "string.empty": "Title cannot be empty"
  }),
  slug: Joi.string().trim().required().messages({
    "any.required": "Slug is required",
    "string.empty": "Slug cannot be empty"
  }),
  description: Joi.string().allow("", null).optional(),
  metaTitle: Joi.string().allow("", null).optional(),
  metaDescription: Joi.string().allow("", null).optional(),
  metaKeywords: Joi.string().allow("", null).optional(),
  isActive: Joi.boolean().default(true)
});

export const updatePageSchema = Joi.object({
  title: Joi.string().trim().optional(),
  slug: Joi.string().trim().optional(),
  description: Joi.string().allow("", null).optional(),
  metaTitle: Joi.string().allow("", null).optional(),
  metaDescription: Joi.string().allow("", null).optional(),
  metaKeywords: Joi.string().allow("", null).optional(),
  isActive: Joi.boolean().optional()
});
