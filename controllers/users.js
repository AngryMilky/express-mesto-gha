const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  OK, CREATED,
} = require('../errors/errors');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');

// получение информации о текущем пользователе
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(OK).send({ data: user });
    })
    .catch(next);
};

// возвращение всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK).send({ data: users }))
    .catch(next);
};

// нахождение пользователя по id
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id'));
        return;
      }
      next(err);
    });
};

// создание нового пользователя
module.exports.createUser = (req, res, next) => {
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
        next(new ConflictError('Пользователь с таким email уже существует'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
        return;
      }
      next(err);
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
      res.status(OK).send({ token });
    })
    .catch(next);
};

// обновление профиля
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((data) => {
      if (!req.user._id) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
        return;
      }
      next(err);
    });
};

// обновляение аватара
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })

    .then((data) => {
      if (!req.user._id) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
        return;
      }
      next(err);
    });
};
