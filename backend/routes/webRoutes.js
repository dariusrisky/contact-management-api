const express = require("express");
const {
  registerAccount,
  loginAccount,
  logoutAccount,
  refresh,
} = require("../controller/userController");
const cookieMiddleware = require("../middleware/cookieMiddleware");
const {
  addcontact,
  showContact,
  getContact,
} = require("../controller/cmsController");
const route = express.Router();

route.post("/auth/register-account", registerAccount);

route.post("/auth/login-account", loginAccount);

route.post("/auth/logout-account", logoutAccount);

route.post("/auth/refresh-token", refresh);

route.get("/protected/resource/getname", cookieMiddleware, (req, res) => {
  return res
    .status(200)
    .json({ message: "Protected resource accessed successfully" });
});

route.post(
  "/protected/contact-management/add-contact",
  cookieMiddleware,
  addcontact
);

route.get(
  "/protected/contact-management/show-contact",
  cookieMiddleware,
  showContact
);

route.get(
  "/protected/contact-management/search-contact/:key",
  cookieMiddleware,
  getContact
);

module.exports = route;
