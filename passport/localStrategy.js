const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const User = require('../models/user');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false
    }, async (email, password, done) => {
        try{
            const exUser = await User.findOne({where: {email}});
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if(result){
                    done(null, exUser);
                } else {
                    done(null, null, {message: '비밀번호가 일치하지 않습니다.'});
                }
            } else {
                done(null, exUser, {message: '가입되지 않은 회원입니다.'}); //exUser는 null
            }
        } catch (error) {
            console.error();
            done(error);
        }
    }));
};