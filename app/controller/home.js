const homeController = {};

homeController.index = async (req, res) => {
	if (req.user) {
		return res.render('home', { user: req.user });
	};
	res.render('index', { user: req.user });
};

homeController.business = async (req, res) => {
	res.send({ done: 'Email Enviado' });
};

homeController.login = (req, res) => {
	if (req.user) {
		return res.redirect("/");
	};
	res.render('user/login', { user: req.user, message: req.flash('loginMessage') });
};

homeController.successfulLogin = (req, res) => {
	res.redirect('/');
};

homeController.signup = async (req, res) => {
	if (req.user) {
		return res.redirect('/');
	};
	res.render('user/signup', { user: req.user, message: req.flash('signupMessage') });
};

homeController.successfulSignup = (req, res) => {
	res.redirect('/');
};

homeController.logout = (req, res) => {
	req.logout();
	res.redirect('/');
};

export default homeController;