jest.dontMock('./../Store');
jest.dontMock('./../../actions/Actions');
jest.dontMock('../UserAuth');
jest.dontMock('redux');
jest.dontMock('./../State');

var store = require('./../Store');
import { logIn, USER_STATE_VALIDATED } from './../../actions/Actions';
import { setUserValidation, VALIDATION_METHOD_TYPE_PROMISE } from '../UserAuth';
import userAuth from '../UserAuth';

describe('UserAuth', function () {
    beforeEach(function () {
        // configure an always-authing API that waits 500ms to authenticate.
        userAuth((user) => new Promise((resolve, reject) => {
            setTimeout(() => resolve(true), 500); // we like everyone
        }), VALIDATION_METHOD_TYPE_PROMISE);
    });

    it('shifts the state to USER_STATE_VALIDATED eventually', function () {
        runs(() => store.dispatch(logIn({user: 'bob'})));

        waitsFor(() => {
            // at this point, UserAuth should be dispatching methods to store to accept bob.
        }, 800);

        runs(() => {
            const loggedInState = store.getState();
            expect(loggedInState.userState).toBe(USER_STATE_VALIDATED);
        });
    });
});
