const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares')
const { follow, unfollow, like, dislike } = require('../controllers/user')

//user/:id/follow
router.post('/:id/follow', isLoggedIn, follow);
//user/:id/unfollow
router.post('/:id/unfollow', isLoggedIn, unfollow);

//user/:postId/like
router.post('/:postId/like', isLoggedIn, like);
//user/:postId/dislike
router.post('/:postId/dislike', isLoggedIn, dislike);

module.exports = router;