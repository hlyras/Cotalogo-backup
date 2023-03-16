const User = require('../../model/user');

const JWT = require('jsonwebtoken');

const authController = {};

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
  JWT.verify(req.params.token, 'secretKey', async (err, authData) => {
    if (err) {
      return res.render('user/email-confirmation', { msg: "O código é inválido, tente novamente ou solicite um novo código", user: req.user })
    } else {
      let user = await User.findByToken(req.params.token);
      if (!user.length) {
        return res.render('user/email-confirmation', { msg: "O código é inválido, tente novamente ou solicite um novo código", user: req.user });
      }

      if (authData.data.user_id == user[0].id) {
        await User.confirmEmail(user[0].id);
        await User.destroyToken(req.params.token);
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

module.exports = authController;