/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './LoginPage.css';
import withStyles from '../../decorators/withStyles';
import strings from './../../utils/Strings';
import FormDefField from '../FormDefField';
import {FieldDef } from './../../utils/FieldDef';
import {MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, REQUIRE_EMAIL, ASK_EMAIL, REQUIRE_USERNAME, ASK_USERNAME } from '../../config';
import html from '../../core/HttpClient';
import FormFeedback from '../FormFeedback';

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

        this.fieldDefs = new Map();
        this.s = strings('LoginPage');

        this._makeFieldDefs();
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
            this.setState({formFeedback: ''});
        }
    }

    _save() {
        const username = this.state.username || '';
        const password = this.state.password || '';
        const email = this.state.email || '';

        if (!this._isValid()) {
            this._setFeedback('formIncomplete', true);
            return
        }
        // call getValue() to get the values of the form
        var data = {
            username, password, email
        };

        this._setFeedback('loggingIn');
    }

    _makeFieldDefs() {
        this.fieldDefs.forEach(def => def.destroy());
        this.fieldDefs.clear();

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
            this.fieldDefs.set('email', emailDef);
        }

        if (ASK_USERNAME) {
            const usernameDef = new FieldDef('username', this.state.username, 'text', {
                s: this.s,
                label: 's.username',
                placeholder: 's.usernamePlaceholder',
                validators: []
            });
            usernameDef.watch(username => this.setState({username}));
            this.fieldDefs.set('username', usernameDef);
        }

        const passwordDef = new FieldDef('password', this.state.password, 'password', {
            s: this.s,
            label: 's.password',
            placeholder: 's.passwordPlaceholder'
        });
        passwordDef.watch(password => this.setState({password}));
        this.fieldDefs.set('password', passwordDef);
    }

    _isValid() {
        var isValid = true;

        this.fieldDefs.forEach(fieldDef => {
            if (isValid) {
                isValid = !fieldDef.errors;
            }
        });

        return isValid;
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
            identity.push(<FormDefField ref="email" key={1} def={this.fieldDefs.get('email')}/>);
        }

        if (ASK_USERNAME) {
            identity.push(<FormDefField ref="username" key={2} def={this.fieldDefs.get('username')}/>);
        }

        console.log('formFeedback: ----------- ', this.state.formFeedback);

        return (
            <div className="RegisterPage container-frame">
                <div className="RegisterPage-container container-frame__inner">
                    <h1>{this.s('title')}</h1>
                    <p>{this.s('text')}</p>
                    <form className="form LoginPage__form">
                        {identity}
                        <FormDefField ref="password" def={this.fieldDefs.get('password')}/>
                        <div className="form-row form-row-button-row">
                            <button className="secondary" type="Cancel">Cancel</button>
                            <button className="last" type="button" onClick={this._save.bind(this)}
                                    disabled={!this._isValid()}>
                                Register
                            </button>
                        </div>
                        <div className="form-row">
                            <label>&nbsp;</label>
                            <div className="form-row__input">
                                <FormFeedback isError={this.state.isError} text={this.state.formFeedback}/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>);
    }

}

export default LoginPage;
