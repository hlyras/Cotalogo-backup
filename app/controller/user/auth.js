import User, { findByEmail, findByBusiness, findByToken, confirmEmail, destroyToken } from './../../model/user';

import { verify } from 'jsonwebtoken';

import { sendMail } from './../../../config/mailer';
import { renderFile } from "ejs";
import { generate } from './../../../config/token';
import { join } from 'path';
import { ServiceCatalog } from 'aws-sdk';

import Catalog from '../../model/catalog/main';

const authController = {};

authController.signup = async (req, res, next) => {
  const user = new User(req.body);

  if ((await findByEmail(user.email)).length) { return res.send({ msg: 'Este E-mail já está sendo utilizado.' }); }
  if ((await findByBusiness(user.business)).length) { return res.send({ msg: 'Este nome de empresa já está sendo utilizado.' }); }

  try {
    let response = await user.save();
    if (response.err) { return res.send({ msg: response.err }); } //signupMessage', response.err));

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
        user_id: user.id,
        business: user.business
      },
    };

    const token = await generate(JWTData);

    await user.token(token);

    const data = await renderFile(join(__dirname + "../../../../app/view/email-template/confirm-signup.ejs"), { title: 'Confirmação de email', user, token });

    const option = {
      from: "Cotalogo.com <suporte@cotalogo.com>",
      to: `${user.name} <${user.email}>`,
      subject: "Confirmação de email",
      html: data
    };

    sendMail(option, (err, info) => {
      if (err) { console.log(err); }
      else { console.log('Message sent: ' + info.response); }
    });

    await new Promise((resolve, reject) => {
      req.logIn({ id: user.id, business: user.business }, err => {
        if (err) { return res.send({ msg: "Ocorreu um erro inesperado ao realizar login" }); }
        return res.status(200).send({ done: 'Login realizado com sucesso' });
      });
    });
  } catch (err) {
    console.log(err);
    return res.send({ msg: "Ocorreu um erro ao realizar o cadastro, atualize a página, caso o problema persista por favor contate o suporte." });
  }

  res.send({ done: "Sua conta foi criada com sucesso!" });
};

authController.authorize = (req, res, next) => {
  console.log(req.isAuthenticated());
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
  verify(req.params.token, 'secretKey', async (err, authData) => {
    if (err) {
      return res.render('user/email-confirmation', { msg: "O código é inválido, tente novamente ou solicite um novo código", user: req.user })
    } else {
      let user = await findByToken(req.params.token);
      if (!user.length) {
        return res.render('user/email-confirmation', { msg: "O código é inválido, tente novamente ou solicite um novo código", user: req.user });
      }

      if (authData.data.user_id == user[0].id) {
        await confirmEmail(user[0].id);
        await destroyToken(req.params.token);
        return res.render('user/email-confirmation', { msg: "Seu Email Foi confirmado com sucesso!", user: req.user })
      } else {
        return res.render('user/email-confirmation', { msg: "O código é inválido, tente novamente ou solicite um novo código", user: req.user });
      }
    }
  });
};

authController.logout = (req, res) => {
  req.logout(function (err) {
    res.redirect('/');
  });
};

export default authController;