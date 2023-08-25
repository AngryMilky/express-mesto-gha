const User = require('../models/user');
const {
  OK, BAD_REQUEST, NOT_FOUND, SERVER_ERROR,
} = require('../errors/errors');

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
    .catch(() => res.status(SERVER_ERROR).send(
      {
        message: 'На сервере произошла ошибка',
      },
    ));
};

// создание нового пользователя
module.exports.createUser = (req, res) => {
  User.create({ ...req.body })
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send(
          {
            message: 'Переданы некорректные данные при создании пользователя',
          },
        );
      }
      res.status(SERVER_ERROR).send(
        {
          message: 'На сервере произошла ошибка',
        },
      );
    });
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
