const User = require('../models/user');

// возвращение всех пользователей
module.exports.getUsers = (req, res) => {
  return User.find({})
    .then((users) => {
      return res.status(200).send({ data: users });
    })
    .catch((err) => res.status(500).send('Server Error'));
};

// нахождение пользователя по id
module.exports.getUserById = (req, res) => {
  const { id } = req.params;

  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send('Пользователь по указанному _id не найден')
      }
      return res.status(200).send(user);
    })
    .catch((err) => res.status(500).send('Server Error'));
};

// создание нового пользователя
module.exports.createUser = (req, res) => {
  return User.create({...req.body})
    .then((user) => {
      return res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send('Переданы некорректные данные при создании пользователя')
      }
      return res.status(500).send('Server Error');
    });
};

//обновление профиля
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true  } )
    if (!req.user._id) {
      return res.status(404).send('Пользователь с указанным _id не найден')
    }
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send('Переданы некорректные данные при обновлении профиля')
      }
      return res.status(500).send('Server Error');
    });
};

// обновляение аватара
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate( req.user._id, { avatar }, { new: true })
  if (!req.user._id) {
    return res.status(404).send('Пользователь с указанным _id не найден')
  }
  .then((data) => {
    res.status(200).send(data);
  })
  .catch((err) => {
    if (err.name === "ValidationError") {
      return res.status(400).send('Переданы некорректные данные при обновлении аватара')
    }
    return res.status(500).send('Server Error');
  });
};


