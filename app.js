const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors')
const passport = require('passport');
//Import Router
const authRouter = require('./routes/auth');
const postRouter = require('./routes/posts');
const userRouter = require('./routes/users');


app.use(passport.initialize());
app.use(passport.session());
const corsOptions = {
    credentials: true,
};
app.use(cors(corsOptions));
dotenv.config();
//Change evn depend on EVN has set
const evn = app.get('env');
require('custom-env').env(evn);

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true },
    () => console.log('Connected to DB !'));

// MiddleWare
app.use(express.json());


// routes Middleware
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter)
app.use('/api/users', userRouter)

//export app for test
module.exports = app;
const post = process.env.PORT;
app.listen(post, () => console.log('Server up and running !', post));
