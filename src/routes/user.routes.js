const { Router } = require("express");
const UserController = require("../controllers/UserController");

const usersController = new UserController();

const usersRoutes = Router();

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", usersController.updated);

module.exports = usersRoutes;
