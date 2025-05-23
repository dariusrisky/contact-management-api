const express = require("express");
const {
  registerAccount,
  loginAccount,
  logoutAccount,
  refresh,
} = require("../controller/userController");
const cookieMiddleware = require("../middleware/cookieMiddleware");
const route = express.Router();

route.post("/auth/register-account", registerAccount);

route.post("/auth/login-account", loginAccount);

route.post("/auth/logout-account", logoutAccount);

route.post("/auth/refresh-token", refresh);

route.get("/protected/resource/getname", cookieMiddleware, (req, res) => {
  return res.status(200).json({ message: "Protected resource accessed successfully" });
});

module.exports = route;
