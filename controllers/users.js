const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  OK, CREATED, BAD_REQUEST, NOT_FOUND, CONFLICT, SERVER_ERROR,
} = require('../errors/errors');

// получение информации о текущем пользователе
module.exports.getUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(() => res.status(SERVER_ERROR).send(
      {
        message: 'На сервере произошла ошибка',
      },
    ));
};

// возвращение всех пользователей
module.exports.getUsers = (req, res) => User.find({})
  .then((users) => res.status(OK).send({ data: users }))
  .catch(() => res.status(SERVER_ERROR).send(
    {
      message: 'На сервере произошла ошибка',
    },
  ));

// нахождение пользователя по id
module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send(
          {
            message: 'Пользователь по указанному _id не найден',
          },
        );
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send(
          {
            message: 'Переданы некорректные данные для постановки лайка',
          },
        );
      }
      return res.status(SERVER_ERROR).send(
        {
          message: 'На сервере произошла ошибка',
        },
      );
    });
};

// создание нового пользователя
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email,
  } = req.body;

  // хеширование пароля
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(CREATED).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(CONFLICT).send(
          {
            message: 'Пользователь с таким email уже существует',
          },
        );
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send(
          {
            message: 'Переданы некорректные данные при создании пользователя',
          },
        );
      }
      return res.status(SERVER_ERROR).send(
        {
          message: 'На сервере произошла ошибка',
        },
      );
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password, res)
    .then((user) => {
      // создание токена
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });
    })
    .catch(next);
};

// обновление профиля
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((data) => {
      if (!req.user._id) {
        return res.status(NOT_FOUND).send(
          {
            message: 'Пользователь с указанным _id не найден',
          },
        );
      }
      return res.status(OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send(
          {
            message: 'Переданы некорректные данные при обновлении профиля',
          },
        );
      }
      return res.status(SERVER_ERROR).send(
        {
          message: 'На сервере произошла ошибка',
        },
      );
    });
};

// обновляение аватара
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })

    .then((data) => {
      if (!req.user._id) {
        return res.status(NOT_FOUND).send(
          {
            message: 'Пользователь с указанным _id не найден',
          },
        );
      }
      return res.status(OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send(
          {
            message: 'Переданы некорректные данные при обновлении аватара',
          },
        );
      }
      return res.status(SERVER_ERROR).send(
        {
          message: 'На сервере произошла ошибка',
        },
      );
    });
};
