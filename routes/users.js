const router = require('express').Router();
const { getUsers, getUserById, createUser, updateProfile, updateAvatar} = require('../controllers/users');

router.get('/users', getUsers)
router.post('/users', createUser);
router.get('/users/:userId', getUserById);
router.patch('/users/me', validateUpdateUser, updateprofile);
router.patch('/users/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;


