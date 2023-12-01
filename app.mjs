import express from 'express';
import session from 'express-session';
// import { join } from 'path';
// const app = express();

// require('dotenv').config();

// import { json as _json, urlencoded } from 'body-parser';
// import flash from 'connect-flash';
import passport from './config/passport.mjs';

// app.use(flash());
// app.use(_json());
// app.use(urlencoded({ extended: false }));

// view engine setup
// app.use(express.favicon(__dirname + '/public/images/favicon/favicon-black.ico'));
// app.set('views', join(__dirname, 'app/view'));
// app.set('view engine', 'ejs');

// app.use(static(join(__dirname, 'public')));
// app.use(express.static('public'));

// app.use(passport.session({
//   secret: 'vidyapathaisalwaysrunning',
//   resave: true,
//   saveUninitialized: true,
//   cookie: { maxAge: 1000 * 60 * 30 },
//   rolling: true
// }));

// app.use(passport.initialize());
// app.use(passport._session());

// app.use('/', require('./app/routes/index'));

// app.use(function (req, res, next) {
//   res.status(404);

//   res.format({
//     html: function () {
//       res.render('404', { url: req.url });
//     },
//     json: function () {
//       res.json({ error: 'Not found' });
//     },
//     default: function () {
//       res.type('txt').send('Not found');
//     }
//   })
// });

export default app;