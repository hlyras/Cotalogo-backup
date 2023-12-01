import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt-nodejs';
// import { Strategy } from 'passport-local';

// Criando uma instância da estratégia Local
// const LocalStrategy = new Strategy();

// import { findAll } from '../app/model/user';

// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcrypt-nodejs');

import User from '../app/model/user';

passport.use(
  'local',
  new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  },
    async (req, email, password, done) => {
      let user = await User.findAll({ where: { email: email } });
      if (!user.length) { user = await User.findAll({ where: { business: 'João' } }); }

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

export default passport;