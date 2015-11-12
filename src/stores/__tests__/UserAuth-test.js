jest.dontMock('./../Store');
jest.dontMock('./../../actions/Actions');
jest.dontMock('./../UserAuth');
jest.dontMock('redux');
jest.dontMock('./../State');

var store = require('./../Store');
var Actions = require('./../../actions/Actions');
var UserAuth = require('./../UserAuth');

describe('UserAuth', function () {
    var globalResolve;
    beforeEach(function () {
        // configure an always-authing API that waits 500ms to authenticate.
        UserAuth.setUserValidation((user) => new Promise((resolve, reject) => {
            globalResolve = resolve;
        }), UserAuth.VALIDATION_METHOD_TYPE_PROMISE);
    });

    it('shifts the state to USER_STATE_VALIDATED eventually', function () {
        runs(() => {
            store.dispatch(Actions.logIn({user: 'bob'}));
            globalResolve(true);
        });

        var done = false;
        waitsFor(() => {
            jest.runOnlyPendingTimers();
            setTimeout(() => {
                done = true;
            }, 200);
            return done;
        });

        runs(() => {
            const loggedInState = store.getState();
            expect(loggedInState.userState).toBe(Actions.USER_STATE_VALIDATED);
        });
    });
});
