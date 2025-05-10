const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv'); 
const connectDB = require('./config/db');
const bodyParser = require('body-parser');

dotenv.config();

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const agentRouter = require('./routes/agent');
const scanRouter = require('./routes/scan');
const orgRouter = require('./routes/org');

const app = express();

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));

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
apiV1Router.use('/user', userRouter);
apiV1Router.use('/organization', orgRouter);
apiV1Router.use('/scan', scanRouter);

authRouter.use('/agent', agentRouter);


app.use('/api/v1', apiV1Router);
app.use('/api/v1', authRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
