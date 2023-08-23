const router = require('express').Router();
const { getCards, deleteCard, createCard, likeCard, deleteLikeCard} = require('../controllers/cards');

router.get('/cards', getCards)
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', deleteLikeCard);

module.exports = router;
