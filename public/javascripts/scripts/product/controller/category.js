Category.controller = {};

Category.controller.create = document.getElementById("category-create-form");
if(Category.controller.create){
	Category.controller.create.addEventListener("submit", async event => {
		event.preventDefault();

		let category = {
			id: event.target.elements.namedItem("id").value,
			name: event.target.elements.namedItem("name").value
		};

		let response = await API.response(Category.save, category);
		if(!response) { return false; }

		event.target.elements.namedItem("name").value = "";

		Category.controller.filter.submit.click();
	});
}

Category.controller.filter = document.getElementById("category-filter-form");
if(Category.controller.filter){
	Category.controller.filter.addEventListener("submit", async event => {
		event.preventDefault();

		let category = {
			name: event.target.elements.namedItem("name").value
		};

		let categories = await API.response(Category.filter, category);
		if(!categories) { return false; }

		lib.display("category-show-box", 'none');

		const pagination = { pageSize: 10, page: 0 };
		(function(){ lib.carousel.execute("category-filter-box", Category.view.filter, categories, pagination); }());
	});
}

Category.controller.show = async (category_id) => {
	let category = await API.response(Category.filter, { id: category_id });
	if(!category) { return false; }

	let variations = await API.response(Variation.filter, { category_id });
	if(!variations) { return false; }

	category[0].variations = variations;

	Category.view.show(category[0]);

	lib.display("category-show-box", '');
	lib.display("variation-create-form", 'none');
};

Category.controller.edit = async (category_id) => {
	let category = await API.response(Category.filter, { id: category_id });
	if(!category) { return false; }

	document.getElementById("category-create-form").elements.namedItem("id").value = category[0].id;
	document.getElementById("category-create-form").elements.namedItem("name").value = category[0].name;

	lib.display("category-show-box", 'none');
};

Category.controller.delete = async (category_id) => {
	let r = confirm('Deseja realmente excluir a variação?');
	if(r){
		if(!await API.response(Category.delete, category_id)){ return false; };
		Category.controller.filter.submit.click();			
	}
};