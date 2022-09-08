const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const {signup, login, delete_user} = require('../controllers/user');

router.post('/signup', signup);

router.post('/login', login);

router.delete('/remove', checkAuth, delete_user);


module.exports = router;