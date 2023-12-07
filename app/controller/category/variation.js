import CategoryVariation from '../../model/category/variation.js';

import lib from '../../lib/main.js';

const variationController = {};

variationController.index = async (req, res) => {
  res.render("product/variation", { user: req.user });
};

variationController.save = async (req, res) => {
  let variation = new CategoryVariation();
  variation.id = req.body.id;
  variation.user_id = req.user.id;
  variation.category_id = req.body.category_id;
  variation.name = req.body.name;

  try {
    if (!variation.id) {
      let response = await variation.save();
      if (response.err) { return res.send({ msg: response.err }); }

      res.send({ done: "Variação cadastrada com sucesso!" })
    } else {
      let strict_params = { keys: [], values: [] };
      lib.Query.fillParam('category_variation.id', variation.id, strict_params);
      let verifyVariation = await CategoryVariation.filter([], [], [], strict_params, []);

      if (verifyVariation[0].user_id != req.user.id) { return res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" }); }

      let response = await variation.update();
      if (response.err) { return res.send({ msg: response.err }); }

      res.send({ done: "Variação atualizada com sucesso!" });
    }
  } catch (err) {
    console.log(err);
    res.send({ msg: "Ocorreu um erro ao cadastrar a cor, aguarde um momento ou recarregue a página." });
  }
};

variationController.filter = async (req, res) => {
  let params = { keys: [], values: [] };
  let strict_params = { keys: [], values: [] };

  lib.Query.fillParam('category_variation.id', req.body.id, strict_params);
  lib.Query.fillParam('category_variation.user_id', req.user.id, strict_params);
  lib.Query.fillParam('category_variation.category_id', req.body.category_id, strict_params);
  lib.Query.fillParam('category_variation.name', req.body.name, params);

  try {
    let variations = await CategoryVariation.filter([], [], params, strict_params, []);
    res.send({ variations });
  } catch (err) {
    console.log(err);
    res.send({ msg: "Ocorreu um erro ao filtrar as variações" })
  }
};

variationController.delete = async (req, res) => {
  if (!req.user) {
    return res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" });
  };

  let strict_params = { keys: [], values: [] };
  lib.Query.fillParam('category_variation.id', req.params.id, strict_params);
  let verifyVariation = await CategoryVariation.filter([], [], [], strict_params, []);

  if (verifyVariation[0] && verifyVariation[0].user_id != req.user.id) {
    return res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" });
  }

  try {
    await CategoryVariation.delete(req.params.id);
    res.send({ done: "Variação excluída com sucesso!" });
  } catch (err) {
    console.log(err);
    res.send({ msg: "Ocorreu um erro ao filtrar as variações" })
  }
};

export default variationController;