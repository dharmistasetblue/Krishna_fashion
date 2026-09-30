export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};

export const MENU_TYPES = {
  PAGE: "page",
  PRODUCT: "product",
  CATEGORY: "category",
  PROJECT: "project",
  EXTERNAL: "external",
  CUSTOM: "custom"
};

export const SECTION_TYPES = {
  CMS: "cms",
  MODULE: "module"
};

export const MODULE_TYPES = {
  BANNER: "banner",
  PRODUCT: "product",
  PROJECT: "project",
  TESTIMONIAL: "testimonial",
  GALLERY: "gallery",
  BLOG: "blog",
  CONTACT: "contact",
  CUSTOM: "custom"
};

export const JWT_SECRET = process.env.JWT_SECRET || "krishna_fashion_jwt_secret_key_2026_enterprise_cms";
