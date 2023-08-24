const OK = 200;

// переданы некорректные данные в методы создания карточки, пользователя,
// обновления аватара пользователя или профиля
const BAD_REQUEST = 400;

// карточка или пользователь не найден
const NOT_FOUND = 404;

// ошибка по умолчанию
const SERVER_ERROR = 500;

module.exports = {
  OK, BAD_REQUEST, NOT_FOUND, SERVER_ERROR,
};
