Variation.view = {};

Variation.view.filter = (variations, pagination) => {
	let filter_box = document.getElementById("variation-filter-box");
	let filter_div = document.getElementById("variation-filter-div");
	filter_div.innerHTML = "";

	if(variations.length){
		let div_header = lib.element.create("div", { class: "box b1 container border em07 center" });
		
		div_header.appendChild(lib.element.create("div", { class: "mobile-box b4-5 padding-5 bold noselect" }, "Nome"));
		filter_div.appendChild(div_header);
		for (let i = pagination.page * pagination.pageSize; i < variations.length && i < (pagination.page + 1) * pagination.pageSize; i++){
			let div_variation = lib.element.create("div", { class: "box b1 container box-hover padding-5 margin-top-5 border" });
			
			div_variation.appendChild(lib.element.create("div", { class: "mobile-box b8-10 center" }, variations[i].name));
			div_variation.appendChild(lib.element.icon('b10', 20, "/images/icon/edit.png", "Variation.controller.edit("+variations[i].id+")"));
			div_variation.appendChild(lib.element.icon('b10', 20, "/images/icon/trash.png", "Variation.controller.delete("+variations[i].id+")"));
			filter_div.appendChild(div_variation);
		};
		filter_box.style.display = "";
	} else {
		let div_variation = lib.element.create("div", { class: "box b1 center box-hover padding-5 border" }, "Sem resultados");
		filter_div.appendChild(div_variation);
		filter_box.style.display = "";
	};
};