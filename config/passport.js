const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const Mailer = require('./mailer');
const fs = require("fs");
const ejs = require("ejs");

const Token = require('./token');

const User = require('../app/model/user');

const db = require('./connection');

passport.serializeUser(async (user, done) => {
    done(null, user);
});

passport.deserializeUser(async (user, done) => {
    done(null, user);
});

passport.use(
    'local-signup',
    new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    async (req, email, password, done) => {
        const user = new User(req.body);

        if((await User.findByEmail(user.email)).length){ return done(null, false, req.flash('signupMessage', 'Este E-mail já está sendo utilizado.')) }
        if((await User.findByBusiness(user.business)).length){ return done(null, false, req.flash('signupMessage', 'Este nome de empresa já está sendo utilizado.')) }

        try {
            let response = await user.save();
            if(response.err){ return done(null, false, req.flash('signupMessage', response.err)); }

            user.id = response.insertId;

            const JWTData = {
                // exp: Math.floor((Date.now()/1000) + (60*60)) * 1000,
                iss: 'cotalogo-api',
                data: { 
                    user_id: user.id,
                    business: user.business
                },
            };

            const token = await Token.generate(JWTData);

            await user.token(token);

            const data = await ejs.renderFile(__dirname + "../../app/view/email-template/confirm-signup.ejs", { title: 'Confirmação de email', user, token });
            
            const option = {
                from: "Cotalogo.com <suporte@cotalogo.com>",
                to: `${user.name} <${user.email}>`,
                subject: "Confirmação de email",
                html: data
            };

            await Mailer.sendMail(option, (err, info) => {
                if (err) { console.log(err); } 
                else { console.log('Message sent: ' + info.response); }
            });

            return done(null, { id: user.id, business: user.business })
        } catch (err) {
            console.log(err);
            return done(null, false, req.flash('signupMessage', 'Ocorreu um erro favor contatar o suporte!'));
        }
    })
);

passport.use(
    'local-login',
    new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    async (req, email, password, done) => {
        let user = await User.findByEmail(req.body.email);

        if (!user.length){
            return done(null, false, req.flash('loginMessage', 'Usuário não encontrado.'));
        };

        if(user.length){
            if (!bcrypt.compareSync(password, user[0].password)){
                return done(null, false, req.flash('loginMessage', 'Senha inválida.'));
            };
            return done(null, { id: user[0].id, business: user[0].business });
        };
    })
);

module.exports = passport;