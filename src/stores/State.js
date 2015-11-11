import {
    USER_LOGIN,
    USER_LOGOFF,
    USER_LOGIN_VALID,
    USER_LOGIN_INVALID,
    USER_RESET_ANON,

    USER_STATE_ANON,
    USER_STATE_LOGIN_SUBMITTED,
    USER_STATE_VALIDATED,
    USER_STATE_LOGIN_REJECTED
} from './../actions/Actions';

const initialState = {
    user: null,
    userState: USER_STATE_ANON
};

const state = (pState, action) => {
    let update = {};

    switch (action.type) {
        case USER_LOGIN:
            update = {user: action.user, userState: USER_STATE_LOGIN_SUBMITTED};
            break;

        case USER_RESET_ANON:
            // IMPORTANT: USER_RESET_ANON does NOT flush any user data in state.
            update = {userState: USER_STATE_ANON};
            break;

        case USER_LOGOFF:
            update = {user: null, userState: USER_STATE_ANON};
            break;

        case USER_LOGIN_VALID:
            update = {userState: USER_STATE_VALIDATED};
            break;

        case USER_LOGIN_INVALID:
            update = {userState: USER_STATE_LOGIN_REJECTED};
            break;

        case '@@redux/INIT':
            break;

        default:
            console.log('strange action:', action);
            throw new Error('cannot recognize action ', action);
    }

    return Object.assign({}, pState || Object.assign({}, initialState), update);
};

export default state;
