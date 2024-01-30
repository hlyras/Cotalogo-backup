Category.variation = {};

Category.variation.save = async (variation) => {
  let response = await fetch("/category/variation/save", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(variation)
  });
  response = await response.json();

  if (API.verifyResponse(response)) { return false };

  return response;
};

Category.variation.filter = async variation => {
  let response = await fetch("/category/variation/filter", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(variation)
  });
  response = await response.json();

  if (API.verifyResponse(response)) { return false };

  return response.variations;
};

Category.variation.delete = async (variation_id) => {
  let response = await fetch("/category/variation/delete/" + variation_id, { method: 'DELETE' });
  response = await response.json();

  if (API.verifyResponse(response)) { return false };

  return response.done;
};