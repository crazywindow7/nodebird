const { where } = require('sequelize');
const Hashtag = require('../models/hashtag');
const Post = require('../models/post');
const User = require('../models/user');
const logger = require('../logger');

exports.renderProfile = (req, res, next) => {
    // 서비스 호출
    res.render('profile', { title: '내 정보 - NodeBird'});
};

exports.renderJoin = (req, res, next) => {
    res.render('join', { title: '회원 가입 - NodeBird'});
};

exports.renderMain = async (req, res, next) => {
    try{
        const posts = await Post.findAll({
            include: [
                {
                  model: User,
                  attributes: ['id', 'nick'], // 작성자와 연결된 관계
                },
                {
                  model: User,
                  attributes: ['id'],
                  as: 'Likeds', // 좋아요를 누른 유저와 연결된 관계
                },
              ],
            order: [['createdAt','DESC']]
        });
        
        res.render('main', {
            title: 'NodeBird',
            twits: posts,
        });
    } catch(error){
        console.log(error);
        next(error);
    }
};

exports.renderUserPost = async (req, res, next) => {
    // req.params.userId
    try{
        const userId = req.params.userId;
        const posts = await Post.findAll({
            where: {
                userId: userId
            },
            include: {
                model: User,
                attributes: ['id','nick']
            },
            order: [['createdAt','DESC']]
        })
        res.render('main', {
            title: 'NodeBird',
            twits: posts,
        });
    } catch(error){
        console.log(error);
        next(error);
    }
}

exports.renderHashtag = async (req, res, next) => {
    const query = req.query.hashtag;
    if(!query){
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: {title: query} });
        let posts = [];
        if(hashtag){
            posts = await hashtag.getPosts({
                include: [{
                    model: User,
                    attributes: ['id', 'nick'],
                }],
                order: [['createdAt', 'DESC']],
            });
        }
        res.render('main', {
            title: `${query} | nodebird`,
            twits: posts,
        })
    } catch(err){
        console.log(err);
        next(err);
    }
};