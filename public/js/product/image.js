Product.image = {};

Product.image.upload = async (data) => {
  let response = await fetch("/product/image/upload", {
    method: "POST",
    body: data
  });
  response = await response.json();

  if (API.verifyResponse(response)) { return false };

  return response;
};

Product.image.list = async () => {
  let response = await fetch("product/image/list");
  response = await response.json();

  if (API.verifyResponse(response)) { return false; };

  return response;
};

Product.image.delete = async (id) => {
  let response = await fetch(`/product/image/id/${id}`, { method: 'DELETE' });
  response = await response.json();

  if (API.verifyResponse(response)) { return false };

  return true;
};