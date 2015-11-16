/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './RegisterPage.css';
import withStyles from '../../decorators/withStyles';
import strings from './../../utils/Strings';
import FormDefField from '../FormDefField';
import {FieldDef } from './../../utils/FieldDef';
import {MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, REQUIRE_EMAIL, ASK_EMAIL, REQUIRE_USERNAME, ASK_USERNAME } from '../../config';
import  {
    logIn,
    logOff,
    logInGood,
    loginBad,
    loginResetAnon,
    overlay,

    USER_LOGIN,
    USER_LOGOFF,
    USER_LOGIN_VALID,
    USER_LOGIN_INVALID,
    USER_RESET_ANON,

    USER_STATE_ANON,
    USER_STATE_LOGIN_SUBMITTED,
    USER_STATE_VALIDATED,
    USER_STATE_LOGIN_REJECTED
} from '../../actions';
import html from '../../core/HttpClient';
import FormFeedback from '../FormFeedback';
import store from '../../stores/Store';
import {setUserValidation, VALIDATION_METHOD_TYPE_PROMISE} from '../../stores/UserAuth';

const MIN_SUBMIT_GAP = 1000;
const MAX_TRIES = 5;
const FEEDBACK_DURATION = 5 * 1000;

const userStateMessages = {};

userStateMessages[USER_STATE_LOGIN_SUBMITTED] = 'registering';
userStateMessages[USER_STATE_ANON] = '';
userStateMessages[USER_STATE_VALIDATED] = 'goodRegistering';
userStateMessages[USER_STATE_LOGIN_REJECTED] = 'badRegistering';

// setUserValidation(user => html.post('/api/users/auth', user), VALIDATION_METHOD_TYPE_PROMISE);
// @TODO: some equivalent for registration?

@withStyles(styles)
class RegisterPage extends Component {

    constructor() {
        super();

        var storeState = store.getState();

        this.state = {
            locked: false,
            email: '',
            username: '',
            password: '',
            password2: '',
            isError: false,
            formFeedback: '',
            submitTimeBuffer: [],
            userState: storeState.userState
        };

        this.fieldDefs = new Map();
        this.s = strings('RegisterPage');

        this._makeFieldDefs();

        this._unsubStore = store.subscribe(this._onStoreChange.bind(this));
    }

    _onStoreChange() {
        const storeState = store.getState();
        if (this.state.userState !== storeState.userState) {
            this.setState({userState: storeState.userState});
            const title = this.s('registeringTitle');
            const text = this.s('registeringText');
            const updateOverlay = () => {
                switch (storeState.userState) {
                    case USER_STATE_LOGIN_REJECTED:
                        this._setFeedback('badRegistering', true);
                        store.dispatch(overlay({}));
                        break;

                    case USER_STATE_LOGIN_SUBMITTED:
                        store.dispatch(overlay({title: title, text: text, show: true}));
                        break;
                    default:
                        store.dispatch(overlay({}));
                }
            };
            setTimeout(updateOverlay, 1);
        }
    }

    componentWillUnmount() {
        this._clearFeedback(false);
        this._unsubStore();
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
        }, FEEDBACK_DURATION);
    }

    _clearFeedback(dontEraseState) {
        if (this.eto) {
            clearTimeout(this.eto);
        }
        if (!dontEraseState) {
            this.setState({formFeedback: ''});
        }
    }

    _save(event) {
        const username = this.state.username || '';
        const password = this.state.password || '';
        const password2 = this.state.password2 || '';
        const email = this.state.email || '';
        event.preventDefault();
        if (!this._isValid()) {
            this._setFeedback('formIncomplete', true);
            return
        }
        // call getValue() to get the values of the form
        var data = {
            username: username,
            email: email,
            password: password,
            passwors2: password2
        };

      //  store.dispatch(logIn(data));
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

        const password2Def = new FieldDef('password2', this.state.password2, 'password2', {
            s: this.s,
            label: 's.password2',
            placeholder: 's.password2Placeholder'
        });
        password2Def.watch(password2 => this.setState({password2}));
        this.fieldDefs.set('password2', password2Def);

        this.fieldDefs.set('registeredTitle', new FieldDef('registeredTitle', 's.registeredTitle', 'title', {s: this.s}));
    }

    _goHome() {
        document.location = '/';
    }

    _isValid() {
        var isValid = true;
//@TODO: reduce?
        this.fieldDefs.forEach(fieldDef => {
            isValid = isValid && !fieldDef.errors;
        });

        return isValid;
    }

    render() {
        var identity = [];
        if (ASK_EMAIL) {
            identity.push(<FormDefField ref="email" key={1} def={this.fieldDefs.get('email')}/>);
        }

        if (ASK_USERNAME) {
            identity.push(<FormDefField ref="username" key={2} def={this.fieldDefs.get('username')}/>);
        }

        var inner = (<form className="form RegisterPage__form">
            <h1>{this.s('title')}</h1>
            <p>{this.s('text')}</p>
            {identity}
            <FormDefField ref="password" def={this.fieldDefs.get('password')}/>
            <FormDefField ref="password2" def={this.fieldDefs.get('password2')}/>
            <div className="form-def-row form-def-row-button-row">
                <button className="secondary" type="button" onClick={this._goHome.bind(this)}>
                    {this.s('cancelButtonLabel')}
                </button>
                <button className="last" type="button" onClick={this._save.bind(this)}
                        disabled={!this._isValid()}>
                    {this.s('registeringButtonLabel')}
                </button>
            </div>
            <div className="form-def-row">
                <label>&nbsp;</label>
                <div className="form-def-row__input">
                    <FormFeedback isError={this.state.isError} text={this.state.formFeedback}/>
                </div>
            </div>
        </form>);

        switch (this.state.userState) {
            case USER_STATE_VALIDATED:
                inner = (
                    <form className="form RegisterPage__form">
                        <FormDefField ref="registeredTitle" def={this.fieldDefs.get('registeredTitle')}></FormDefField>
                        <div className="form-def-row form-def-row-button-row">
                            <button className="last" type="button" onClick={this._goHome.bind(this)}>
                                {this.s('goHomeButtonLabel')}
                            </button>
                        </div>
                    </form>
                );
                break;
        }

        return (<div className="RegisterPage container-frame">
            <div className="RegisterPage-container container-frame__inner">
                {inner}
            </div>
        </div>);

    }

}

export default RegisterPage;
