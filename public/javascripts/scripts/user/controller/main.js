User.controller = {};

User.controller.signup = document.getElementById("signup-form");
if(User.controller.signup){
	User.controller.signup.addEventListener("submit", async event => {
		event.preventDefault();

		let user = {
			name: event.target.elements.namedItem("name").value,
			business: event.target.elements.namedItem("business").value,
			email: event.target.elements.namedItem("email").value,
			password: event.target.elements.namedItem("password").value,
			passwordConfirm: event.target.elements.namedItem("password-confirm").value
		};

		let token = await API.response(User.signup, user);
		if(!token) { return false; }

		console.log(token);

		if(token){
			lib.localStorage.update("cotalogo-token", token);
			// lib.localStorage.remove("cotalogo-token");
		}

		let response = await fetch("/workstation", {
			method: "GET",
			headers: {
				'Authorization': "Bearer "+localStorage.getItem('cotalogo-token')
			}
		});
		response = await response.json();

		console.log(response);
	});
}