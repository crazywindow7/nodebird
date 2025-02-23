const express = require('express');
const router = express.Router();
const { renderMain, renderJoin, renderProfile, renderHashtag, renderUserPost } = require('../controllers/page');
const { modifyNick } = require('../controllers/user'); //이러면 안됨
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');

router.use((req, res, next) => {
    res.locals.user = req.user; 
    res.locals.followerCount = req.user?.Followers?.length || 0;
    res.locals.followingCount = req.user?.Followings?.length || 0;
    res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
    res.locals.likedPostIdList = req.user?.Likings?.map(f => f.id) || [];
    next();
});

router.get('/profile', isLoggedIn, renderProfile);
router.post('/profile/modify/nick', isLoggedIn, modifyNick);
router.get('/join', isNotLoggedIn, renderJoin);
router.get('/', renderMain);
router.get('/page/:userId', renderUserPost);
router.get('/hashtag', renderHashtag); // hashtag?hashtag=고양이

module.exports = router;