jest.dontMock('./../Store');
jest.dontMock('./../../actions/Actions');
jest.dontMock('./../UserAuth');
jest.dontMock('redux');
jest.dontMock('./../State');

var store = require('./../Store');
var Actions = require('./../../actions/Actions');
var UserAuth = require('./../UserAuth');

describe('UserAuth', function () {
    describe('promise based authentication: success', function () {
        /**
         * This scenario validates that if an injected promise-based auth method is employed,
         * after you login, and after the promise resolve,
         * the userState is promoted to validated.
         */
        var globalResolve;
        beforeEach(function () {
            // configure an always-authing API that waits 500ms to authenticate.
            UserAuth.setUserValidation((user) => new Promise((resolve, reject) => {
                globalResolve = resolve;
            }), UserAuth.VALIDATION_METHOD_TYPE_PROMISE);
            store.dispatch(Actions.logIn({user: 'bob'}));
            globalResolve(true);
        });

        it('shifts the state to USER_STATE_VALIDATED eventually', function () {
            // using a little async here to ensure that the "then" of logging in has time to execute.
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
    describe('promise based authentication: failure', function () {
        /**
         * This scenario validates that if an injected promise-based auth method is employed,
         * after you login, and after the promise resolve,
         * the userState is promoted to validated.
         */
        var globalReject;
        const INVALID_REASON = 'bob is bad';
        beforeEach(function () {
            // configure an always-authing API that waits 500ms to authenticate.
            UserAuth.setUserValidation((user) => new Promise((resolve, reject) => {
                globalReject = reject;
            }), UserAuth.VALIDATION_METHOD_TYPE_PROMISE);
            store.dispatch(Actions.logIn({user: 'bob'}));
            globalReject({error: INVALID_REASON});
        });

        it('shifts the state to USER_STATE_REJECTED eventually', function () {
            // using a little async here to ensure that the "then" of logging in has time to execute.
            var done = false;
            waitsFor(() => {
                jest.runOnlyPendingTimers();
                setTimeout(() => {
                    done = true;
                }, 200);
                return done;
            });

            runs(() => {
                const loginRejectedState = store.getState();
                expect(loginRejectedState.userState).toBe(Actions.USER_STATE_LOGIN_REJECTED);
                expect(loginRejectedState.userInvalidReason.error).toBe(INVALID_REASON);
            });
        });
    });
});
