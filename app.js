const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv'); 
const connectDB = require('./config/db');

dotenv.config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const agentRouter = require('./routes/agent');

const app = express();


// Connect to MongoDB
connectDB();

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
