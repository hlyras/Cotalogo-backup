const CategoryType = {};

CategoryType.filter = async category_type => {
  let response = await fetch("/category/type/filter", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category_type)
  });
  response = await response.json();

  if (API.verifyResponse(response)) { return false };

  return response.category_types;
};