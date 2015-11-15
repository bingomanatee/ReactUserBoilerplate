/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './LoginPage.css';
import withStyles from '../../decorators/withStyles';
import strings from './../../utils/Strings';
import FormDefField from '../FormDefField';
import {FieldDef } from './../../utils/FieldDef';
import {MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, REQUIRE_EMAIL, ASK_EMAIL, REQUIRE_USERNAME, ASK_USERNAME } from '../../config';
import html from '../../core/HttpClient';
import FormErrors from '../FormErrors';

const MIN_SUBMIT_GAP = 1000;
const MAX_TRIES = 5;
const ERROR_DURATION = 5 * 1000;

@withStyles(styles)
class LoginPage extends Component {

    constructor() {
        super();
        this.state = {
            locked: false,
            email: '',
            username: '',
            password: '',
            isError: false,
            formFeedback: '',
            submitTimeBuffer: []
        };

        this.s = strings('LoginPage');
    }

    componentWillUnmount() {
        this._clearFeedback(false);
    }

    _lockUp() {
        const locked = true;
        this.setState({locked});
    }

    _setFeedback(key, pIsError) {
        this._clearFeedback(true);
        const isError = !!pIsError;
        const formFeedback = this.s(key);
        this.setState({formFeedback, isError});
        this.eto = setTimeout(() => {
            if (this.state.formFeedback === formFeedback) {
                this._clearFeedback();
            }
        }, ERROR_DURATION);
    }

    _clearFeedback(dontEraseState) {
        if (this.eto) {
            clearTimeout(this.eto);
        }
        if (!dontEraseState) {
            this.setState({formError: ''});
        }
    }

    _save() {
        if (this.state.submitTimeBuffer.length > MAX_TRIES) {
            return this._lockUp();
        }
        var time = new Date().getTime();
        var lastTime = this.state.submitTimeBuffer[this.state.submitTimeBuffer.length - 1] || 0;
        if (time - lastTime < MIN_SUBMIT_GAP) {
            return false;
        }

        this.state.submitTimeBuffer.push(time);

        const username = this.state.username || '';
        const password = this.state.password || '';
        const email = this.state.email || '';

        if (REQUIRE_USERNAME && !username) {
            return this._setFeedback('usernameRequired');
        }
        if (REQUIRE_EMAIL && !email) {
            return this._setFeedback('emailRequired');
        }
        if (!password) {
            return this._setFeedback('passwordRequired');
        }
        // call getValue() to get the values of the form
        var data = {
            username, password, email
        };

        this._setFeedback('loggingIn');
    }

    _isValid() {
        if (this.refs.password) {
            if (this.refs.password.def.errors) {
                return false;
            }
        }

        if (this.refs.username) {
            if (this.refs.username.def.errors) {
                return false;
            }
        }

        if (this.refs.email) {
            if (this.refs.email.def.errors) {
                return false;
            }
        }

        return true;
    }

    render() {
        console.log('state of Login Page:', this.state, this.s);
        if (this.state.locked) {
            return (
                <div className="RegisterPage container-frame">
                    <div className="RegisterPage-container container-frame__inner">
                        <h1>Maximum Tries Exceeded</h1>
                        <p>Please reload the browser page and try again.</p>
                    </div>
                </div>);
        }

        var identity = [];
        if (ASK_EMAIL) {
            const emailDef = new FieldDef('email', this.state.email, 'text', {
                s: this.s,
                label: 's.email',
                placeholder: 's.emailPlaceholder',
                validators: [
                    [{type: 'email'}, 's.emailError']
                ]
            });

            emailDef.watch(email => this.setState({email}));
            identity.push(<FormDefField ref="email" key={1} def={emailDef}/>);
        }

        if (ASK_USERNAME) {
            const usernameDef = new FieldDef('username', this.state.username, 'text', {
                s: this.s,
                label: 's.username',
                placeholder: 's.usernamePlaceholder',
                validators: []
            });
            usernameDef.watch(username => this.setState({username}));
            identity.push(<FormDefField ref="username" key={2} def={usernameDef}/>);
        }

        const passwordDef = new FieldDef('password', this.state.password, 'password', {
            s: this.s,
            label: 's.password',
            placeholder: 's.passwordPlaceholder'
        });
        passwordDef.watch(password => this.setState({password}));

        return (
            <div className="RegisterPage container-frame">
                <div className="RegisterPage-container container-frame__inner">
                    <h1>{this.s('title')}</h1>
                    <p>{this.s('text')}</p>
                    <form className="form LoginPage__form">
                        {identity}
                        <FormDefField ref="password" def={passwordDef}/>
                        <div className="form-row form-row-button-row">
                            <button className="secondary" type="Cancel">Cancel</button>
                            <button className="last" type="button" onClick={this._save.bind(this)}
                                    disabled={!this._isValid()}>
                                Register
                            </button>
                        </div>
                        <FormErrors isError={this.state.isError} feedback={this.state.formFeedback}/>
                    </form>
                </div>
            </div>);
    }

}

export default LoginPage;
