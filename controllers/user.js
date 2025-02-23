const User = require('../models/user');

exports.follow = async (req, res, next) => {
    //req.user.id, req.params.id
    try {
         const user = await User.findOne({where: {id: req.user.id}});
         if(user){
            const newUser = await User.findOne({where: {id: req.params.id}});
            if(newUser){
                await user.addFollowing(newUser);
                res.send('success');
            } else {
                res.status(404).send('no user');
            }
         } else {
            res.status(404).send('no user');
         }
    } catch(error){
        console.log(error);
        next(error);
    }
};

exports.unfollow = async (req, res, next) => {
    //req.user.id, req.params.id
    try {
        const user = await User.findOne({where: {id: req.user.id}});
        if(user){
           await user.removeFollowing(parseInt(req.params.id, 10));
           res.send('success');
        } else {
           res.status(404).send('no user');
        }
   } catch(error){
       console.log(error);
       next(error);
   }
};

exports.like = async (req, res, next) => {
    //req.user.id, req.params.postId
    try {
        const user = await User.findOne({where: {id: req.user.id}});
        if(user){
           await user.addLiking(parseInt(req.params.postId, 10));
           res.send('success');
        } else {
           res.status(404).send('no user');
        }
   } catch(error){
       console.log(error);
       next(error);
   }
};

exports.dislike = async (req, res, next) => {
    //req.user.id, req.params.postId
    try {
        const user = await User.findOne({where: {id: req.user.id}});
        if(user){
           await user.removeLiking(parseInt(req.params.postId, 10));
           res.send('success');
        } else {
           res.status(404).send('no user');
        }
   } catch(error){
       console.log(error);
       next(error);
   }
};

// 이름 바꾸는 기능
exports.modifyNick = async (req, res, next) => {
    //req.user.id, req.params.id
    try {
        await User.update({ 
                nick: req.body.nick
            },{
                where: { id: req.user.id }
            });
        res.redirect('/profile');
   } catch(error){
       console.log(error);
       next(error);
   }
};