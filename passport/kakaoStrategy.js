const passport = require('passport');
const { Strategy : KakaoStrategy } = require('passport-kakao');
const User = require('../models/user');

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        //console.log('profile : ', profile);
        try{
            const exUser = await User.findOne({
                where: { snsId: profile.id, provider: 'kakao' }
            });
            if(exUser){
                done(null, exUser);
            } else {
                const newUser = await User.create({ //카카오 내부구조에 따라 수정 필요
                    nick: profile.username,
                    snsId: profile.id,
                    provider: 'kakao',
                    email: profile._json?.kakao_account?.email,
                })
                done(null, newUser); 
            }
        } catch (error) {
            console.log(error);
            done(error);
        }
    }));
};