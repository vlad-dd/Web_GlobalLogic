const express = require('express');
const User_controller = require('../controller/users');
const Event_controller = require('../controller/events');
const router = express.Router();

router.post('/register', User_controller.register);
router.post('/login', User_controller.login);
router.use('/user', User_controller.authMiddleware);
router.use('/user', User_controller.extractDataMiddleware);
router.get('/user/get_user_events', Event_controller.get_user_events);
router.post('/user/post_event', Event_controller.post_event);
router.post('/user/delete_event', Event_controller.delete_event);
router.post('/user/update_event', Event_controller.update_event);
router.post('/user/login_with_token', User_controller.login_with_token);

module.exports = router;