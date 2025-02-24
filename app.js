const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
const logger = require('./logger');
const redis = require('redis');
const { RedisStore } = require('connect-redis');

const { sequelize } = require('./models');
dotenv.config(); //env 파일 리딩 후 process.env에 저장
const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_URL}`,
    password: process.env.REDIS_PASSWORD,
});
redisClient.connect().catch(console.error);

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const passportConfig = require('./passport'); 

const app = express();
passportConfig(); //passport/index 기본 설정 적용
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});
sequelize.sync()
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });
if(process.env.NODE_ENV === 'production'){
    app.enable('trust proxy');
    app.use(morgan('combined')); //요청 대상의 ip까지 자세하게 출력
    app.use(helmet({ 
        //너무 엄격해서 완화
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: false, 
    }));
    app.use(hpp());
} else {
    app.use(morgan('dev'));
}
app.use('/img',express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    store: new RedisStore({ client: redisClient }), //저장소의 기본값: 메모리
}
if(process.env.NODE_ENV === 'production'){
    sessionOption.proxy = true;
    // https인 경우 sessionOption.cookie.secure = true;
}
app.use(session(sessionOption));
app.use(passport.initialize()); //passport와 session 연결
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 존재하지 않습니다.`);
    error.status = 404;
    logger.info('hello winston');
    logger.error(error.message);
    next(error);
})

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; //에러 객체 넘겨주기
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;