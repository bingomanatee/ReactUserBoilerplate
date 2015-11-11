jest.dontMock('./../State');
var state = require('./../State');

import {USER_LOGIN, USER_LOGOFF} from './../../actions/Actions';

describe('State', function () {
    describe('#USER_LOGIN', function() {
        it('adds a user to state', function () {
            var loadBob = state(null, {type: USER_LOGIN, user: {name: 'bob'}});
            expect(loadBob.user.name).toBe('bob');
        });
    });
    describe(('#USER_LOGOFF'), function() {
        it('removes user from state', function () {
            var unloadBob = state({user: {name: 'bob'}}, {type: USER_LOGOFF});
            expect(unloadBob.user).toBeNull();
        });
    });
});
