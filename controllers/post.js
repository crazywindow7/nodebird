const Hashtag = require('../models/hashtag');
const Post = require('../models/post');

exports.afterUploadImage = (req, res) => {
    console.log(req.file);
    res.json({ url: req.file.location });
};

exports.uploadPost = async (req, res, next) => {
    // req.body.content, req.body.url
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if(hashtags){
            const result = await Promise.all(hashtags.map((tag) => {
                return Hashtag.findOrCreate({
                    where: { title: tag.slice(1).toLowerCase() }
                });
            }));
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (error){
        console.log(error);
        next(error);
    }
};

exports.deletePost = async (req, res, next) => {
    //req.params.id, req.user.id
    try {
        if(req.user.id == req.params.postUserId){
            await Post.destroy({
                where: { id: req.params.twitId },
            });
            res.send('success');
        }
    } catch (error){
        console.log(error);
        next(error);
    }
};