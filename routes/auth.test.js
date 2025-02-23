const app = require('../app');
const request = require('supertest');
const { sequelize } = require('../models');

beforeAll(async () => {
    await sequelize.sync({ force: true }); //테스트 전 DB연결
})

describe('POST /join', () => {
    test('로그인 안 했으면 회원가입', (done) => {
        request(app).post('/auth/join')
            .send({
                nick: 'sungjin',
                email: 'whtjsdnd1234@naver.com',
                password: 'whtjsdnd7!'
            })
            .expect('Location','/') //res.redirect('/')
            .expect(302, done) //컨텐츠 변화 없음 코드
    });

    test('회원가입 했는데 또 회원가입', (done) => {
        request(app).post('/auth/join')
            .send({
                nick: 'sungjin',
                email: 'whtjsdnd1234@naver.com',
                password: 'whtjsdnd7!'
            })
            .expect('Location','/join?error=exist')
            .expect(302, done)
    });
})

describe('POST /join', () => {
    //agent 변수로 묶어 같은 서버에서 로그인과 회원가입 진행
    const agent = request.agent(app);

    //회원가입 전 로그인 실행
    beforeEach((done)=>{
        agent.post('/auth/login')
            .send({
                email: 'whtjsdnd1234@naver.com',
                password: 'whtjsdnd7!'
            })
            .end(done)
    })
    test('로그인했으면 회원가입 안 되어야 함', (done) => {
        const message = encodeURIComponent('로그인한 상태입니다.');
        agent.post('/auth/join')
            .send({
                nick: 'sungjin',
                email: 'whtjsdnd1234@naver.com',
                password: 'whtjsdnd7!'
            })
            .expect('Location',`/?error=${message}`)
            .expect(302, done) //컨텐츠 변화 없음 코드
    });
})

describe('POST /login', () => {
    test('로그인 수행', (done) => {
        request(app).post('/auth/login')
            .send({
                email: 'whtjsdnd1234@naver.com',
                password: 'whtjsdnd7!'
            })
            .expect('Location','/')
            .expect(302, done)
    });
    test('가입되지 않은 회원의 경우', (done) => {
        const message = '가입되지 않은 회원입니다.';
        request(app).post('/auth/login')
            .send({
                email: 'whtjsdnd4321@naver.com',
                password: 'whtjsdnd7!'
            })
            .expect('Location',`/?loginError=${encodeURIComponent(message)}`)
            .expect(302, done)
    });
    test('비밀번호 틀림', (done) => {
        const message = '비밀번호가 일치하지 않습니다.';
        request(app).post('/auth/login')
            .send({
                email: 'whtjsdnd1234@naver.com',
                password: 'noooop'
            })
            .expect('Location',`/?loginError=${encodeURIComponent(message)}`)
            .expect(302, done)
    });
})

describe('GET /logout', () => {
    test('로그인되어있지 않으면 403', (done) => {
        request(app)
            .get('/auth/logout')
            .expect(403, done);
    });

    const agent = request.agent(app);
    //로그인 실행
    beforeEach((done)=>{
        agent
            .post('/auth/login')
            .send({
                email: 'whtjsdnd1234@naver.com',
                password: 'whtjsdnd7!'
            })
            .end(done)
    })
    test('로그아웃 수행', (done) => {
        agent
            .get('/auth/logout')
            .expect('Location','/')
            .expect(302, done);
    });
})