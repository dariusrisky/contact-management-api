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
  searchContact,
  updateContact,
  deleteContact,
} = require("../controller/cmsController");
const route = express.Router();

route.post("/auth/register-account", registerAccount);

route.post("/auth/login-account", loginAccount);

route.post("/auth/logout-account", logoutAccount);

route.post("/auth/refresh-token", refresh);

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
  searchContact
);

route.get(
  "/protected/contact-management/get-contact/:key",
  cookieMiddleware,
  getContact
);

route.put(
  "/protected/contact-management/update-contact/:id",
  cookieMiddleware,
  updateContact
);

route.delete(
  "/protected/contact-management/delete-contact/:id",
  cookieMiddleware,
  deleteContact
);

module.exports = route;
