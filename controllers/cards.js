const Card = require('../models/card');
const {
  OK, CREATED, FORBIDDEN, BAD_REQUEST, NOT_FOUND, SERVER_ERROR,
} = require('../errors/errors');

// показывает все карточки
module.exports.getCards = (req, res) => Card.find({})
  .then((cards) => res.status(OK).send({ data: cards }))
  .catch(() => res.status(SERVER_ERROR).send(
    {
      message: 'На сервере произошла ошибка',
    },
  ));

// удаление карточки
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  return Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send(
          {
            message: 'Карточка с указанным _id не найдена',
          },
        );
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        return res.status(FORBIDDEN).send(
          {
            message: 'Недостаточно прав для удаления карточки',
          },
        );
      }
      return res.status(OK).send({ message: 'Успешно' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send(
          {
            message: 'Переданы некорректные данные при создании карточки',
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

// создание карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send(
          {
            message: 'Переданы некорректные данные при создании карточки',
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

// поставить лайк карточке
module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(NOT_FOUND).send(
        {
          message: 'Передан несуществующий _id карточки',
        },
      );
    }
    return res.status(OK).send(card);
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

// удалить лайк с карточки
module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(NOT_FOUND).send(
        {
          message: 'Передан несуществующий _id карточки',
        },
      );
    }
    return res.status(OK).send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send(
        {
          message: 'Переданы некорректные данные для удаления лайка',
        },
      );
    }
    return res.status(SERVER_ERROR).send(
      {
        message: 'На сервере произошла ошибка',
      },
    );
  });
