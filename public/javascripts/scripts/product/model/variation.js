const Variation = {};

Variation.save = async (variation) => {
	let response = await fetch("/product/variation/save", {
		method: "POST",
		headers: {'Content-Type': 'application/json'},
	    body: JSON.stringify(variation)
	});
	response = await response.json();

	if(API.verifyResponse(response)){ return false };
	alert(response.done);

	return response;
};

Variation.filter = async variation => {
	let response = await fetch("/product/variation/filter", {
		method: "POST",
		headers: {'Content-Type': 'application/json'},
	    body: JSON.stringify(variation)
	});
	response = await response.json();

	if(API.verifyResponse(response)){ return false };

	return response.variations;
};

Variation.delete = async (variation_id) => {
	let response = await fetch("/product/variation/delete/"+variation_id, { method: 'DELETE' });
	response = await response.json();

	if(API.verifyResponse(response)){ return false };
	alert(response.done);
	
	return true;
};