const {Router} = require('express')
const multer = require('multer')
const uploadConfig = require('../config/upload')


const ensureAuth = require('../middlewares/ensureAuth')
const DishController = require('../controllers/DishesController')


const dishController = new DishController()

const dishRoutes = Router()
const upload = multer(uploadConfig.MULTER)

dishRoutes.use(ensureAuth)

dishRoutes.post('/', upload.single('image'), dishController.create)


module.exports = dishRoutes