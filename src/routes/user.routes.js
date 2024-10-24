const { Router } = require("express");
const UserController = require("../controllers/UserController");
const ensureAuth = require("../middlewares/ensureAuth");

const usersController = new UserController();

const usersRoutes = Router();

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuth, usersController.update);

module.exports = usersRoutes;
