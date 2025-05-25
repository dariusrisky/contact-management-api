const jwt = require("jsonwebtoken");
const { user } = require("../model/Model");

const cookieMiddleware = async (req, res, next) => {
  const token = req.cookies.REFRESH_TOKEN;
  // console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // console.log(decoded);

    if (!decoded) return res.status(401).json({ message: "Unauthorized" });

    const userfind = await user.findOne({ SESION_TOKEN: token });

    if (!userfind) res.status(402).json({ message: "Unauthorized" });

    if (userfind.id !== decoded.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const data = {
      data: {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
      },
    };

    req.data = data;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = cookieMiddleware;
