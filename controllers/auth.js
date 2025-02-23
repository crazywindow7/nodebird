const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

exports.join = async (req, res, next) => { //회원가입 기능 미들웨어
    const { nick, email, password } = req.body;
    try {
        const exUser = await User.findOne({where:{email}});
        if(exUser){
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.login = (req, res, next) => { //로그인 기능 미들웨어
    const localAuthenticate = passport.authenticate('local', (authError, user, info) => {
        if(authError){ //서버실패
            console.error(authError);
            return next(authError);
        }
        if(!user){ //로직실패
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    });
    localAuthenticate(req, res, next);
};

exports.logout = (req, res, next) => {
    req.logout(() => {
        res.redirect('/');
    })
};
