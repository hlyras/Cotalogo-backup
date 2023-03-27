const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');

const User = require('../app/model/user');

passport.use(
  'local',
  new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
    async (req, username, password, done) => {
      let user = await User.findByEmail(username);
      if (!user.length) { user = await User.findByBusiness(username); }

      if (!user.length) {
        return done(null, false, req.flash('loginMessage', 'Usuário não encontrado.'));
      };

      if (user.length) {
        if (!bcrypt.compareSync(password, user[0].password)) {
          return done(null, false, req.flash('loginMessage', 'Senha inválida.'));
        };
        return done(null, { id: user[0].id, business: user[0].business });
      };
    })
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser(async (user, done) => done(null, user));

module.exports = passport;