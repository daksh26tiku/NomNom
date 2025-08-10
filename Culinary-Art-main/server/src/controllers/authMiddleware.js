const { jwtVerify } = require("jose-node-cjs-runtime/jwt/verify");
const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET_KEY);

async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
    return null;
  }
}

async function verifyToken(req, res, next) {
  // Get token from header
  let token = req.header("Authorization");

  // Check if not token
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization failed!" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trimLeft();
  }

  try {
    // Verify token
    const decoded = await decrypt(token);

    // Add user from payload
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Token is not valid" });
  }
}

module.exports = verifyToken;
