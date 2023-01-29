// const User = require('../model/user');
// const userController = require('./user');

const GNAPI = require('../api/gerencianet');

const homeController = {
	index: async (req, res) => {
		const reqGN = await GNAPI({
			clientId: process.env.GN_CLIENT_ID,
			clientSecret: process.env.GN_CLIENT_SECRET
		});

		const dataCob = {
			calendario: {
				expiracao: 3600
			},
			devedor: {
				cpf: '12345678909',
				nome: "Francisco da Silva"
			},
			valor: {
				original: '119.97'
			},
			chave: "596eaf56-e3c0-4f88-8791-355d1bb6dd6e",
			solicitacaoPagador: "Informe o número ou identificador do pedido."
		};

		const cobResponse = await reqGN.post('/v2/cob', dataCob);
		const qrcodeResponse = await reqGN.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`);

		if (req.user) {
			return res.render('home', { user: req.user });
		};
		res.render('index', { user: req.user, qrcodeImage: qrcodeResponse.data.imagemQrcode });
	},
	business: async (req, res) => {
		res.send({ done: 'Email Enviado' });
	},
	login: (req, res) => {
		if (req.user) {
			return res.redirect("/");
		};
		res.render('user/login', { user: req.user, message: req.flash('loginMessage') });
	},
	successfulLogin: (req, res) => {
		res.redirect('/');
	},
	signup: async (req, res) => {
		if (req.user) {
			return res.redirect('/');
		};
		res.render('user/signup', { user: req.user, message: req.flash('signupMessage') });
	},
	successfulSignup: (req, res) => {
		res.redirect('/');
	},
	logout: (req, res) => {
		req.logout();
		res.redirect('/');
	}
};

module.exports = homeController;