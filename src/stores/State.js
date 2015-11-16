import {
    USER_LOGIN,
    USER_LOGOFF,
    USER_LOGIN_VALID,
    USER_LOGIN_INVALID,
    USER_RESET_ANON,
    USER_LOGGED_IN,
    OVERLAY,

    USER_STATE_ANON,
    USER_STATE_LOGIN_SUBMITTED,
    USER_STATE_VALIDATED,
    USER_STATE_LOGIN_REJECTED
} from './../actions/Actions';
import User from './../utils/User';

const initialState = {
    user: null,
    userState: USER_STATE_ANON
};

const state = (pState, action) => {
    console.log('action....', action, USER_LOGGED_IN);
    let update = {};

    switch (action.type) {

        case OVERLAY:
            // note - an empty object will hide the overlay
            var overlay = action.overlay ? action.overlay : {};
            update = {overlay};
            break;

        case USER_LOGGED_IN:
            update = {user: action.user, userState: USER_STATE_VALIDATED};
            break;

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
            if (action.userInvalidReason) {
                update.userInvalidReason = action.userInvalidReason;
            }
            break;

        case '@@redux/INIT':
            break;

        default:
            console.log('strange action:', action);
            throw new Error('cannot recognize action ', action);
    }

    var newState = Object.assign({lan: 'en'}, pState || initialState, update);
    if (newState.user){
        if (!(newState.user instanceof User)){
            newState.user = new User(newState.user);
        }
    }

    return newState;
};

export default state;
