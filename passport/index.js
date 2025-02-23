const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');
const Post = require('../models/post');

module.exports = () => {
    //console.log(passport);
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({
            where: {id},
            include: [
                {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followers', //req.user에 팔로잉 담기
                },
                {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followings', //req.user에 팔로워 담기
                },
                {
                    model: Post,
                    attributes: ['id'],
                    as: 'Likings', //req.user에 좋아하는 게시물 담기
                }
            ]
        })
            .then((user) => done(null, user)) //req.user, req.session
            .catch(err => done(err));
    });
    //
    local();
    kakao();
};