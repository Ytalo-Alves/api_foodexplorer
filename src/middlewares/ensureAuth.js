const authConfig = require('../config/auth');
const AppError = require('../utils/appError');
const { verify } = require('jsonwebtoken')

function ensureAuth(request, response, next){
  const authHeader = request.headers.authorization;


  if(!authHeader) {
    throw new AppError('JWT token não informado')
  }


  const [, token ] = authHeader.split(' ');

  try {
    const {sub: user_id} = verify(token, authConfig.jwt.secret)

    request.user = {
      id: Number(user_id)
    }

    return next()

  } catch (error) {
    throw new AppError('JWT token invalido')
  }
}

module.exports = ensureAuth