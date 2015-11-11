/**
 * Action Names
 * @type {string}
 */
const USER_LOGIN = 'USER_LOGIN';
const USER_LOGOFF = 'USER_LOGOFF';
const USER_LOGIN_VALID = 'USER_LOGIN_VALID';
const USER_LOGIN_INVALID = 'USER_LOGIN_INVALID';

/**
 * State Names
 * @type {string}
 */
const USER_STATE_ANON = 'USER_STATE_ANON';
const USER_STATE_LOGIN_SUBMITTED = 'USER_STATE_LOGIN_SUBMITTED';
const USER_STATE_VALIDATED = 'USER_STATE_VALIDATED';
const USER_STATE_LOGIN_REJECTED = 'USER_STATE_LOGIN_REJECTED';

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
const logInGood = () => ({type: USER_LOGIN_VALID});

/**
 * this action is called if the users credentials are rejected.
 * If more detailed information is returned, that information is stored as the userInvalidReason.
 * this optional parameter will be false if omitted
 */
const loginBad = (reason = false) => ({type: USER_LOGIN_INVALID, userInvalidReason: reason});

/**
 * this action is called when a logoff attempt is submitted;
 * it is assumed to be successful.
 */

const logOff = () => ({type: USER_LOGOFF});

export {
    logIn,
    logOff,
    logInGood,
    loginBad,

    USER_LOGIN,
    USER_LOGOFF,
    USER_LOGIN_VALID,
    USER_LOGIN_INVALID,

    USER_STATE_ANON,
    USER_STATE_LOGIN_SUBMITTED,
    USER_STATE_VALIDATED,
    USER_STATE_LOGIN_REJECTED
};

