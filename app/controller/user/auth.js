const User = require('./../../model/user/main');
const JWT = require('jsonwebtoken');
const Mailer = require('./../../../config/mailer');
const ejs = require("ejs");
const Token = require('./../../../config/token');
const bcrypt = require('bcrypt');
const path = require('path');

const Catalog = require('../../model/catalog/main');

const authController = {};

authController.signup = async (req, res) => {
  const user = new User();
  user.email = req.body.email;
  user.business = req.body.business;
  user.password = req.body.password;
  user.access = "adm";
  user.balance = 0;
  user.status = "Pending";

  if ((await User.findByEmail(user.email)).length) { return res.send({ msg: 'Este E-mail já está sendo utilizado.' }); }
  if ((await User.findByBusiness(user.business)).length) { return res.send({ msg: 'Este nome de empresa já está sendo utilizado.' }); }

  try {
    let response = await user.save();
    if (response.err) { return res.send({ msg: response.err }); }

    user.id = response.insertId;

    let catalog = new Catalog();
    catalog.user_id = user.id;
    catalog.url = '/';

    let catalog_response = await catalog.create();
    if (catalog_response.err) { return res.send({ msg: catalog_response.err }); }

    const JWTData = {
      // exp: Math.floor((Date.now()/1000) + (60*60)) * 1000,
      iss: 'cotalogo-api',
      data: {
        id: user.id,
        business: user.business,
        password: user.password
      }
    };

    const token = await Token.generate(JWTData);
    await user.token(token);

    const data = await ejs.renderFile(path.join(__dirname + "../../../../app/view/email-template/confirm-signup.ejs"),
      { title: 'Confirmação de email', user, token });

    const option = {
      from: "Cotalogo.com <suporte@cotalogo.com>",
      to: `${user.name} <${user.email}>`,
      subject: "Confirmação de email",
      html: data
    };

    Mailer.sendMail(option);

    req.logIn({ id: user.id, business: user.business }, err => {
      if (err) { return res.send({ msg: "Sua conta foi criada com sucesso! Porém ocorreu um erro ao realizar seu login." }) }
      res.send({ done: `Parabéns, sua conta foi criada com sucesso!` });
    });
  } catch (err) {
    console.log(err);
    return res.send({ msg: "Ocorreu um erro ao realizar o cadastro, atualize a página, caso o problema persista por favor contate o suporte." });
  }

};

authController.authorize = (req, res, next) => {
  if (req.isAuthenticated()) { return next() };
  res.send({ unauthorized: "Você não tem permissão para realizar esta ação!" });
};

authController.verify = (req, res, next) => {
  if (req.isAuthenticated()) { return next() };
  res.redirect('/login');
};

authController.verifyAccess = async (req, res, access) => {
  if (req.isAuthenticated()) {
    for (let i in access) {
      if (access[i] == req.user.access) {
        return true;
      };
    };
  };
  return false;
};

authController.confirmEmail = async (req, res, next) => {
  JWT.verify(req.params.token, process.env.JWT_SECRET_KEY, async (err, authUserData) => {
    if (err) {
      return res.render('user/email-confirmation', {
        msg: "O código é inválido, tente novamente ou solicite um novo código"
      });
    } else {
      let user = (await User.findByToken(req.params.token))[0];

      if (!user) {
        return res.render('user/email-confirmation', {
          msg: "O código é inválido, tente novamente ou solicite um novo código"
        });
      }

      const authUser = new User();
      authUser.id = authUserData.data.id;
      authUser.password = authUserData.data.password;

      if (authUserData.data.id == user.id && authUser.password == user.password) {
        authUser.password = user.password;
        authUser.status = "Active";
        authUser.token = "";
        authUser.balance = 20;
        await authUser.update();

        req.logIn({ id: user.id, business: user.business }, err => {
          if (err) { return res.send({ msg: "Ocorreu um erro ao realizar login!" }); }
          return res.render('user/email-confirmation', { msg: "Seu Email Foi confirmado com sucesso! Bem vindo ao Cotalogo!", user: req.user });
        });
      } else {
        return res.render('user/email-confirmation', { msg: "O código é inválido, tente novamente ou solicite um novo código" });
      }
    }
  });
};

authController.logout = (req, res) => {
  req.logout(function (err) {
    res.redirect('/');
  });
};

module.exports = authController;