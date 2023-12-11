const Category = require('../../model/category/main');
Category.variation = require('../../model/category/variation');

const lib = require('jarmlib');

const variationController = {
  index: async (req, res) => {
    res.render("product/variation", { user: req.user });
  },
  save: async (req, res) => {
    let variation = new Category.variation();
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
        let verifyVariation = await Category.variation.filter([], [], [], strict_params, []);

        if (verifyVariation[0].user_id != req.user.id) { return res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" }); }

        let response = await variation.update();
        if (response.err) { return res.send({ msg: response.err }); }

        res.send({ done: "Variação atualizada com sucesso!" });
      }
    } catch (err) {
      console.log(err);
      res.send({ msg: "Ocorreu um erro ao cadastrar a cor, aguarde um momento ou recarregue a página." });
    }
  },
  filter: async (req, res) => {
    let params = { keys: [], values: [] };
    let strict_params = { keys: [], values: [] };

    lib.Query.fillParam('category_variation.id', req.body.id, strict_params);
    lib.Query.fillParam('category_variation.user_id', req.user.id, strict_params);
    lib.Query.fillParam('category_variation.category_id', req.body.category_id, strict_params);
    lib.Query.fillParam('category_variation.name', req.body.name, params);

    try {
      let variations = await Category.variation.filter([], [], params, strict_params, []);
      res.send({ variations });
    } catch (err) {
      console.log(err);
      res.send({ msg: "Ocorreu um erro ao filtrar as variações" })
    }
  },
  delete: async (req, res) => {
    if (!req.user) {
      return res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" });
    };

    let strict_params = { keys: [], values: [] };
    lib.Query.fillParam('category_variation.id', req.params.id, strict_params);
    let verifyVariation = await Category.variation.filter([], [], [], strict_params, []);

    if (verifyVariation[0] && verifyVariation[0].user_id != req.user.id) {
      return res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" });
    }

    try {
      await Category.variation.delete(req.params.id);
      res.send({ done: "Variação excluída com sucesso!" });
    } catch (err) {
      console.log(err);
      res.send({ msg: "Ocorreu um erro ao filtrar as variações" })
    }
  }
};

module.exports = variationController;