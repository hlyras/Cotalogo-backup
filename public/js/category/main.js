const Category = {};

Category.save = async (category) => {
  let response = await fetch("/category/save", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  });
  response = await response.json();

  if (API.verifyResponse(response)) { return false };

  return response;
};

Category.update = async (category) => {
  let response = await fetch("/category/update", {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  });
  response = await response.json();

  if (API.verifyResponse(response)) { return false };

  return response;
};

Category.filter = async category => {
  let response = await fetch("/category/filter", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  });
  response = await response.json();

  if (API.verifyResponse(response)) { return false };

  return response.categories;
};

Category.delete = async (category_id) => {
  let response = await fetch("/category/delete/" + category_id, { method: 'DELETE' });
  response = await response.json();

  if (API.verifyResponse(response)) { return false };
  alert(response.done);

  return true;
};