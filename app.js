
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import flash from 'connect-flash';
import passport from './config/passport.js';

const app = express();

app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', 'app/view');
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(session({
  secret: 'vidyapathaisalwaysrunning',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 30 },
  rolling: true
}));

app.use(passport.initialize());
app.use(passport.session());

import routes from './app/routes/index.js';
app.use('/', routes);

app.use(function (req, res, next) {
  res.status(404);

  res.format({
    html: function () {
      res.render('404', { url: req.url });
    },
    json: function () {
      res.json({ error: 'Not found' });
    },
    default: function () {
      res.type('txt').send('Not found');
    }
  })
});

export default app;