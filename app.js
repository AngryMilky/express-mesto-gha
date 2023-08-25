const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
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

app.use((req, res, next) => {
  req.user = {
    _id: '64e790fd1bbf109b495ccaed',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

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
