Product.controller = {};

Product.controller.create = document.getElementById("product-create-form");
if(Product.controller.create){
	Product.controller.create.addEventListener("submit", async event => {
		event.preventDefault();

		let product = {};

		for(let i in event.target.elements) {
			if(event.target.elements[event.target.elements[i].name]){
				product[event.target.elements[i].name] = event.target.elements[event.target.elements[i].name].value;
			}
		}

		delete product.item;
		delete product.namedItem;
		delete product.submit;

		let response = await API.response(Product.save, product);
		if(!response) { return false; }

		Object.entries(product).map(property => { event.target.elements.namedItem(property[0]).value = ""; });

		Product.controller.filter.submit.click();
	});
}

Product.controller.filter = document.getElementById("product-filter-form");
if(Product.controller.filter){
	Product.controller.filter.addEventListener("submit", async event => {
		event.preventDefault();

		let product = {};

		for(let i in event.target.elements) {
			if(event.target.elements[event.target.elements[i].name]){
				product[event.target.elements[i].name] = event.target.elements[event.target.elements[i].name].value;
			}
		}

		delete product.item;
		delete product.namedItem;
		delete product.submit;

		let products = await API.response(Product.filter, product);
		if(!products) { return false; }

		lib.display("product-show-box", 'none');

		const pagination = { pageSize: 10, page: 0 };
		(function(){ lib.carousel.execute("product-filter-box", Product.view.filter, products, pagination); }());
	});
}