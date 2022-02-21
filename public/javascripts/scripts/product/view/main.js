Product.view = {};

Product.view.filter = (products, pagination) => {
	let filter_box = document.getElementById("product-filter-box");
	let filter_div = document.getElementById("product-filter-div");
	filter_div.innerHTML = "";

	if(products.length){
		let div_header = lib.element.create("div", { class: "box b1 container border em07 center" });
		
		div_header.appendChild(lib.element.create("div", { class: "mobile-box b10" }));
		div_header.appendChild(lib.element.create("div", { class: "mobile-box b7-10 padding-5" }, "Nome"));
		filter_div.appendChild(div_header);
		for (let i = pagination.page * pagination.pageSize; i < products.length && i < (pagination.page + 1) * pagination.pageSize; i++){
			let div_product = lib.element.create("div", { class: "box b1 container box-hover padding-5 margin-top-5 border" });
			
			div_product.appendChild(lib.element.create("div", { 
				class: "mobile-box b5 em11 lucida-grande input-show border-st-2 bold nowrap center pointer noselect",
				onclick: "Product.controller.show("+products[i].id+")" 
			}, products[i].code || 'S/C'));
			div_product.appendChild(lib.element.create("div", { class: "mobile-box b6-10 center" }, products[i].name));
			div_product.appendChild(lib.element.icon('b10', 20, "/images/icon/edit.png", "Product.controller.edit("+products[i].id+")"));
			div_product.appendChild(lib.element.icon('b10', 20, "/images/icon/trash.png", "Product.controller.delete("+products[i].id+")"));
			filter_div.appendChild(div_product);
		};
		filter_box.style.display = "";
	} else {
		let div_product = lib.element.create("div", { class: "box b1 center box-hover padding-5 border" }, "Sem resultados");
		filter_div.appendChild(div_product);
		filter_box.style.display = "";
	};
};