const express           = require('express');
const path              = require('path');
const favicon           = require('serve-favicon');
const cookieParser      = require('cookie-parser');
const flash             = require('connect-flash');
const session           = require('express-session');
const expressValidator  = require('express-validator');
const users             = require('./routes/users');
const index             = require('./routes/index');
const logger            = require('morgan');


const app = express();


// configure Express  
app.use(cookieParser('keyboard cat'));
// Handle Express Sessions
app.use(session({ secret: 'secret', saveUninitialized: true, resave: true, cookie: { maxAge: 60000 }}));
// Show messages
app.use(flash());


app.set('views', path.join(__dirname, 'views'));

// view engine setup
app.set('view engine', 'pug');

// Favicon
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Enable server to serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Enable server to log requests
app.use(logger('common'));

app.listen(3000, () => console.log('Server started on port 3000...'));

//Validator
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
      let namespace = param.split('.');
      let root = namespace.shift();
      let formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Enable server to find our routes
app.use('/', index);
app.use('/users', users);

// app.get('/flash', function(req, res){
//   req.flash('info', 'Hi there!');
//   res.redirect('/');
// });

// app.use((req, res, next) => {
//   res.locals.messages = require('express-messages')(req, res);
//   next();
// });

// catch 404 and forward to error handler
// app.use((req, res, next) => {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
// app.use((err, req, res, next) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
