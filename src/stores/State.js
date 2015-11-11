import { USER_LOGIN, USER_LOGOFF } from './../actions/Actions';

const initialState = {
    user: null
};

const state = (pState, action) => {
    let lState = pState || Object.assign({}, initialState);
    // eslint is squeamish about modifying input parameters, so...

    switch (action.type) {
        case USER_LOGIN:
            lState = Object.assign({}, lState, {user: action.user});
            break;

        case USER_LOGOFF:
            lState = Object.assign({}, lState, pState, {user: null});
            break;

        default:
            throw new Error('cannot recognize action ', action.type);
    }
    return lState;
};

export default state;
