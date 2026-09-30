import { errorResponse } from "../utils/response.js";
import { STATUS_CODES } from "../config/constants.js";

export function validate(schema, data) {
  const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });
  if (error) {
    const errorDetails = error.details.map(d => ({
      field: d.path.join("."),
      message: d.message.replace(/['"]/g, "")
    }));
    return {
      error: errorResponse(errorDetails[0]?.message || "Validation error", STATUS_CODES.BAD_REQUEST, errorDetails),
      value: null
    };
  }
  return { error: null, value };
}
