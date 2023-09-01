const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { validateLogin, validateCreateUser } = require('./middlewares/validator');
const {
  NOT_FOUND,
} = require('./errors/errors');

const { port = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.use(errors());

app.use((req, res, next) => {
  next(res.status(NOT_FOUND).send(
    {
      message: 'Запрашиваемый ресурс не найден',
    },
  ));
});

app.listen(port, () => {
  console.log(`${port}`);
});
