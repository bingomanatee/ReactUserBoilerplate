jest.dontMock('./../Actions');

var Actions = require('./../Actions');

describe('Actions', function () {
    describe('logIn', function () {
        it('creates a login data from input', function () {
            const loginResult = Actions.logIn({name: 'bob'});

            expect(loginResult.type).toBe(Actions.USER_LOGIN);
            expect(loginResult.user.name).toBe('bob');
        });
    });

    describe('logOff', function () {
        it('returns properly typed action', function () {
            const logOffResult = Actions.logOff();

            expect(logOffResult.type).toBe(Actions.USER_LOGOFF);
            expect(logOffResult.user).toBeUndefined();
        });
    });

    describe('logInGood', function () {
        it('returns properly typed action', function () {
            const loginValidResult = Actions.logInGood();
            expect(loginValidResult.type).toBe(Actions.USER_LOGIN_VALID);
        });
    });

    describe('logInBad', function () {
        it('returns properly typed action', function () {
            const loginValidResult = Actions.loginBad();
            expect(loginValidResult.type).toBe(Actions.USER_LOGIN_INVALID);
        });
    });
});
