import { findByToken, confirmEmail as _confirmEmail, destroyToken, list as _list, findById, findByEmail, updateInfo as _updateInfo, updatePassword as _updatePassword } from '../model/user';

import { verify as _verify } from 'jsonwebtoken';

import { hashSync } from 'bcrypt-nodejs';

const userController = {
	index: (req, res) => {
		res.render('user/profile', { user: req.user });
	},
	verify: (req, res, next) => {
		if (req.isAuthenticated()) { return next() };
		res.redirect('/login');
	},
	confirmEmail: async (req, res, next) => {
		_verify(req.params.token, 'secretKey', async (err, authData) => {
			if (err) {
				return res.render('user/email-confirmation', { msg: "O código é inválido, tente novamente ou solicite um novo código", user: req.user })
			} else {
				let user = await findByToken(req.params.token);
				if (!user.length) {
					return res.render('user/email-confirmation', { msg: "O código é inválido, tente novamente ou solicite um novo código", user: req.user });
				}

				if (authData.data.user_id == user[0].id) {
					await _confirmEmail(user[0].id);
					await destroyToken(req.params.token);
					return res.render('user/email-confirmation', { msg: "Seu Email Foi confirmado com sucesso!", user: req.user })
				} else {
					return res.render('user/email-confirmation', { msg: "O código é inválido, tente novamente ou solicite um novo código", user: req.user });
				}
			}
		});
	},
	authorize: (req, res, next) => {
		if (req.isAuthenticated()) { return next() };
		res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" });
	},
	verifyAccess: async (req, res, access) => {
		if (req.isAuthenticated()) {
			for (let i in access) {
				if (access[i] == req.user.access) {
					return true;
				};
			};
		};
		return false;
	},
	list: async (req, res) => {
		if (!await userController.verifyAccess(req, res, ['dvp', 'prp', 'spt', 'grf', 'grl', 'crd'])) {
			return res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" });
		};
		try {
			let users = await _list();
			res.send({ users: users });
		} catch (err) {
			console.log(err);
			res.send({ msg: "Ocorreu um erro ao listar os usuários, favor contatar o suporte." });
		};
	},
	show: async (req, res) => {
		if (!await userController.verifyAccess(req, res, ['dvp', 'prp', 'spt', 'grf', 'grl', 'crd'])) {
			return res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" });
		};

		try {
			let user = await findById(req.body.user_id);
			res.send({ user });
		} catch (err) {
			console.log(err);
			res.send({ msg: "Ocorreu um erro ao mostrar o usuário." });
		};
	},
	updateInfo: async (req, res) => {
		if (!req.isAuthenticated()) {
			res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" });
		};

		const user = {
			id: req.user.id,
			email: req.body.user.email
		};

		try {
			if (user.email) {
				var row = await findByEmail(user.email);
				if (row.length) { return res.send({ msg: "Este e-mail já está cadastrado." }) };
			};
			row = await _updateInfo(user);
			res.send({ done: "Informações atualizadas com sucesso.", user });
		} catch (err) {
			console.log(err);
			res.send({ msg: "Ocorreu um erro ao atualizar suas informações, favor contatar o suporte." });
		};
	},
	updatePassword: async (req, res) => {
		if (!req.isAuthenticated()) {
			return res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" });
		};

		let user = {
			id: req.user.id,
			password: hashSync(req.body.user.password, null, null),
			password_confirm: hashSync(req.body.user.password_confirm, null, null),
		}

		if (!req.body.user.password || req.body.user.password.length < 4) { return res.send({ msg: 'Senha inválida.' }); };
		if (req.body.user.password !== req.body.user.password_confirm) { return res.send({ msg: 'As senhas não correspondem.' }); }

		try {
			let row = await _updatePassword(user);
			res.send({ done: "Senha alterada com sucesso.", user });
		} catch (err) {
			console.log(err);
			res.send({ msg: "Ocorreu um erro ao alterar sua senha, favor contatar o suporte." });
		};
	}
};

export default userController;