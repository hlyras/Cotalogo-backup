const UserAccount = {};

UserAccount.cob = {};

UserAccount.cob.create = async dataCob => {
  let response = await fetch("/user/account/cob", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataCob)
  });
  response = await response.json();
  return response;
};