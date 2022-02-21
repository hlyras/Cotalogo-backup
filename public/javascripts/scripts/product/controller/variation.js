Variation.controller = {};

Variation.controller.create = document.getElementById("variation-create-form");
if(Variation.controller.create){
	Variation.controller.create.addEventListener("submit", async event => {
		event.preventDefault();

		let variation = {
			id: event.target.elements.namedItem("id").value,
			category_id: event.target.elements.namedItem("category-id").value,
			name: event.target.elements.namedItem("name").value
		};

		let response = await API.response(Variation.save, variation);
		if(!response) { return false; }

		event.target.elements.namedItem("id").value = "";
		event.target.elements.namedItem("name").value = "";

		Variation.controller.filter.submit.click();
	});
}

Variation.controller.filter = document.getElementById("variation-filter-form");
if(Variation.controller.filter){
	Variation.controller.filter.addEventListener("submit", async event => {
		event.preventDefault();

		let variation = {
			name: event.target.elements.namedItem("name").value,
			category_id: event.target.elements.namedItem("category-id").value
		};

		let variations = await API.response(Variation.filter, variation);
		if(!variations) { return false; }

		const pagination = { pageSize: 10, page: 0 };
		(function(){ lib.carousel.execute("variation-filter-box", Variation.view.filter, variations, pagination); }());
	});
}

Variation.controller.edit = async (variation_id) => {
	let variation = await API.response(Variation.filter, { id: variation_id });
	if(!variation) { return false; }

	document.getElementById("variation-create-form").elements.namedItem("id").value = variation[0].id;
	document.getElementById("variation-create-form").elements.namedItem("name").value = variation[0].name;

	lib.display("variation-create-form", '');
};

Variation.controller.delete = async (variation_id) => {
	let r = confirm('Deseja realmente excluir a variação?');
	if(r){
		if(!await API.response(Variation.delete, variation_id)){ return false; };
		Variation.controller.filter.submit.click();
	}
};