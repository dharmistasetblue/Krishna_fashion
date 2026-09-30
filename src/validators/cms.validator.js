import Joi from "joi";

export const createCMSSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "any.required": "CMS title is required"
  }),
  slug: Joi.string().trim().optional(),
  description: Joi.string().allow("", null).optional(),
  content: Joi.string().allow("", null).optional(),
  image: Joi.string().allow("", null).optional(),
  images: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().default(true)
});

export const updateCMSSchema = Joi.object({
  title: Joi.string().trim().optional(),
  slug: Joi.string().trim().optional(),
  description: Joi.string().allow("", null).optional(),
  content: Joi.string().allow("", null).optional(),
  image: Joi.string().allow("", null).optional(),
  images: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional()
});
