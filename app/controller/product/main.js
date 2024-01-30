const Product = require('../../model/product/main');
Product.image = require('../../model/product/image');

const Category = require('../../model/category/main');
Category.variation = require('../../model/category/variation');

const imageController = require('./image');

const lib = require('jarmlib');

const productController = {};

productController.index = async (req, res) => {
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

			lib.Query.fillParam("category_variation.category_id", categories[i].id, variation_options.strict_params);
			lib.Query.fillParam("category_variation.user_id", req.user.id, variation_options.strict_params);
			let variations = await Category.variation.filter(variation_options);
			if (variations.length) { categories[i].variations = variations; }
		}

		res.render("product/index", { user: req.user, categories });
	} catch (err) {
		console.log(err);
		res.send({ msg: "Ocorreu um erro ao carregar suas informações, por favor, recarregue a página." });
	};
};

productController.create = async (req, res) => {
	let product = new Product();
	product.user_id = req.user.id;
	product.id = req.body.id;
	product.code = req.body.code;
	product.name = req.body.name;
	product.description = req.body.description;
	product.variations = req.body.variations.length > 1 ? [...req.body.variations] : [product.variations];

	console.log(req.body.variations.length);
	console.log(req.body);
	console.log(product);
	console.log(product.variations);

	try {
		if (!product.id) {
			// Verify code duplicity
			if (product.code) {
				let code_options = {
					strict_params: { keys: [], values: [] },
				};

				lib.Query.fillParam('product.code', product.code, code_options.strict_params);
				lib.Query.fillParam('product.user_id', req.user.id, code_options.strict_params);

				let code_response = await Product.filter(code_options);
				if ((code_response).length) { return res.send({ msg: "O código do produto já está sendo utilizado" }); }
			}

			// Verify if variations belongs to the user
			for (let i in product.variations) {
				let variation_options = {
					strict_params: { keys: [], values: [] },
				};

				lib.Query.fillParam('category_variation.user_id', req.user.id, variation_options.strict_params);
				lib.Query.fillParam('category_variation.id', product.variations[i], variation_options.strict_params);

				let variation_response = await Category.variation.filter(variation_options);
				if (!(variation_response).length) { return res.send({ unauthorized: "Variações inválidas, tente cadastrar novamente!" }); }
			};

			// Save product
			let create_product_response = await product.create();
			if (create_product_response.err) { return res.send({ msg: create_product_response.err }); }
			product.id = create_product_response.insertId;

			// Save variations
			for (let i in product.variations) {
				let product_variation = {
					user_id: req.user.id,
					product_id: product.id,
					variation_id: product.variations[i]
				};

				product.variation = new Product.variation(product_variation);
				await product.variation.save();
			};

			// Save images
			for (let i in req.files) {
				await imageController.upload(req.user.id, req.files[i], product.id);
			};

			res.send({ done: "Produto cadastrado com sucesso!" });
		} else {
			// Verify code duplicity or code update
			let code_options = {
				strict_params: { keys: [], values: [] },
			};

			lib.Query.fillParam('product.code', product.code, code_options.strict_params);
			lib.Query.fillParam('product.user_id', req.user.id, code_options.strict_params);

			let code_response = await Product.filter(code_options);
			if (code_response[0] && code_response[0].id != product.id) {
				return res.send({ msg: "Este código está sendo utilizado por outro produto." });
			}

			// Verify if variations belongs to the user
			for (let i in product.variations) {
				let variation_options = {
					strict_params: { keys: [], values: [] },
				};

				lib.Query.fillParam('category_variation.user_id', req.user.id, variation_options.strict_params);
				lib.Query.fillParam('category_variation.id', product.variations[i], variation_options.strict_params);

				let variation_response = await Category.variation.filter(variation_options);
				if (!(variation_response).length) { return res.send({ unauthorized: "Variações inválidas, tente cadastrar novamente!" }); }
			};

			// Product Variation ??
			let product_variation_options = {
				strict_params: { keys: [], values: [] },
			};

			lib.Query.fillParam('product_variation.user_id', req.user.id, product_variation_options.strict_params);
			lib.Query.fillParam('product_variation.product_id', product.id, product_variation_options.strict_params);

			let variations_response = await Product.variation.filter(product_variation_options);
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
					user_id: req.user.id,
					product_id: variation.product_id,
					variation_id: variation.variation_id
				};

				product.variation = new Product.variation(product_variation);
				variation.variation_id && await product.variation.create();
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

		let products_response = await Product.filter({ params, strict_params });

		// Verificar se os produtos contém todas as variações
		let products = [];
		for (let i in products_response) {
			let variation = { length: 0, response: [] };
			// Buscar as variações que o produto possuir
			for (let j in product.variations) {
				let variation_options = {
					strict_params: { keys: [], values: [] },
				};

				lib.Query.fillParam('product_variation.user_id', req.user.id, variation_options.strict_params);
				lib.Query.fillParam('product_variation.product_id', products_response[i].id, variation_options.strict_params);
				lib.Query.fillParam('product_variation.variation_id', product.variations[j], variation_options.strict_params);

				variation.response = await Product.variation.filter(variation_options);

				// Cada varição existente soma 1
				if ((variation.response).length) { variation.length++; };
			};

			let variation_options = {
				props: [
					"category.id category_id",
					"category.name category_name",
					"category_variation.id variation_id",
					"category_variation.name variation_name"
				],
				inners: [
					["cms_cotalogo.category_variation", "product_variation.variation_id", "category_variation.id"],
					["cms_cotalogo.category", "category.id", "category_variation.category_id"]
				],
				strict_params: { keys: [], values: [] },
			};

			// busca a categoria e as variações pelo id do produto
			lib.Query.fillParam('product_variation.product_id', products_response[i].id, variation_options.strict_params);

			products_response[i].variations = await Product.variation.filter(variation_options);

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
	let product = (await Product.filter({ strict_params }))[0];

	if (!product) { product = []; }

	let variation_options = {
		inners: [["cms_cotalogo.variation", "variation.id", "product_variation.variation_id"]],
		strict_params: { keys: [], values: [] },
	};

	lib.Query.fillParam('product_variation.user_id', req.user.id, variation_options.strict_params);
	lib.Query.fillParam('product_variation.product_id', req.params.id, variation_options.strict_params);

	product.variations = await Product.variation.filter(variation_options);

	product.images = await Product.image.findByProductId(req.params.id);

	res.send({ product });
};

module.exports = productController;