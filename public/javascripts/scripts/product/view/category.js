Category.view = {};

Category.view.filter = (categories, pagination) => {
	let filter_box = document.getElementById("category-filter-box");
	let filter_div = document.getElementById("category-filter-div");
	filter_div.innerHTML = "";

	if(categories.length){
		let div_header = lib.element.create("div", { class: "box b1 container border em07 center" });
		
		div_header.appendChild(lib.element.create("div", { class: "mobile-box b10" }));
		div_header.appendChild(lib.element.create("div", { class: "mobile-box b7-10 padding-5 bold noselect" }, "Nome"));
		filter_div.appendChild(div_header);
		for (let i = pagination.page * pagination.pageSize; i < categories.length && i < (pagination.page + 1) * pagination.pageSize; i++){
			let div_category = lib.element.create("div", { class: "box b1 container box-hover padding-5 margin-top-5 border" });
			
			div_category.appendChild(lib.element.icon('10', 20, "/images/icon/open.png", "Category.controller.show("+categories[i].id+")"));
			div_category.appendChild(lib.element.create("div", { class: "mobile-box b7-10 center" }, categories[i].name));
			div_category.appendChild(lib.element.icon('b10', 20, "/images/icon/edit.png", "Category.controller.edit("+categories[i].id+")"));
			div_category.appendChild(lib.element.icon('b10', 20, "/images/icon/trash.png", "Category.controller.delete("+categories[i].id+")"));
			filter_div.appendChild(div_category);
		};
		filter_box.style.display = "";
	} else {
		let div_category = lib.element.create("div", { class: "box b1 center box-hover padding-5 border" }, "Sem resultados");
		filter_div.appendChild(div_category);
		filter_box.style.display = "";
	};
};

Category.view.show = (category) => {
	let variation_create_title = document.getElementById("category-create-title");
	variation_create_title.innerHTML = "";
	variation_create_title.appendChild(lib.element.create("div", { class: "mobile-box b9-10" }, "Cadastrar "+category.name));
	variation_create_title.appendChild(lib.element.icon('b10', 20, "/images/icon/expand.png", "lib.displayDiv('variation-create-form', this, '/images/icon/expand.png', '/images/icon/retract.png');"));
	document.getElementById("variation-create-form").elements.namedItem("category-id").value = category.id;

	let variation_filter_title = document.getElementById("category-filter-title");
	variation_filter_title.innerHTML = "";
	variation_filter_title.appendChild(lib.element.create("div", { class: "mobile-box b9-10" }, "Buscar "+category.name));
	variation_filter_title.appendChild(lib.element.icon('b10', 20, "/images/icon/retract.png", "lib.displayDiv('variation-filter-form', this, '/images/icon/expand.png', '/images/icon/retract.png');"));
	document.getElementById("variation-filter-form").elements.namedItem("category-id").value = category.id;

	Variation.controller.filter.submit.click();
};