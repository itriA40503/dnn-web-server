import express from 'express';
import path from 'path';
// import favicon from 'serve-favicon'
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import sassMiddleware from 'node-sass-middleware';
import passport from 'passport';
import LdapStrategy from 'passport-ldapauth';
import session from 'express-session';
import flash from 'connect-flash';
import timeout from 'connect-timeout';

import CdError from './util/CdError';

import jwtAuth from './middleware/jwtAuth'

import setupRouters from './routes';


const app = express();

app.set('jwtsecretkey', 'KemonoFriends');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('json spaces', 2);

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'));
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

// passport
app.use(session({ secret: 'KemonoFriends', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));
app.use(timeout(12000));

app.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});
setupRouters(app);
app.use('/apidoc', express.static(path.join(__dirname, 'apidoc')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  throw new CdError(404, 'Not Found');
});

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const errorView = 'error';
  res.status(status);

  if (status !== 401 && status !== 404) console.log(err);

  const responseMessage = {
    code: err.errorCode || status,
    message: (req.app.get('env') === 'development') ? err.message : '',
  };

  if (req.accepts('html')) {
    responseMessage.status = status;
    res.render(errorView, responseMessage);
  } else {
    res.json(responseMessage);
  }
});

module.exports = app;
