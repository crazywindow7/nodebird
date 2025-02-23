jest.mock('../models/user');
const User = require('../models/user');
const { follow } = require('./user');

// follow 는 promise 함수이므로 async-await 붙여야 함
describe('follow', () => {
    test('사용자를 찾아 following을 추가하고 success를 응답해야 함', async () => {
        const req = {
            user: { id: 1 },
            params: { id: 2 }
        };
        const res = {
            send: jest.fn(),
        };
        const next = jest.fn();
        User.findOne.mockReturnValue({
            addFollowing(id) {
                return Promise.resolve(true);
            }
        });
        await follow(req, res, next);
        expect(res.send).toBeCalledWith('success');
    });
    test('사용자를 찾기 못하면 res.status(404).send(no user)를 응답해야 함', async () => {
        const req = {
            user: { id: 1 },
            params: { id: 2 }
        };
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        };
        const next = jest.fn();
        User.findOne.mockReturnValue(null); //user가 null
        await follow(req, res, next);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith('no user');
        
    });
    test('서버에서 에러가 나면 next(error)를 호출해야 함', async () => {
        const req = {
            user: { id: 1 },
            params: { id: 2 }
        };
        const res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        };
        const next = jest.fn();
        const message = 'DB에러';
        User.findOne.mockReturnValue(Promise.reject(message));
        await follow(req, res, next);
        expect(next).toBeCalledWith(message);
    });
})