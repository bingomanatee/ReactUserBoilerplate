import strings from './Strings';
const EventEmitter = require('eventemitter3');
const sRE = /^s\.(.*)/;

/**
 * returns a test that is true if the value is a string under limit characters long
 * @param params
 */
const minFactory = (params) => (value) => (typeof value === 'string') && ( value.length >= params.limit);

/**
 * returns a test that is true if the value is a string at least limit characters long
 * @param params
 */
const maxFactory = (params) => (value) => (typeof value === 'string') && ( value.length <= params.limit);

/**
 * combines the features of min and max
 * @param params
 */
const rangeFactory = (params) => (value) => (typeof value === 'string') && ( value.length >= params.limit[0]) && (value.length <= params.limit[1]);

const regexFactory = (params) => (value) => (typeof value === 'string') && params.limit.test(value);

const emailFactory = (params) => regexFactory({limit: /.+@.*\..*/});

class Translatable {
    constructor(s) {
        this.s = s;
        this._memos = {};
    }

    _translate(str) {
        if (!this._memos.hasOwnProperty(str)) {
            const m = sRE.exec(str);
            if (m) {
                this._memos[str] = this.s ? this.s(m[1]) : m[1];
            } else {
                this._memos[str] = str;
            }
        }
        return this._memos[str];
    }
}

class FieldDefValidator extends Translatable {
    constructor(pFieldDef, pTest, pMessage, pTranslation) {
        super(pTranslation);
        this.fieldDef = pFieldDef;
        this.test = pTest;
        this.message = pMessage;
        this.update();
    }


    set test(pTest) {
        if (typeof pTest === 'function') {
            this._test = pTest;
        } else {
            switch (pTest.type) {
                case 'min':
                    this._test = minFactory(pTest);
                    break;

                case 'max':
                    this._test = maxFactory(pTest);
                    break;

                case 'range':
                    this._test = rangeFactory(pTest);
                    break;

                case 'regex':
                    this._test = regexFactory(pTest);
                    break;

                case 'email':
                    this._test = emailFactory(pTest);
                    break;

                default:
                    console.log('strange error: ', pTest);
                    throw new Error('strange test ');
            }
        }
    }

    get test() {
        return this._test;
    }

    get message() {
        return this._translate(this._message);
    }

    set message(pMessage) {
        this._message = pMessage;
    }

    update(newValue) {
        this.valid = this.test(newValue);
    }
}

/**
 * form-related metadata around a field value.
 *
 * note; fields are assumed to be required unless isOptional is true;
 *
 * when it comes to whether a value is set or not the hasValue field is polled;
 * it can be overridden by a mixin from params. This is important because there are cases
 * when a falsy value (false, '', 0) may actually be a valid option.
 *
 */
class FieldDef extends Translatable {
    constructor(name, value, fieldType, params) {
        super(params ? params.s : null);
        this.name = name;
        this.requiredMessage = 's.required';
        this.label = '';
        this.placeholder = '';
        this.ee = new EventEmitter();
        this.validators = [];
        if (params) {
            this.s = params.s || strings(params.comp, params.label);
            if (params.label) {
                this.label = params.label;
            }

            if (params.placeholder) {
                this.placeholder = params.placeholder;
            }

            if (params.validators) {
                params.validators.forEach((v) => this.addVD.apply(this, v));
            }

            if (params.hasOwnProperty('isOptional')) {
                this.isOptional = params.isOptional;
            }

            if (params.hasValue) {
                this.hasValue = params.hasValue;
            }

            if (params.requiredMessage) {
                this.requiredMessage = params.requiredMessage;
            }
        }
        this.fieldType = fieldType || 'text';
        this.fieldValue = value;
    }

    destroy () {
        this.ee.removeAllListeners();
    }

    addVD(pTest, pMessage) {
        this.validators.push(new FieldDefValidator(this, pTest, pMessage, this.s));
    }

    hasValue() {
        return this.fieldValue; // standard js truthiness;
    }

    set requiredMessage(pMessage) {
        this._requiredMessage = pMessage;
    }

    get requiredMessage() {
        return this._translate(this._requiredMessage);
    }

    get isOptional() {
        return this._isOptional;
    }

    set isOptional(pValue) {
        this._isOptional = !!pValue;
    }

    set fieldValue(pValue) {
        this._fieldValue = pValue;
        this.validators.forEach(val => val.update());
        this.ee.emit('change', this._fieldValue);
    }

    get fieldValue() {
        return this._fieldValue;
    }

    get label() {
        return this._translate(this._label);
    }

    watch(handler) {
        return this.ee.on('change', handler);
    }

    unwatch(handler) {
        return this.ee.off('change', handler);
    }

    set label(pLabel) {
        this._label = pLabel;
    }

    get placeholder() {
        return this._translate(this._placeholder);
    }

    set placeholder(pPlaceholder) {
        this._placeholder = pPlaceholder;
    }

    get errors() {
        if (!this.hasValue()) {
            return this.isOptional ? null : this.requiredMessage;
        }
        var val = this.fieldValue;
        return this.validators.reduce(function (memo, validator) {
            if (memo) {
                return memo;
            }

            if (!validator.test(val)) {
                return validator.message;
            }
            return null;
        }, null);
    }
}

export {FieldDef, Translatable, FieldDefValidator};
