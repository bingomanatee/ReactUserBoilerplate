import { createStore } from 'redux';
import state from './State';
const userAuth = require('./UserAuth');

import {
    logInGood,
    loginBad,
    USER_STATE_ANON,
    USER_STATE_LOGIN_SUBMITTED,
    USER_STATE_VALIDATED,
    USER_STATE_LOGIN_REJECTED } from '../actions/Actions';

const store = createStore(state);

var userState = null;

/**
 * this listener hooks in the UserAuth module automatically;
 * when the user submits the login action, it then calls UserAuth with the current user value
 * and then when the UserAuth promise responds, pushes state to logInGood or logInBad
 * depending on the result.
 */
let authSubscribe = store.subscribe(() => {
    var newState = store.getState();
    if (newState.userState === userState) {
        return;
    }

    if (newState.userState === USER_STATE_LOGIN_SUBMITTED) {
        var user = newState.user;
        userAuth(user)
            .then(
                () =>store.dispatch(logInGood()),
                (result) => store.dispatch(loginBad(result))
            );
    }
});

export default store;
