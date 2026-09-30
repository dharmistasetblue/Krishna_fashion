import crypto from "crypto";

const SECRET = process.env.ADMIN_SECRET || "kf-super-secret-salt-2026-krishna-fashion";

export function createSessionToken(user) {
  const payload = {
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days
  };
  const str = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(str).digest("base64url");
  return `${str}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [dataStr, signature] = parts;
  const expectedSignature = crypto.createHmac("sha256", SECRET).update(dataStr).digest("base64url");
  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(Buffer.from(dataStr, "base64url").toString("utf8"));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function checkAuth(req) {
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    return verifySessionToken(token);
  }
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const match = cookieHeader.match(/kf_admin_session=([^;]+)/);
    if (match) {
      return verifySessionToken(decodeURIComponent(match[1]));
    }
  }
  return null;
}
