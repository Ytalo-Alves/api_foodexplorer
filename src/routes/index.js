const { Router } = require("express");

const sessionsRoutes = require("./sessions.routes");
const usersRouter = require("./user.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRoutes);

module.exports = routes;
