const router = require('express').Router();
const {
  getUsers, getUser, getUserById, updateProfile, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);
router.get('/me', getUser);

module.exports = router;
