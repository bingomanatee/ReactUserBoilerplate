/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './RegisterPage.css';
import strings from './../../utils/Strings';
import _ from 'lodash';
import FormField from './../FormField';
import http from './../../core/HttpClient';
import {MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, REQUIRE_EMAIL, ASK_EMAIL, REQUIRE_USERNAME, ASK_USERNAME } from '../../config';

const EMAIL_MISSING = 'email missing';
const EMAIL_BAD = 'email bad';

const MISSING = 'missing';
const BOUNDS = 'bounds';
const MISMATCH = 'mismatch';

const boundsMessage = (value, min, max, name, label) => {
    const length = value.length;
    const s = strings('RegisterPage');
    var msg = '';

    var fieldName = label || name;
    if (length < min) {
        msg = s('shortAlert', {FIELD: fieldName, LENGTH: length});
        return {className: 'error', msg: msg};
    }
    if (length > max) {
        msg = s('longAlert', {FIELD: fieldName, MAX: max, LENGTH: length});
        return {className: 'error', msg: msg};
    }
    return {};
};

const outOfBounds = (str, min, max) => str.length < min || str.length > max;
const emailRE = /[\w]+\@[\w]+\.[\w.]+/;
const emailMessage = (value, name, label) => {
    if (!emailRE.test(value)) {
        const s = strings('RegisterPage');
        return {
            className: 'error',
            msg: s('badEmail')
        };
    }
    return {};
};

