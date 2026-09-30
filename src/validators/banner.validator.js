import Joi from "joi";

export const createBannerSchema = Joi.object({
  menuId: Joi.string().allow(null, "").optional(),
  pageId: Joi.string().allow(null, "").optional(),
  title: Joi.string().trim().required().messages({
    "any.required": "Banner title is required"
  }),
  subtitle: Joi.string().allow("", null).optional(),
  desktopImage: Joi.string().required().messages({
    "any.required": "desktopImage is required"
  }),
  mobileImage: Joi.string().allow("", null).optional(),
  buttonText: Joi.string().allow("", null).optional(),
  buttonUrl: Joi.string().allow("", null).optional(),
  position: Joi.number().integer().min(1).default(1),
  isActive: Joi.boolean().default(true)
});

export const updateBannerSchema = Joi.object({
  menuId: Joi.string().allow(null, "").optional(),
  pageId: Joi.string().allow(null, "").optional(),
  title: Joi.string().trim().optional(),
  subtitle: Joi.string().allow("", null).optional(),
  desktopImage: Joi.string().optional(),
  mobileImage: Joi.string().allow("", null).optional(),
  buttonText: Joi.string().allow("", null).optional(),
  buttonUrl: Joi.string().allow("", null).optional(),
  position: Joi.number().integer().min(1).optional(),
  isActive: Joi.boolean().optional()
});
