import Category from '../../model/category/main.mjs';
import CategoryVariation from '../../model/category/variation.mjs';

import lib from '../../lib/main.mjs';

const themeController = {};

themeController.index = async (req, res) => {
  try {
    let category_strict_params = { keys: [], values: [] };
    lib.Query.fillParam("category.user_id", req.user.id, category_strict_params);
    let categories = await Category.filter([], [], [], category_strict_params, []);

    for (let i in categories) {
      let variation_strict_params = { keys: [], values: [] };
      lib.Query.fillParam("variation.category_id", categories[i].id, variation_strict_params);
      lib.Query.fillParam("variation.user_id", req.user.id, variation_strict_params);
      let variations = await CategoryVariation.filter([], [], [], variation_strict_params, []);
      if (variations.length) { categories[i].variations = variations; }
    }

    res.render("catalog/theme/index", { user: req.user, categories });
  } catch (err) {
    console.log(err);
    res.send({ msg: "Ocorreu um erro ao carregar suas informações, por favor, recarregue a página." });
  };
};

export default themeController;