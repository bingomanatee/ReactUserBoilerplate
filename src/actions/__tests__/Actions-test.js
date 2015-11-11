jest.dontMock('./../Actions');

var Actions = require('./../Actions');

describe('Actions', function () {
    describe('logIn', function () {
       it('creates a login data from input', function () {
           const loginResult = Actions.logIn({name: 'bob'});
           console.log('loginResult: ', loginResult, Actions.logIn);

           expect(loginResult.type).toBe(Actions.USER_LOGIN);
           expect(loginResult.user.name).toBe('bob');
       });
    });

    describe('logOff', function () {
        it('has no other data', function () {
            const logOffResult = Actions.logOff();

            expect(logOffResult.type).toBe(Actions.USER_LOGOFF);
            expect(logOffResult.user).toBeUndefined();
        });
    });
});
