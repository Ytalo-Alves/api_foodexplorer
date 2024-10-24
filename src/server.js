require('express-async-errors')
const express = require('express');
const cors = require('cors')
const database = require('./database/sqlite')
const routes = require('./routes')
const AppError = require('./utils/appError')

const app = express()
const PORT = 3333;
app.use(cors())
app.use(express.json())


app.use(routes);
database()


app.use((error, request, response, next) => {

  // Trata os erros do lado do cliente.
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }

  console.log(error)

  //Trata os erros do lado do servidor
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))