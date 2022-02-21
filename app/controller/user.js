const User = require('../model/user');

const JWT = require('jsonwebtoken');

const bcrypt = require('bcrypt-nodejs');

const userController = {
	index: (req, res) => {
		res.render('user/profile', { user: req.user });
	},
	verify: (req, res, next) => {
		if (req.isAuthenticated()){ return next() };
		res.redirect('/login');
	},
	confirmEmail: async (req, res, next) => {
		JWT.verify(req.params.token, 'secretKey', async (err, authData) => {
			if(err) {
				return res.render('user/email-confirmation', { msg: "O código é inválido, tente novamente ou solicite um novo código", user: req.user })
			} else {
				let user = await User.findByToken(req.params.token);
				if(!user.length){ 
					return res.render('user/email-confirmation', { msg: "O código é inválido, tente novamente ou solicite um novo código", user: req.user });
				}

				if(authData.data.user_id == user[0].id){
					await User.confirmEmail(user[0].id);
					await User.destroyToken(req.params.token);
					return res.render('user/email-confirmation', { msg: "Seu Email Foi confirmado com sucesso!", user: req.user })
				} else {
					return res.render('user/email-confirmation', { msg: "O código é inválido, tente novamente ou solicite um novo código", user: req.user });
				}
			}
		});
	},
	authorize: (req, res, next) => {
		if (req.isAuthenticated()){ return next() };
		res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" });
	},
	verifyAccess: async (req, res, access) => {
		if(req.isAuthenticated()){
			for(let i in access){
				if(access[i]==req.user.access){
					return true;
				};
			};
		};
		return false;
	},
	list: async (req, res) => {
		if(!await userController.verifyAccess(req, res, ['dvp','prp','spt','grf','grl','crd'])){
			return res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" });
		};
		try {
			let users = await User.list();
			res.send({ users: users });
		} catch (err) {
			console.log(err);
			res.send({ msg: "Ocorreu um erro ao listar os usuários, favor contatar o suporte." });
		};
	},
	show: async (req, res) => {
		if(!await userController.verifyAccess(req, res, ['dvp','prp','spt','grf','grl','crd'])){
			return res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" });
		};

		try {
			let user = await User.findById(req.body.user_id);
			res.send({ user });
		} catch (err) {
			console.log(err);
			res.send({ msg: "Ocorreu um erro ao mostrar o usuário." });
		};
	},
	updateInfo: async (req, res) => {
		if(!req.isAuthenticated()){
			res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" });
		};

		const user = {
			id: req.user.id,
			email: req.body.user.email
		};

		try {
			if(user.email){
				var row = await User.findByEmail(user.email);
				if(row.length){ return res.send({ msg: "Este e-mail já está cadastrado." })};
			};
			row = await User.updateInfo(user);
			res.send({ done: "Informações atualizadas com sucesso.", user });
		} catch (err) {
			console.log(err);
			res.send({ msg: "Ocorreu um erro ao atualizar suas informações, favor contatar o suporte." });
		};
	},
	updatePassword: async (req, res) => {
		if(!req.isAuthenticated()){
			return res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" });
		};

		let user = {
			id: req.user.id,
			password: bcrypt.hashSync(req.body.user.password, null, null),
			password_confirm: bcrypt.hashSync(req.body.user.password_confirm, null, null),
		}

		if(!req.body.user.password || req.body.user.password.length < 4){ return res.send({ msg: 'Senha inválida.' }); };
		if(req.body.user.password !== req.body.user.password_confirm){ return res.send({ msg: 'As senhas não correspondem.' }); }

		try {
			let row = await User.updatePassword(user);
			res.send({ done: "Senha alterada com sucesso.", user });
		} catch (err) {
			console.log(err);
			res.send({ msg: "Ocorreu um erro ao alterar sua senha, favor contatar o suporte." });
		};
	}
};

module.exports = userController;