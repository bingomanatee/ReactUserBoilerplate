/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './RegisterPage.css';
import Strings from './../../utils/Strings';
import _ from 'lodash';

const MIN_USERNAME_LENGTH = 4;
const MAX_USERNAME_LENGTH = 12;

const MIN_PASSWOORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 20;

const MIN_BIO_LENGTH = 0;
const MAX_BIO_LENGTH = 1000;

const boundsMessage = (value, min, max, name, label) => {
    const length = value.length;
    const s = Strings('RegisterPage');
    var msg = '';

    var fieldName = label || name;
    if (length < min) {
        msg = s.shortAlert.replace('@FIELD@', fieldName).replace('@MIN@', min).replace('@LENGTH@', length);
        return {className: 'error', msg: msg};
    }
    if (length > max) {
        msg = s.longAlert.replace('@FIELD@', fieldName).replace('@MAX@', max).replace('@LENGTH@', length);
        return {className: 'error', msg: msg};
    }
    return {};
}

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

        if (!this.state.username) {
            return out;
        }
        return Object.assign(out, boundsMessage(this.state.username, MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH, 'username'));
    }

    _pwFeedback() {
        let out = {className: '', msg: ''};

        if (!this.state.password) {
            return out;
        }
        out = Object.assign(out, boundsMessage(this.state.password, MIN_PASSWOORD_LENGTH, MAX_PASSWORD_LENGTH, 'password'));

        return out.msg ? out : this._passwordMatchFeedback(out);
    }

    _pw2feedback() {
        let out = {className: '', msg: ''};

        if (!this.state.password2) {
            return out;
        }
        out = Object.assign(out, boundsMessage(this.state.password2, MIN_PASSWOORD_LENGTH, MAX_PASSWORD_LENGTH, 'password2', 'second password'));
        return out.msg ? out : this._passwordMatchFeedback(out);
    }

    _passwordMatchFeedback(out) {
        if (!(this.state.password && this.state.password2)) {
            return out;
        }
        if (this.state.password === this.state.password2) {
            return out;
        }
        const s = Strings('RegisterPage');
        const message = s.pwMissmatch;

        return Object.assign(out, {
            className: 'error',
            msg: message
        });
    }

    render() {
        const s = Strings('RegisterPage');
        const unValueLink = this._valueLink('username');
        const pwValueLink = this._valueLink('password');
        const pw2ValueLink = this._valueLink('password2');
        const bioLink = this._valueLink(('bio'));
        console.log('this.state: ', this.state);
        const unFeedback = this.usernameFeedback();
        const pwFeedback = this._pwFeedback();
        const pw2Feedback = this._pw2feedback();

        const isValid = (!(unFeedback.msg || pwFeedback.msg || pw2Feedback.msg)) && this.state.username && this.state.password && this.state.password2;
        return (
            <div className="RegisterPage">
                <div className="RegisterPage-container">
                    <h1>{s.title}</h1>
                    <p>{s.text}</p>
                    <form className="form LoginPage__form">
                        <div className="form-row">
                            <label>{s.username}</label>
                            <div className="form-row__input">
                                <input type="text" name="username" valueLink={unValueLink}/>
                                <p className={unFeedback.className}>
                                    <small>{unFeedback.msg}</small>
                                </p>
                            </div>
                        </div>
                        <div className="form-row">
                            <label>{s.password}</label>
                            <div className="form-row__input">
                                <input type="password" name="password" valueLink={pwValueLink}/>
                                <p className={pwFeedback.className}>
                                    <small>{pwFeedback.msg}</small>
                                </p>
                            </div>
                        </div>
                        <div className="form-row">
                            <label>{s.password2}</label>
                            <div className="form-row__input">
                                <input type="password" name="password2" valueLink={pw2ValueLink}/>
                                <p className={pw2Feedback.className}>
                                    <small>{pw2Feedback.msg}</small>
                                </p>
                            </div>
                        </div>
                        <div className="form-row">
                            <label>{s.bio}</label>
                            <div className="form-row__input">
                                <textarea name="bio" valueLink={bioLink}/>
                                <p>
                                    <small>{s.bioNotes}</small>
                                </p>
                            </div>
                        </div>
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
