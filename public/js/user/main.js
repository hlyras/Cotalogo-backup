const User = {};

User.signup = async user => {
  let response = await fetch("/user/signup", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  response = await response.json();
  return response;
};