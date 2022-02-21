const User = require('../../model/user');
const userController = require('../user');

const Category = require('../../model/product/category');

const lib = require('jarmlib');

const categoryController = {
	index: async (req, res) => {
		res.render("product/category", { user: req.user });
	},
	save: async (req, res) => {
		let category = new Category(req.body);
		category.user_id = req.user.id;

		try{
			if (!category.id) {
				let response = await category.save();
	      if(response.err){ return res.send({ msg: response.err }); }

      	res.send({ done: "Categoria cadastrada com sucesso!" })
			} else {
				let strict_params = { keys: [], values: [] };
				lib.Query.fillParam('category.id', category.id, strict_params);
				let verifyCategory = await Category.filter([],[],[],strict_params,[])
				
				if(verifyCategory[0].user_id != req.user.id){ return res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" }); }
				
				let response = await category.update();
	      if(response.err){ return res.send({ msg: response.err }); }
      	
      	res.send({ done: "Categoria atualizada com sucesso!" })
			}
		} catch(err) {
			console.log(err);
			res.send({ msg: "Ocorreu um erro ao cadastrar a cor, aguarde um momento ou recarregue a página." });
		}
	},
	filter: async (req, res) => {
		let params = { keys: [], values: [] };
		let strict_params = { keys: [], values: [] };

		lib.Query.fillParam('category.id', req.body.id, strict_params);
		lib.Query.fillParam('category.user_id', req.user.id, strict_params);
		lib.Query.fillParam('category.name', req.body.name, params);

		try {
			let categories = await Category.filter([],[],params,strict_params,[]);
			res.send({categories});
		} catch (err) {
			console.log(err);
			res.send({ msg: "Ocorreu um erro ao filtrar as variações" })
		}
	},
	delete: async (req, res) => {
		let strict_params = { keys: [], values: [] };
		lib.Query.fillParam('category.id', req.params.id, strict_params);
		let verifyCategory = await Category.filter([],[],[],strict_params,[])
		
		if(verifyCategory[0].user_id != req.user.id){ return res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" }); }

		try {
			await Category.delete(req.params.id);
			res.send({ done: "Categoria excluída com sucesso!" });
		} catch (err) {
			console.log(err);
			res.send({ msg: "Ocorreu um erro ao filtrar as variações" })
		}
	},
};

module.exports = categoryController;