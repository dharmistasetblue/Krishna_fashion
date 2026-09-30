import Joi from "joi";

export const createPageSectionSchema = Joi.object({
  pageId: Joi.string().required().messages({
    "any.required": "pageId is required"
  }),
  type: Joi.string().valid("cms", "module").required().messages({
    "any.required": "type must be either 'cms' or 'module'"
  }),
  cmsId: Joi.when("type", {
    is: "cms",
    then: Joi.string().required().messages({ "any.required": "cmsId is required when type is cms" }),
    otherwise: Joi.string().allow(null, "").optional()
  }),
  moduleId: Joi.when("type", {
    is: "module",
    then: Joi.string().required().messages({ "any.required": "moduleId is required when type is module" }),
    otherwise: Joi.string().allow(null, "").optional()
  }),
  title: Joi.string().allow("", null).optional(),
  subtitle: Joi.string().allow("", null).optional(),
  backgroundImage: Joi.string().allow("", null).optional(),
  position: Joi.number().integer().min(1).required().messages({
    "any.required": "position is required and must be at least 1"
  }),
  isActive: Joi.boolean().default(true)
});

export const updatePageSectionSchema = Joi.object({
  title: Joi.string().allow("", null).optional(),
  subtitle: Joi.string().allow("", null).optional(),
  backgroundImage: Joi.string().allow("", null).optional(),
  position: Joi.number().integer().min(1).optional(),
  isActive: Joi.boolean().optional(),
  cmsId: Joi.string().allow(null, "").optional(),
  moduleId: Joi.string().allow(null, "").optional()
});

export const reorderPageSectionSchema = Joi.object({
  pageId: Joi.string().required().messages({ "any.required": "pageId is required" }),
  sections: Joi.array().items(
    Joi.object({
      sectionId: Joi.string().required(),
      position: Joi.number().integer().min(1).required()
    })
  ).min(1).required().messages({
    "any.required": "sections array is required"
  })
});
