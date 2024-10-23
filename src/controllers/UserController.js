const sqliteConnection = require('../database/sqlite')
const AppError = require('../utils/appError')
const { hash, compare } = require('bcryptjs')

class UserController {
  async create(request, response) {
    const { name, email, password } = request.body

    // conectando com o banco de dados.
    const Criptografando = await sqliteConnection()

    // verificando se o usuário existe
    const checkUserExists = await Criptografando.get('SELECT * FROM users WHERE email = (?)', [email])

    // Validação caso tente acessar com um e-mail que já está em uso.
    if (checkUserExists) {
      throw new AppError({ error: 'Este e-mail já está em uso' })
    }

    // Validação se o nome for menor que 3 caracteres.
    if (name.length < 3) {
      throw new AppError({ error: 'Digite um nome valido!' })
    }

    // Validação para verificar se o email contem os caracteres que o caracterizam como email.
    if (!email.includes('@', '.' || !email.includes('.'))) {
      throw new AppError({ error: 'Digite um email valido!' })
    }

    // validação de senha, caso seja menor que 6 caracteres
    if (password.length < 6) {
      throw new AppError({ error: 'A senha deve conter pelo menos 6 caracteres.' })
    }

    //Criptografando a senha do usuário no banco de dados
    const hashPassword = await hash(password, 10)

    // Inserindo as informações no banco de dados.
    await database.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashPassword]
    )

    console.log({name, email, password})

    return response.status(201).json({ name, email, hashPassword })

  }

  async updated(request, response) {
    const {name, email, password, old_password} = request.body
    const user_id = request.user.id

    const database = await sqliteConnection()
    const user = await database.get('SELECT * FROM users WHERE id = (?)', [user_id])

    if(!user){
      throw new AppError('Usuário não encontrado')
    }

    const userWithUpdatedEmail = await database.get('SELECT * FROM users WHERE email = (?)', [user_id])

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail já esta em uso')
    }

    user.name = name;
    user.email = email;

    if(password && !old_password){
      throw new AppError('Você precisa informar a senha antiga para definir uma nova senha.')
    }

    if(password && old_password){
      const checkedOldPassword = await compare(old_password, user.password)

      if(!checkedOldPassword) {
        throw new AppError('A senha antiga incorreta.')
      }

      user.password = await hash(password, 10)
    }

    await database.run(`
      UPDATED users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?
      `, [user.name, user.email, user.password, user_id]);

      return response.status(201).json()
  }
}

module.exports = UserController;