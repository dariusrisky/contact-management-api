const jwt = require("jsonwebtoken");
const { userModel } = require("../model/userModel");

const cookieMiddleware = async (req, res, next) => {
  const token = req.cookies.REFRESH_TOKEN;
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await userModel.findOne({ SESION_TOKEN: token });

    if (!user) res.status(402).json({ message: "Unauthorized" });

    if (user.id !== decoded.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();

  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = cookieMiddleware;
