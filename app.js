const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//Import Router
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');

dotenv.config();
//Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true },
    () => console.log('Connected to DB !'));

// MiddleWare
app.use(express.json());


// routes Middleware
app.use('/api/user', authRouter);
app.use('/api/posts', postRouter)

app.listen(3000, () => console.log('Server up and running !'));