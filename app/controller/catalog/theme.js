const Category = require('../../model/category/main');
const CategoryVariation = require('../../model/category/variation');

const lib = require('jarmlib');

const themeController = {};

themeController.index = async (req, res) => {
  try {
    let category_options = {
      strict_params: { keys: [], values: [] },
    };

    lib.Query.fillParam("category.user_id", req.user.id, category_options.strict_params);
    let categories = await Category.filter(category_options);

    for (let i in categories) {
      let variation_options = {
        strict_params: { keys: [], values: [] },
      };

      lib.Query.fillParam("variation.category_id", categories[i].id, variation_options.strict_params);
      lib.Query.fillParam("variation.user_id", req.user.id, variation_options.strict_params);

      let variations = await CategoryVariation.filter(variation_options);
      if (variations.length) { categories[i].variations = variations; }
    };

    res.render("catalog/theme/index", { user: req.user, categories });
  } catch (err) {
    console.log(err);
    res.send({ msg: "Ocorreu um erro ao carregar suas informações, por favor, recarregue a página." });
  };
};

module.exports = themeController;