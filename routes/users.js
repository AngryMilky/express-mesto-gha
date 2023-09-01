const router = require('express').Router();
const {
  getUsers, getUser, getUserById, updateProfile, updateAvatar,
} = require('../controllers/users');
const { validateUserId, validateUpdateProfile, validateUpdateAvatar } = require('../middlewares/validator');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUpdateProfile, updateProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
