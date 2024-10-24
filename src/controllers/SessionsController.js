// Knex, App Error, Compare, Token and AuthConfig Import
const knex = require("../database/knex");

const authConfig = require("../config/auth");
const { sign } = require("jsonwebtoken");

const AppError = require("../utils/appError");
const { compare } = require("bcryptjs");

class SessionsController {
    async create(request, response) {
        // Capturando as informações no corpo da 
        const { email, password } = request.body;

        // Obtendo informações do usuário pelo e-mail.
        const user = await knex("users").where({ email }).first();

        // Verificando se o email do usuário é valido.
        if (!user) {
            throw new AppError("E-mail e/ou senha incorretos", 401);
        }

        // Comparando a senha informada com a senha do usuário.
        const passwordMatched = await compare(password, user.password);

        // Validando se a senha do usuario está correta.
        if (!passwordMatched) {
            throw new AppError("E-mail e/ou senha incorretos", 401);
        }

        // Gerando o token de autenticação
        const { secret, expiresIn } = authConfig.jwt;
        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })

        return response.status(201).json({ user, token });
    }
}

module.exports = SessionsController;