@withStyles(styles)
class RegisterPage extends Component {

    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            password2: '',
            bio: ''
        };
    }

    handleFieldChange(value, name) {
        var change = {};
        change[name] = value;
        this.setState(change);
    }

    _valueLink(fieldName) {
        return {
            value: this.state[fieldName],
            requestChange: _.partial(this.handleFieldChange.bind(this), _, fieldName)
        };
    }

    usernameFeedback() {
        const out = {className: '', msg: ''};

        if (!this.state.username) { // if an item is blank assume the user hasn't gotten to it and don't provide feedback
            return out;
        }
        return Object.assign(out, boundsMessage(this.state.username, MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH, 'username'));
    }

    emailFeedback() {
        const out = {className: '', msg: ''};
        if (!this.state.email) { // if an item is blank assume the user hasn't gotten to it and don't provide feedback
            return out;
        }
        return Object.assign(out, emailMessage(this.state.email, 'email'));
    }

    _pwFeedback() {
        let out = {className: '', msg: ''};

        if (!this.state.password) { // if an item is blank assume the user hasn't gotten to it and don't provide feedback
            return out;
        }
        out = Object.assign(out, boundsMessage(this.state.password, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, 'password'));

        return out.msg ? out : this._passwordMatchFeedback(out);
    }

    _pw2feedback() {
        let out = {className: '', msg: ''};

        if (!this.state.password2) { // if an item is blank assume the user hasn't gotten to it and don't provide feedback
            return out;
        }
        out = Object.assign(out, boundsMessage(this.state.password2, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, 'password2', 'second password'));
        return out.msg ? out : this._passwordMatchFeedback(out);
    }

    _passwordMatchFeedback(out) {
        if (!(this.state.password && this.state.password2)) { // if either item is blank assume the user hasn't gotten to it and don't provide feedback
            return out;
        }
        if (this.state.password === this.state.password2) {
            return out;
        }
        const s = strings('RegisterPage');
        const message = s('pwMissmatch');

        return Object.assign(out, {
            className: 'error',
            msg: message
        });
    }

    _pwValid() {
        if (!this.state.password) {
            return MISSING;
        }
        if (this.state.password.length < MIN_PASSWORD_LENGTH) {
            return BOUNDS;
        }
        if (this.state.password.length > MAX_PASSWORD_LENGTH) {
            return BOUNDS;
        }
        if (this.state.password !== this.state.password2) {
            return MISMATCH;
        }
        return true;
    }

    _pw2valid() {
        if (!this.state.password2) {
            return MISSING;
        }
        if (outOfBounds(this.state.password2, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH)) {
            return BOUNDS;
        }
        return true;
    }

    _unValid() {
        if (REQUIRE_USERNAME && !this.state.username) {
            return MISSING;
        }

        if (this.state.username && outOfBounds(this.state.username, MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH)) {
            return BOUNDS;
        }
        return true;
    }

    _emailValid() {
        if (REQUIRE_EMAIL && !this.state.email) {
            return EMAIL_MISSING;
        }
        if (this.state.email) {
            if (!emailRE.test(this.state.email)) {
                return EMAIL_BAD;
            }
        }
        if (this.state.emailRegError) {
            return this.state.emailRegError;
        }
        return true;
    }

    _isValid() {
        return (this._pwValid() === true) && (this._pw2valid() === true) && (this._emailValid() === true) && (this._unValid() === true);
    }

    _register() {
        if (!this._isValid()) {
            console.log('this should never happen');
            return false;
        }

        const s = strings('RegisterPage');
        this.setState({
            generalRegError: '',
            emailRegError: '',
            sendState: s('sendingReg')
        });

        try {
            http.post('/api/users', _.pick(this.state, 'username,password,email,bio'.split(',')))
                .then(this._handleGoodReg.bind(this), this._handleRegError.bind(this));
        } catch (err) {
            console.log('error thrown in post: ', err);
        }
        return false;
    }

    _handleGoodReg(result) {
        console.log('result of registration: ', result);
        const s = strings('RegisterPage');
        this.setState({sendState: s('goodReg')});
    }

    _handleRegError(err) {
        console.log('handling reg error: ', err);
        const s = strings('RegisterPage');
        this.setState({sendState: ''});
        if (err && err.response && err.response.body.code) {
            switch (err.response.body.code) {
                case 'EMAIL_TAKEN':
                    this.setState({generalRegError: s('emailRegErrorTaken', {email: this.state.email})});
                    break;

                default:
                    this.setState({generalRegError: s('generalRegError')});
            }
        } else {
            this.setState({generalRegError: s('generalRegError')});
        }
    }

    render() {
        const s = strings('RegisterPage');
        const pwValueLink = this._valueLink('password');
        const pw2ValueLink = this._valueLink('password2');
        const bioLink = this._valueLink(('bio'));
        const pwFeedback = this._pwFeedback();
        const pw2Feedback = this._pw2feedback();

        const passwordPlaceholder = s('passwordPlaceholder', {MIN: MIN_PASSWORD_LENGTH, MAX: MAX_PASSWORD_LENGTH});
        const password2Placeholder = s('password2Placeholder', {MIN: MIN_PASSWORD_LENGTH, MAX: MAX_PASSWORD_LENGTH});

        const identity = [];

        const STR_OPTIONAL = s('optional');

        if (ASK_USERNAME) {
            const unFeedback = this.usernameFeedback();
            const unValueLink = this._valueLink('username');
            const STR_USERNAME = s('username');
            var unPlaceholder = REQUIRE_USERNAME ? s('usernameRange', {
                MIN: MIN_USERNAME_LENGTH,
                MAX: MAX_USERNAME_LENGTH
            }) : s('usernameOptional');
            identity.push(<FormField type="text" label={STR_USERNAME} name="username" valueLink={unValueLink} key={0}
                                     placeholder={unPlaceholder} feedback={unFeedback}/>);
        }
        if (ASK_EMAIL) {
            const emailFeedback = this.emailFeedback();
            const emailValueLink = this._valueLink('email');
            const STR_EMAIL = s('email');
            var emailPlaceholder = REQUIRE_EMAIL ? `${STR_EMAIL}` : `${STR_EMAIL} (${STR_OPTIONAL})`;
            identity.push(<FormField type="text" label={STR_EMAIL} name="email" valueLink={emailValueLink} key={1}
                                     placeholder={emailPlaceholder} feedback={emailFeedback}/>);
        }

        return (
            <div className="RegisterPage">
                <div className="RegisterPage-container">
                    <h1>{s('title')}</h1>
                    <p>{s('text')}</p>
                    <form className="form LoginPage__form">
                        {identity}
                        <FormField type="password" label={s('password')} name={'password'} valueLink={pwValueLink}
                                   placeholder={passwordPlaceholder}
                                   feedback={pwFeedback}/>
                        <FormField type="password" label={s('password2')} name={'password2'} valueLink={pw2ValueLink}
                                   placeholder={password2Placeholder}
                                   feedback={pw2Feedback}/>
                        <FormField type="textarea" label={s('bio')} name={'bio'} valueLink={bioLink}
                                   placeholder={s('bioPlaceholder')} feedback={false}/>
                        <div className="form-row form-row-button-row">
                            <button className="secondary" type="Cancel">Cancel</button>
                            <button type="button" onClick={this._register.bind(this)} disabled={!this._isValid()}>
                                Register
                            </button>
                        </div>
                        <div className="form-row">
                            <label>&nbsp;</label>
                            <div className="form-row__input">
                                <p className="form-status">
                                    <small>{this.state.sendState}</small>
                                </p>
                                <p className="form-error error">
                                    <small>{this.state.generalRegError}</small>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

}

export default RegisterPage;
