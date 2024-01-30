const CategoryType = require('../../model/category/type');

const categoryController = {};

categoryController.filter = async (req, res) => {
  try {
    let category_types = await CategoryType.filter({});
    res.send(category_types);
  } catch (err) {
    console.log(err);
    res.send({ msg: "Ocorreu um erro ao buscar os tipos de categoria" });
  }
};

module.exports = categoryController;