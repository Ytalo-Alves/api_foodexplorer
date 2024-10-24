const knex = require("../database/knex");
const AppError = require('../utils/appError');
const DiskStorage = require('../providers/DiskStorage');

class DishController {
  async create(request, response) {
    // Capturing Body Parameters
    const { title, description, category, price, ingredients } = request.body;

    // Checking if dish already exists on the database
    const checkDishAlreadyExists = await knex("dishes").where({title}).first();

    if(checkDishAlreadyExists){
        throw new AppError("Este prato já existe no cardápio.")
    }

    // Requesting image filename
    const imageFileName = request.file.filename;

    // Instantiating diskStorage
    const diskStorage = new DiskStorage()

    // Saving image file
    const filename = await diskStorage.saveFile(imageFileName);

    // Inserting the infos into the database
    const dish_id = await knex("dishes").insert({
        image: filename,
        title,
        description,
        price,
        category,
    });

    // Checking if dish has only one ingredient and inserting the infos into the database
    const hasOnlyOneIngredient = typeof(ingredients) === "string";

    let ingredientsInsert

    if (hasOnlyOneIngredient) {
        ingredientsInsert = {
            name: ingredients,
            dish_id
        }

    } else if (ingredients.length > 1) {
        ingredientsInsert = ingredients.map(name => {
            return {
                name,
                dish_id
            }
        });
    }

    await knex("ingredients").insert(ingredientsInsert);

    return response.status(201).json(); 
}

}

module.exports = DishController;
