jest.dontMock('./../State');
var state = require('./../State');

import {
    logIn,
    logOff,
    logInGood,
    loginBad,

    USER_LOGIN,
    USER_LOGOFF,
    USER_LOGIN_VALID,
    USER_LOGIN_INVALID,

    USER_STATE_ANON,
    USER_STATE_LOGIN_SUBMITTED,
    USER_STATE_VALIDATED,
    USER_STATE_LOGIN_REJECTED
} from './../../actions/Actions';

describe('State', function () {
    describe('#USER_LOGIN', function () {
        it('adds a user to state', function () {
            var loadBob = state(null, {type: USER_LOGIN, user: {name: 'bob'}});
            expect(loadBob.user.name).toBe('bob');
        });
        it('updates the userState', function () {
            var loadBob = state(null, {type: USER_LOGIN, user: {name: 'bob'}});
            expect(loadBob.userState).toBe(USER_STATE_LOGIN_SUBMITTED);
        });
    });

    describe('#USER_LOGIN_VALIDATED', function () {
        it('updates the userState', function () {
            var validateBob = state(null, {type: USER_LOGIN_VALID});
            expect(validateBob.userState).toBe(USER_STATE_VALIDATED);
        });
    });

    describe('#USER_LOGOFF', function () {
        it('removes user from state', function () {
            var unloadBob = state({user: {name: 'bob'}}, {type: USER_LOGOFF});
            expect(unloadBob.user).toBeNull();
        });
        it('updates the userState', function () {
            var unloadBob = state({user: {name: 'bob'}}, {type: USER_LOGOFF});
            expect(unloadBob.userState).toBe(USER_STATE_ANON);
        });
    });
});
