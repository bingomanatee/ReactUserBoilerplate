/**
 * Action Names
 * @type {string}
 */
const USER_LOGIN = 'USER_LOGIN'; // submit user credentials
const USER_LOGOFF = 'USER_LOGOFF'; // remove user session
const USER_LOGGED_IN = 'USER_LOGGED_IN'; // injecting user in to state -- one-step

const USER_LOGIN_VALID = 'USER_LOGIN_VALID'; // feedback from server
const USER_LOGIN_INVALID = 'USER_LOGIN_INVALID'; // feedback from server

const USER_REG = 'USER_REG'; // submit user credendials

const USER_REG_VALID = 'USER_REG_VALID'; // feedback from server
const USER_REG_INVALID = 'USER_REG_INVALID';// feedback from server

const USER_RESET_ANON = 'USER_RESET_ANON';
const OVERLAY = 'OVERLAY';
const RESIZE = 'RESIZE';

/**
 * State Names
 * @type {string}
 */
const USER_STATE_ANON = 'USER_STATE_ANON'; // no logged in user

const USER_STATE_LOGIN_SUBMITTED = 'USER_STATE_LOGIN_SUBMITTED'; // user credentials submtted to server
const USER_STATE_VALIDATED = 'USER_STATE_VALIDATED'; // server validates user credentials
const USER_STATE_LOGIN_REJECTED = 'USER_STATE_LOGIN_REJECTED'; // server rejects user credentials

const USER_STATE_REG_SUBMITTED = 'USER_STATE_REG_SUBMITTED';
const USER_STATE_REG_REJECTED = 'USER_STATE_REG_REJECTED';
const USER_STATE_REG_ACCEPTED = 'USER_STATE_REG_ACCEPTED';

/**
 * this action is called when a login attempt is submitted.
 *
 * @param user
 */
const logIn = (user) => ({type: USER_LOGIN, user: user});

/**
 * this action is called when the server validates the credentials.
 * This state will persist through the lifetime of the app until the user logs off.
 */
const logInGood = (user) => {
    console.log('feedback from logInGood: ========', user);
    return {type: USER_LOGIN_VALID, user: user};
};

/**
 * this action is called if the users credentials are rejected.
 * If more detailed information is returned, that information is stored as the userInvalidReason.
 * this optional parameter will be false if omitted
 */
const loginBad = (reason = false) => ({type: USER_LOGIN_INVALID, userInvalidReason: reason});

/**
 * call this action after receiving login rejection to reset the state
 * to USER_STATE_ANON. Does not flush user data (call logoff for that).
 */
const resetAnon = () => ({type: USER_RESET_ANON});

/**
 * this action is called to inject a user into the system from session.
 * Useful if the user reloads the paae after having logged in successfully
 */
const alreadyLoggedIn = (user) => ({type: USER_LOGGED_IN, user: user});

const logOff = () => ({type: USER_LOGOFF});

/**
 * this action is called when a user submits a new user dataset.
 */
const reg = (user) => ({type: USER_REG, user: user});

/**
 * this action is called if the user's reg dataset is accepted.
 * The user is NOT immediately logged in; they still have to log in normally
 */
const regGood = () => ({type: USER_REG_VALID});

/**
 * call this action after the user's reg data is rejected.
 * @param reason
 */
const regBad = (reason = false) => ({type: USER_REG_INVALID, regInvalidReason: reason});

/**
 * call this action to show, change or hide the overlay that blocks pending action.
 * @param olState
 */
const overlay = (olState) => ({type: OVERLAY, overlay: olState});

const resize = (width, height) => ({type: RESIZE, width: width, height: height});

export {
    logIn,
    logOff,
    logInGood,
    loginBad,
    resetAnon,
    alreadyLoggedIn,
    resize,

    reg,
    regGood,
    regBad,

    overlay,

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
};

