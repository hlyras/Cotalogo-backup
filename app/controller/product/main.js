const User = require('../../model/user');
const userController = require('../user');

const Product = require('../../model/product/main');
Product.image = require('../../model/product/image');
const Category = require('../../model/product/category');
const Variation = require('../../model/product/variation');

const imageController = require('./image');

const lib = require('jarmlib');

const productController = {};

productController.index = async (req, res) => {
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
};

productController.save = async (req, res) => {
	let product = new Product();
	product.user_id = req.user.id;
	product.id = req.body.id;
	product.code = req.body.code;
	product.name = req.body.name;
	product.description = req.body.description;
	product.variations = [...req.body.variations] || [];

	try {
		if (!product.id) {
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
				await product.variation.save();
			};

			// Save images
			for (let i in req.files) {
				await imageController.upload(req.user.id, req.files[i], parseInt(save_product_response.insertId));
			};

			res.send({ done: "Produto cadastrado com sucesso!" });
		} else {
			// Verify code duplicity or code update
			let code_strict_params = { keys: [], values: [] };
			lib.Query.fillParam('product.code', product.code, code_strict_params);
			lib.Query.fillParam('product.user_id', req.user.id, code_strict_params);
			let code_response = await Product.filter([], [], [], code_strict_params, []);
			if (code_response[0] && code_response[0].id != product.id) { return res.send({ msg: "Este código está sendo utilizado por outro produto." }); }

			// Verify if variations belongs to the user
			for (let i in product.variations) {
				let variation_strict_params = { keys: [], values: [] };
				lib.Query.fillParam('variation.user_id', req.user.id, variation_strict_params);
				lib.Query.fillParam('variation.id', product.variations[i], variation_strict_params);
				let variation_response = await Variation.filter([], [], [], variation_strict_params, []);
				if (!(variation_response).length) { return res.send({ msg: "Variações inválidas, tente cadastrar novamente!" }); }
			};

			let product_variations_strict_params = { keys: [], values: [] };
			lib.Query.fillParam('product_variation.user_id', req.user.id, product_variations_strict_params);
			lib.Query.fillParam('product_variation.product_id', product.id, product_variations_strict_params);
			let variations_response = await Product.variation.filter([], [], [], product_variations_strict_params, []);
			let product_variations = variations_response.map(variation => variation.variation_id);

			let newVar = product.variations.reduce((newVar, variation_id) => {
				for (let i in product_variations) {
					if (product_variations[i] == variation_id) { return newVar; }
				};

				newVar.push({ variation_id: variation_id, product_id: product.id });
				return newVar;
			}, []);

			let remVar = product_variations.reduce((remVar, variation_id) => {
				for (let i in product.variations) {
					if (product.variations[i] == variation_id) { return remVar; }
				};

				remVar.push({ variation_id: variation_id, product_id: product.id });
				return remVar;
			}, []);

			newVar.forEach(async variation => {
				let product_variation = {
					user_id: parseInt(req.user.id),
					product_id: parseInt(variation.product_id),
					variation_id: parseInt(variation.variation_id)
				};

				product.variation = new Product.variation(product_variation);
				variation.variation_id && await product.variation.save();
			});

			remVar.forEach(async variation => {
				await Product.variation.delete(variation.variation_id, variation.product_id);
			});

			// Save images
			for (let i in req.files) {
				await imageController.upload(req.user.id, req.files[i], parseInt(product.id));
			};

			// Save product
			let update_product_response = await product.update();
			if (update_product_response.err) { return res.send({ msg: update_product_response.err }); }

			res.send({ done: "Produto atualizado com sucesso!" });
		}
	} catch (err) {
		console.log(err);
		res.send({ msg: "Ocorreu um erro ao cadastrar seu produto, por favor recarregue sua página e tente novamente." });
	}
};

productController.filter = async (req, res) => {
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

		console.log(product);

		lib.Query.fillParam('product.user_id', req.user.id, strict_params);
		lib.Query.fillParam('product.code', product.code, params);
		lib.Query.fillParam('product.name', product.name, params);

		let products_response = await Product.filter([], [], params, strict_params, []);

		console.log(products_response);

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
				products_response[i].images = await Product.image.findByProductId(products_response[i].id);
				products.push(products_response[i]);
			}
		};

		res.send({ products });
	} catch (err) {
		console.log(err);
		res.send({ msg: "Ocorreu um erro ao filtrar os produtos" })
	}
};

productController.findById = async (req, res) => {
	let strict_params = { keys: [], values: [] };
	lib.Query.fillParam('product.id', req.params.id, strict_params);
	lib.Query.fillParam('product.user_id', req.user.id, strict_params);
	let product = (await Product.filter([], [], [], strict_params, []))[0];

	if (!product) { product = []; }

	let variation_inners = [["cms_cotalogo.variation", "variation.id", "product_variation.variation_id"]];
	let variation_strict_params = { keys: [], values: [] };
	lib.Query.fillParam('product_variation.user_id', req.user.id, variation_strict_params);
	lib.Query.fillParam('product_variation.product_id', req.params.id, variation_strict_params);
	product.variations = await Product.variation.filter([], variation_inners, [], variation_strict_params, []);

	product.images = await Product.image.findByProductId(req.params.id);

	res.send({ product });
};

module.exports = productController;