const User = require('../../model/user');
const userController = require('../user');

const Product = require('../../model/product/main');
Product.image = require('../../model/product/image');
const Category = require('../../model/product/category');
const Variation = require('../../model/product/variation');

const imageController = require('./image');

const lib = require('jarmlib');

const productController = {
	index: async (req, res) => {
		try {
			let category_strict_params = { keys: [], values: [] };
			lib.Query.fillParam("category.user_id", req.user.id, category_strict_params);
			let categories = await Category.filter([], [], [], category_strict_params, []);

			for (let i in categories) {
				let variation_strict_params = { keys: [], values: [] };
				lib.Query.fillParam("variation.category_id", categories[i].id, variation_strict_params);
				lib.Query.fillParam("variation.user_id", req.user.id, variation_strict_params);
				let variations = await Variation.filter([], [], [], variation_strict_params, []);
				if (variations.length) { categories[i].variations = variations; }
			}

			res.render("product/index", { user: req.user, categories });
		} catch (err) {
			console.log(err);
			res.send({ msg: "Ocorreu um erro ao carregar suas informações, por favor, recarregue a página." });
		};
	},
	save: async (req, res) => {
		let product = new Product();
		product.user_id = req.user.id;
		product.id = req.body.id;
		product.code = req.body.code;
		product.name = req.body.name;
		product.description = req.body.description;
		product.variations = req.body.variations;

		try {
			// Verify code duplicity
			if (product.code) {
				let code_strict_params = { keys: [], values: [] };
				lib.Query.fillParam('product.code', product.code, code_strict_params);
				lib.Query.fillParam('product.user_id', req.user.id, code_strict_params);
				let code_response = await Product.filter([], [], [], code_strict_params, []);
				if ((code_response).length) { return res.send({ msg: "O código do produto já está sendo utilizado" }); }
			}


			// Verify if variations belongs to the user
			for (let i in product.variations) {
				let variation_strict_params = { keys: [], values: [] };
				lib.Query.fillParam('variation.user_id', req.user.id, variation_strict_params);
				lib.Query.fillParam('variation.id', product.variations[i], variation_strict_params);
				let variation_response = await Variation.filter([], [], [], variation_strict_params, []);
				if (!(variation_response).length) { return res.send({ unauthorized: "Variações inválidas, tente cadastrar novamente!" }); }
			};


			// Save product
			let save_product_response = await product.save();
			if (save_product_response.err) { return res.send({ msg: save_product_response.err }); }
			product.id = save_product_response.insertId;

			// Save variations
			for (let i in product.variations) {
				let product_variation = {
					user_id: parseInt(req.user.id),
					product_id: parseInt(product.id),
					variation_id: parseInt(product.variations[i])
				};

				product.variation = new Product.variation(product_variation);
				let save_variation_response = await product.variation.save();
				if (save_variation_response.err) { console.log(save_variation_response.err, lib.date.timestamp.toDatetime(lib.date.timestamp.generate())); }
			};

			// Save images
			for (let i in req.files) {
				await imageController.upload(req.files[i], parseInt(save_product_response.insertId));
			};

			res.send({ done: "Produto cadastrado com sucesso!" });
		} catch (err) {
			console.log(err);
			res.send({ msg: "Ocorreu um erro ao cadastrar seu produto, por favor recarregue sua página e tente novamente." });
		}
	},
	filter: async (req, res) => {
		let product = {
			code: req.body.code,
			name: req.body.name,
			variations: []
		};

		// coletar os dados das variações
		let obj = lib.convertTo.object(req.body);
		Object.entries(obj).map(variation => {
			if (lib.string.splitBy(variation[0], '-')[0] == 'variation' && parseInt(variation[1])) {
				product.variations.push(parseInt(variation[1]));
			}
		});

		try {
			// Buscar os produtos por código e nome (propriedades padrões)
			let params = { keys: [], values: [] };
			let strict_params = { keys: [], values: [] };

			lib.Query.fillParam('product.user_id', req.user.id, strict_params);
			lib.Query.fillParam('product.code', product.code, strict_params);
			lib.Query.fillParam('product.name', product.name, params);

			let products_response = await Product.filter([], [], params, strict_params, []);

			// Verificar se os produtos contém todas as variações
			let products = [];
			for (let i in products_response) {
				let variation = { length: 0, response: [] };
				// Buscar as variações que o produto possuir
				for (let j in product.variations) {
					let variation_strict_params = { keys: [], values: [] };
					lib.Query.fillParam('product_variation.user_id', req.user.id, variation_strict_params);
					lib.Query.fillParam('product_variation.product_id', products_response[i].id, variation_strict_params);
					lib.Query.fillParam('product_variation.variation_id', product.variations[j], variation_strict_params);
					variation.response = await Product.variation.filter([], [], [], variation_strict_params, []);
					// Cada varição existente soma 1
					if ((variation.response).length) { variation.length++; };
				};

				let variation_props = [
					"category.id category_id",
					"category.name category_name",
					"variation.id variation_id",
					"variation.name variation_name"
				];

				let variation_inners = [
					["cms_cotalogo.variation variation", "product_variation.variation_id", "variation.id"],
					["cms_cotalogo.category category", "category.id", "variation.category_id"]
				];

				let variation_strict_params = { keys: [], values: [] };

				// busca a categoria e as variações pelo id do produto
				lib.Query.fillParam('product_variation.product_id', products_response[i].id, variation_strict_params);

				products_response[i].variations = await Product.variation.filter(variation_props, variation_inners, [], variation_strict_params, []);

				// Somente incluir o produto na busca caso tenha todas as variações
				if (variation.length == product.variations.length) {
					products.push(products_response[i]);
				}
			};

			res.send({ products });
		} catch (err) {
			console.log(err);
			res.send({ msg: "Ocorreu um erro ao filtrar os produtos" })
		}
	}
};

module.exports = productController;