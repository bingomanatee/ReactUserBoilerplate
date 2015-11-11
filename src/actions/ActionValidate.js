/**
 * This is a "metavalidation" adapter. It doesn't validate user credentials directly
 * @type {string}
 */

const VALIDATION_METHOD_TYPE_SYNC = 'SYNC';
const VALIDATION_METHOD_TYPE_ASYNC = 'ASYNC';
const VALIDATION_METHOD_TYPE_PROMISE = 'PROMISE';

var methodType = VALIDATION_METHOD_TYPE_SYNC;

var validationMethod = () => false; // until setUserValidation is called, no validation will happen.

const setUserValidation = (pValidationMethod, pMethodType) => {
    validationMethod = pValidationMethod;
    methodType = pMethodType;
};

export {
    setUserValidation,
    VALIDATION_METHOD_TYPE_SYNC,
    VALIDATION_METHOD_TYPE_ASYNC,
    VALIDATION_METHOD_TYPE_PROMISE
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
export default (userData) => {
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
