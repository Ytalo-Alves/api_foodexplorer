const { Router } = require("express");
const UserController = require("../controllers/UserController");
const ensureAuth = require("../middlewares/ensureAuth");

const usersController = new UserController();

const usersRouter = Router();

usersRoutes.post("/",ensureAuth, usersController.create);
usersRoutes.put("/",  usersController.updated);

module.exports = usersRouter;
