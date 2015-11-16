/**
 * This is a "gateway" adapter to user authentication.
 * It doesn't validate user credentials directly but accepts an authentication method
 * that the developer can inject to perform asynchronous authentication.
 * @type {string}
 */

export const VALIDATION_METHOD_TYPE_SYNC = 'SYNC';
export const VALIDATION_METHOD_TYPE_ASYNC = 'ASYNC';
export const VALIDATION_METHOD_TYPE_PROMISE = 'PROMISE';

const METHODS = [VALIDATION_METHOD_TYPE_SYNC,
    VALIDATION_METHOD_TYPE_ASYNC,
    VALIDATION_METHOD_TYPE_PROMISE];

var methodType = VALIDATION_METHOD_TYPE_SYNC;

var validationMethod = () => {
    console.log('warning: validation method has not been overridden; ' +
        'please inject an app-specific user validator via setUserValidation. ');
    return false;
}; // until setUserValidation is called, no validation will happen.

export const setUserValidation = (pValidationMethod, pMethodType) => {
    validationMethod = pValidationMethod;
    methodType = pMethodType;
    console.log('method: ', pValidationMethod, 'type:', pMethodType);
    if (!METHODS.includes(pMethodType)) {
        throw new Error('bad method type ' + (pMethodType || '(none)'));
    }
};

/**
 * note - regardless of the actual method's response system,
 * ActionValidate always returns a promise.
 *
 * ASSUMPTIONS:
 *   PROMISE: the validationMethod takes one argument, the users' credentials; and it returns a promise.
 *   ASYNC: the validationMethod takes two arguments; the users' credentials, and a callback in the form (err, result).
 *   SYNC: the validationMethod takes one argument, the users' credentials; it returns true or false.
 *
 * @param userData
 */
export const auth = (userData) => {
    var response = null;
    switch (methodType) {
        case VALIDATION_METHOD_TYPE_PROMISE:
            response = validationMethod(userData);
            break;

        case VALIDATION_METHOD_TYPE_ASYNC:
            response = new Promise((resolve, reject) => validationMethod(userData, (err, result) => err ? reject(err) : resolve(result)));
            break;

        case VALIDATION_METHOD_TYPE_SYNC:
            response = new Promise((resolve, reject) => validationMethod(userData) ? resolve() : reject());
            break;

        default:
            throw new Error('cannot understand methodType ' + methodType);
    }
    return response;
};
