const Catalog = require('../../model/catalog/main');

const lib = require('jarmlib');

const catalogController = {};

catalogController.index = async (req, res) => {
  try {
    res.render("catalog/index", { user: req.user });
  } catch (err) {
    console.log(err);
    res.send({ msg: "Ocorreu um erro ao carregar suas informações, por favor, recarregue a página." });
  };
};

catalogController.create = async (req, res) => {
  const catalog = new Catalog();
  catalog.id = req.body.id;
  catalog.user_id = req.user.id;
  catalog.url = req.body.url;

  if (catalog.url.length < 2) { return res.send({ msg: "O link precisa ter mais de duas letras ou caracteres." }); }
  if (lib.string.hasForbidden(catalog.url.slice(1))) { return res.send({ msg: "Não é permitido utilizar estes caracteres." }); }

  try {
    let strict_params = { keys: [], values: [] };
    lib.Query.fillParam('catalog.user_id', req.user.id, strict_params);
    lib.Query.fillParam('catalog.url', req.body.url, strict_params);
    let catalogs = await Catalog.filter([], [], [], strict_params, []);

    if (!catalog.id) {
      if (catalogs.length) { return res.send({ msg: "Você já utilizou essa URL em outro catálogo" }); }

      let response = await catalog.create();
      if (response.err) { return res.send({ msg: response.err }); }

      return res.send({ done: "Catálogo cadastrado com sucesso." });
    } else {
      // Filtrar o catálogo com esse id e verifica se pertence ao usuário
      let catalog_response = (await Catalog.findById(catalog.id))[0];

      if (catalog_response.user_id != catalog.user_id) {
        return res.send({ msg: "Você não tem permissão para atualizar o catálogo." });
      } else {
        if (catalogs.length && catalogs[0].id != catalog_response.id) { return res.send({ msg: "Você já utilizou essa URL em outro catálogo" }); }
      }

      let response = await catalog.update();
      if (response.err) { return res.send({ msg: response.err }); }

      return res.send({ done: "Catálogo atualizado com sucesso." });
    }
  } catch (err) {
    console.log(err);
    res.send({ msg: "Ocorreu um erro ao cadastrar o produto, por favor recarregue a página." });
  };
};

catalogController.filter = async (req, res) => {
  try {
    let params = { keys: [], values: [] };
    let strict_params = { keys: [], values: [] };
    lib.Query.fillParam('catalog.user_id', req.user.id, strict_params);
    lib.Query.fillParam('catalog.url', req.body.url, params);
    let catalogs = await Catalog.filter([], [], params, strict_params, []);

    res.send({ catalogs });
  } catch (err) {
    console.log(err);
    res.send({ msg: "Ocorreu um erro ao filtrar os catálogos" })
  }
};

catalogController.findById = async (req, res) => {
  try {
    let catalog = (await Catalog.findById(req.params.id))[0];
    res.send({ catalog });
  } catch (err) {
    console.log(err);
    res.send({ msg: "Ocorreu um erro ao encontrar o catálogo" })
  }
};

module.exports = catalogController;