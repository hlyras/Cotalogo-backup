const User = require('../../model/user');
const userController = require('../user');

const Variation = require('../../model/product/variation');

const lib = require('jarmlib');

const variationController = {
	index: async (req, res) => {
		res.render("product/variation", { user: req.user });
	},
	save: async (req, res) => {
		let variation = new Variation(req.body);
		variation.user_id = req.user.id;

		console.log(variation);

		try{
			if (!variation.id) {
				let response = await variation.save();
	      if(response.err){ return res.send({ msg: response.err }); }

      	res.send({ done: "Variação cadastrada com sucesso!" })
			} else {
				let strict_params = { keys: [], values: [] };
				lib.Query.fillParam('variation.id', variation.id, strict_params);
				let verifyVariation = await Variation.filter([],[],[],strict_params,[])
				
				if(verifyVariation[0].user_id != req.user.id){ return res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" }); }
				
				let response = await variation.update();
	      if(response.err){ return res.send({ msg: response.err }); }
      	
      	res.send({ done: "Variação atualizada com sucesso!" });
			}
		} catch(err) {
			console.log(err);
			res.send({ msg: "Ocorreu um erro ao cadastrar a cor, aguarde um momento ou recarregue a página." });
		}
	},
	filter: async (req, res) => {
		let params = { keys: [], values: [] };
		let strict_params = { keys: [], values: [] };

		lib.Query.fillParam('variation.id', req.body.id, strict_params);
		lib.Query.fillParam('variation.user_id', req.user.id, strict_params);
		lib.Query.fillParam('variation.category_id', req.body.category_id, strict_params);
		lib.Query.fillParam('variation.name', req.body.name, params);

		try {
			let variations = await Variation.filter([],[],params,strict_params,[]);
			res.send({variations});
		} catch (err) {
			console.log(err);
			res.send({ msg: "Ocorreu um erro ao filtrar as variações" })
		}
	},
	delete: async (req, res) => {
		let strict_params = { keys: [], values: [] };
		lib.Query.fillParam('variation.id', req.params.id, strict_params);
		let verifyVariation = await Variation.filter([],[],[],strict_params,[])
		
		if(verifyVariation[0].user_id != req.user.id){ return res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" }); }

		try {
			await Variation.delete(req.params.id);
			res.send({ done: "Variação excluída com sucesso!" });
		} catch (err) {
			console.log(err);
			res.send({ msg: "Ocorreu um erro ao filtrar as variações" })
		}
	},
};

module.exports = variationController;