import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/constants.js";
import { UserModel } from "../config/database.js";
import { errorResponse } from "../utils/response.js";
import { STATUS_CODES } from "../config/constants.js";

export async function authenticate(req) {
  try {
    let token = null;

    // Check Authorization header
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Check cookie
    if (!token) {
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/cms_token=([^;]+)/);
        if (match) token = match[1];
      }
    }

    if (!token) {
      return { error: errorResponse("Authentication token required", STATUS_CODES.UNAUTHORIZED) };
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(decoded.id);

    if (!user || user.isDeleted) {
      return { error: errorResponse("User no longer exists or is inactive", STATUS_CODES.UNAUTHORIZED) };
    }

    return { user: { id: user._id, name: user.name, email: user.email, role: user.role } };
  } catch (err) {
    return { error: errorResponse("Invalid or expired session token", STATUS_CODES.UNAUTHORIZED) };
  }
}

export function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}
