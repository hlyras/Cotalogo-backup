const Catalog = {};

Catalog.create = async (catalog) => {
  let response = await fetch("/catalog/create", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(catalog)
  });
  response = await response.json();

  if (API.verifyResponse(response)) { return false };

  return response;
};

Catalog.filter = async catalog => {
  let response = await fetch("/catalog/filter", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(catalog)
  });
  response = await response.json();

  if (API.verifyResponse(response)) { return false };

  return response.catalogs;
};

Catalog.findById = async (id) => {
  let response = await fetch(`/catalog/id/${id}`);
  response = await response.json();

  if (API.verifyResponse(response)) { return false };

  return response.catalog;
};