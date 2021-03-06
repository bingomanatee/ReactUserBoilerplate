import {
    USER_LOGIN,
    USER_LOGOFF,
    USER_LOGIN_VALID,
    USER_LOGIN_INVALID,
    USER_RESET_ANON,
    USER_LOGGED_IN,

    USER_REG,
    USER_REG_VALID,
    USER_REG_INVALID,

    OVERLAY,
    RESIZE,

    USER_STATE_ANON,
    USER_STATE_LOGIN_SUBMITTED,
    USER_STATE_VALIDATED,
    USER_STATE_LOGIN_REJECTED,

    USER_STATE_REG_SUBMITTED,
    USER_STATE_REG_REJECTED,
    USER_STATE_REG_ACCEPTED
} from './../actions/Actions';
import User from './../utils/User';

const initialState = {
    user: null,
    lang: 'en',
    userState: USER_STATE_ANON
};

const state = (pState, action) => {
    let update = {};

    switch (action.type) {

        case RESIZE: {
            update = {width: action.width, height: action.height};
        }

        case OVERLAY:
            // note - an empty object will hide the overlay
            var overlay = action.overlay ? action.overlay : {};
            update = {overlay};
            break;

        case USER_LOGGED_IN:
            console.log('logged in with USER ========= ', action.user);
            update = {user: new User(action.user), userState: USER_STATE_VALIDATED};
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
            update = {userState: USER_STATE_VALIDATED, user: new User(action.user)};
            break;

        case USER_LOGIN_INVALID:
            update = {userState: USER_STATE_LOGIN_REJECTED};
            if (action.userInvalidReason) {
                update.userInvalidReason = action.userInvalidReason;
            }
            break;

        case USER_REG:
            update = {user: action.user, userState: USER_STATE_REG_SUBMITTED};
            break;

        case USER_REG_VALID:
            update = {user: null, userState: USER_STATE_REG_ACCEPTED};
            break;

        case USER_REG_INVALID:
            update = {userState: USER_STATE_REG_REJECTED};
            if (action.regInvalidReason) update.regInvalidReason = action.regInvalidReason;
            break;

        case '@@redux/INIT':
            break;

        default:
            console.log('strange action:', action);
            throw new Error('cannot recognize action ', action);
    }

    var newState = Object.assign({}, pState || initialState, update);

    return newState;
};

export default state;
