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

const emailFactory = (params) => regexFactory({limit: /[.*]+@[\w]+\.[\w.]+}/});

class FieldDefValidator {
    constructor(pFieldDef, pTest, pMessage) {
        this.fieldDef = pFieldDef;
        this.test = pTest;
        this.message = pMessage;
        this.update();
    }

    get message() {
        return this._message;
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

    set message(pMessage) {
        if (!pMessage) {
            this._message = '';
            return;
        }
        let m = sRE.exec(pMessage);
        if (m) {
            this._message = m[1];
        } else {
            this._message = pMessage;
        }
    }

    update(newValue) {
        this.valid = this.test(newValue);
    }
}

class FieldDef {
    constructor(name, value, fieldType, params) {
        this.name = name;
        this.label = '';
        this.placeholder = '';
        this.ee = new EventEmitter();
        this.validators = [];
        this.fieldType = fieldType || 'text';
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
        }
        this.fieldValue = value;
    }

    addVD(pType, pMessage, pParams) {
        this.validators.push(new FieldDefValidator(this, pType, pMessage, pParams));
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
        return this._label;
    }

    watch(handler) {
        return this.ee.on('change', handler);
    }

    unwatch(handler) {
        return this.ee.off('change', handler);
    }

    set label(pLabel) {
        if (!pLabel) {
            this._label = pLabel;
            return;
        }
        var m = sRE.exec(pLabel);
        if (m) {
            this._label = this.s(m[1]);
        } else {
            this._label = pLabel;
        }
    }

    get placeholder() {
        return this._placeholder;
    }

    set placeholder(pPlaceholder) {
        var m = sRE.exec(pPlaceholder);
        if (m) {
            this._placeholder = this.s(m[1]);
        } else {
            this._placeholder = pPlaceholder;
        }
    }

    get errors() {
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

export {FieldDef, FieldDefValidator};
