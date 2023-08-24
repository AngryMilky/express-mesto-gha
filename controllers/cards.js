const Card = require('../models/card');

// показывает все карточки
module.exports.getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send({ data: cards }))
  .catch(() => res.status(500).send('Server Error'));

// удаление карточки
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  return Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send('Карточка с указанным _id не найдена');
      }
      return res.status(200).send({ message: 'Успешно' });
    })
    .catch(() => res.status(500).send('Server Error'));
};

// создание карточки
module.exports.createCard = (req, res) => Card.create({ ...req.body })
  .then((card) => res.status(201).send(card))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send('Переданы некорректные данные при создании карточки');
    }
    return res.status(500).send('Server Error');
  });

// поставить лайк карточке
module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(404).send('Передан несуществующий _id карточки');
    }
    return res.status(200).send(card);
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send('Переданы некорректные данные для постановки лайка');
    }
    return res.status(500).send('Server Error');
  });

// удалить лайк с карточки
module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(404).send('Передан несуществующий _id карточки');
    }
    return res.status(200).send(card);
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send('Переданы некорректные данные для снятия лайка');
    }
    return res.status(500).send('Server Error');
  });
