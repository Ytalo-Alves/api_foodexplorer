const { Router } = require("express");

const sessionsRoutes = require("./sessions.routes");
const usersRouter = require("./user.routes");
const dishRoutes = require("./dishes.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRoutes);
routes.use('/dishes', dishRoutes)

module.exports = routes;
