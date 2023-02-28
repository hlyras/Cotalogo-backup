const User = require('../../model/user');
const userController = require('../user');

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
  catalog.name = req.body.name;
  catalog.url = req.body.url;

  try {
    let response = await catalog.create();
    if (response.err) { return res.send({ msg: response.err }); }

    return res.send({ done: "Catálogo cadastrado com sucesso." });
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
    lib.Query.fillParam('catalog.name', req.body.name, params);
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
    console.log(catalog);
    res.send({ catalog });
  } catch (err) {
    console.log(err);
    res.send({ msg: "Ocorreu um erro ao encontrar o catálogo" })
  }
};

module.exports = catalogController;