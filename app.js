var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var agentRouter = require('./routes/agent');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const apiV1Router = express.Router();
const authRouter = express.Router();

apiV1Router.use('/', indexRouter);
apiV1Router.use('/users', usersRouter);

authRouter.use('/agent', agentRouter);


app.use('/api/v1', apiV1Router);
app.use('/api/v1', authRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
