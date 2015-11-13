/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './RegisterPage.css';
import strings from './../../utils/Strings';
import _ from 'lodash';
import FormField from './../FormField';

const MIN_USERNAME_LENGTH = 4;
const MAX_USERNAME_LENGTH = 12;

const MIN_PASSWOORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 20;
/*
 const MIN_BIO_LENGTH = 0;
 const MAX_BIO_LENGTH = 1000;
 */

const REQUIRE_EMAIL = true;
const ASK_EMAIL = true;
const REQUIRE_USERNAME = false;
const ASK_USERNAME = false;

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

const emailMessage = (value, name, label) => {
    var fieldName = label || name;
    if (!/[\w]+\@[\w]+\.[\w.]+/.test(value)) {
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
        out = Object.assign(out, boundsMessage(this.state.password, MIN_PASSWOORD_LENGTH, MAX_PASSWORD_LENGTH, 'password'));

        return out.msg ? out : this._passwordMatchFeedback(out);
    }

    _pw2feedback() {
        let out = {className: '', msg: ''};

        if (!this.state.password2) { // if an item is blank assume the user hasn't gotten to it and don't provide feedback
            return out;
        }
        out = Object.assign(out, boundsMessage(this.state.password2, MIN_PASSWOORD_LENGTH, MAX_PASSWORD_LENGTH, 'password2', 'second password'));
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

    render() {
        const s = strings('RegisterPage');
        const pwValueLink = this._valueLink('password');
        const pw2ValueLink = this._valueLink('password2');
        const bioLink = this._valueLink(('bio'));
        console.log('this.state: ', this.state);
        const pwFeedback = this._pwFeedback();
        const pw2Feedback = this._pw2feedback();

        var isValid = (!(pwFeedback.msg || pw2Feedback.msg)) && this.state.username && this.state.password && this.state.password2;

        const identity = [];

        const STR_OPTIONAL = s('optional');

        if (ASK_USERNAME) {
            const unFeedback = this.usernameFeedback();
            const unValueLink = this._valueLink('username');
            const STR_USERNAME = s('username');
           if (REQUIRE_USERNAME) isValid = isValid && (!unFeedback.msg);
            var unPlaceholder = REQUIRE_USERNAME ? `${STR_USERNAME} (${MIN_USERNAME_LENGTH}..${MAX_USERNAME_LENGTH} ${s('lettersLong')})` : `${STR_USERNAME} (${STR_OPTIONAL})`;
            identity.push(<FormField type="text" label={STR_USERNAME} name="username" valueLink={unValueLink}
                                     placeholder={unPlaceholder} feedback={unFeedback}/>);
        }
        if (ASK_EMAIL) {
            const emailFeedback = this.emailFeedback();
            const emailValueLink = this._valueLink('email');
            const STR_EMAIL = s('email');
            if (REQUIRE_EMAIL) isValid = isValid && (!emailFeedback.msg);
            var emailPlaceholder = REQUIRE_EMAIL ? `${STR_EMAIL}` : `${STR_EMAIL} (${STR_OPTIONAL})`;
            identity.push(<FormField type="text" label={STR_EMAIL} name="email" valueLink={emailValueLink}
                                     placeholder={emailPlaceholder} feedback={emailFeedback}/>);
        }

        return (
            <div className="RegisterPage">
                <div className="RegisterPage-container">
                    <h1>{s('title')}</h1>
                    <p>{s('text')}</p>
                    <form className="form LoginPage__form">
                        {identity}
                        <FormField type="password" label={s('password')} name="password" valueLink={pwValueLink}
                                   placeholder={`${s('password')} (${MIN_PASSWOORD_LENGTH}..${MAX_PASSWORD_LENGTH} ${s('lettersLong')})`}
                                   feedback={pwFeedback}/>
                        <FormField type="password" label={s('password2')} name="password2" valueLink={pw2ValueLink}
                                   placeholder={`${s('password2')} (${MIN_PASSWOORD_LENGTH}..${MAX_PASSWORD_LENGTH} ${s('lettersLong')})`}
                                   feedback={pw2Feedback}/>
                        <FormField type="textarea" label={s('bio')} name="password2" valueLink={bioLink}
                                   placeholder={`${s('bio')} (${STR_OPTIONAL})`} feedback={false}/>
                        <div className="form-row form-row-button-row">
                            <button className="secondary" type="Cancel">Cancel</button>
                            <button type="Submit" disabled={!isValid}>Register</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

}

export default RegisterPage;
