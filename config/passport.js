const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../app/model/user/main');

passport.use(
  'local',
  new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
    async (req, username, password, done) => {
      let user = (await User.findByEmail(username))[0];
      if (!user) { user = (await User.findByBusiness(username))[0]; }

      if (!user) {
        return done(null, false, req.flash('loginMessage', 'Usuário não encontrado.'));
      };

      if (user) {
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, req.flash('loginMessage', 'Senha inválida.'));
        };
        return done(null, { id: user.id, business: user.business });
      };
    })
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser(async (user, done) => done(null, user));

module.exports = passport;