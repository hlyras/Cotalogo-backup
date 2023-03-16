Catalog.product = {};

Catalog.product.insert = async (product) => {
  let response = await fetch("/catalog/product/insert", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  response = await response.json();

  if (API.verifyResponse(response)) { return false };

  return response;
};

Catalog.product.filter = async (product) => {
  let response = await fetch("/catalog/product/filter", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  response = await response.json();

  if (API.verifyResponse(response)) { return false };

  return response.products;
};