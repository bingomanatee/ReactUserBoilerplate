/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './LoginPage.css';
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

userStateMessages[USER_STATE_LOGIN_SUBMITTED] = 'loggingIn';
userStateMessages[USER_STATE_ANON] = '';
userStateMessages[USER_STATE_VALIDATED] = 'goodLogin';
userStateMessages[USER_STATE_LOGIN_REJECTED] = 'badLogin';

/*

 html.post('/api/users/auth', data)
 .then(goodLogin, badLogin);

 */
setUserValidation(user => html.post('/api/users/auth', user), VALIDATION_METHOD_TYPE_PROMISE);

@withStyles(styles)
class LoginPage extends Component {

    constructor() {
        super();

        var storeState = store.getState();

        this.state = {
            locked: false,
            email: '',
            username: '',
            password: '',
            isError: false,
            formFeedback: '',
            submitTimeBuffer: [],
            userState: storeState.userState
        };

        this.fieldDefs = new Map();
        this.s = strings('LoginPage');

        this._makeFieldDefs();

        this._unsubStore = store.subscribe(this._onStoreChange.bind(this));
    }

    _onStoreChange() {
        const storeState = store.getState();
        console.log('store state', storeState);
        if (this.state.userState === storeState.userState) {
            console.log('store state is still ', storeState.userState);
        } else {
            console.log('store state changed to ', storeState.userState);
            this.setState({userState: storeState.userState});
            const title = this.s('loggingInTitle');
            const text = this.s('loggingInText');
            const updateOverlay = () => {
                switch (storeState.userState) {
                    case USER_STATE_LOGIN_REJECTED:
                        this._setFeedback('badLogin', true);
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
            password: password
        };

        console.log('logging in with ', data);
        store.dispatch(logIn(data));
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

        this.fieldDefs.set('loggedInTitle', new FieldDef('loggedInTitle', 's.loggedInTitle', 'title', {s: this.s}));
    }

    _goHome() {
        document.location = '/';
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
        var identity = [];
        if (ASK_EMAIL) {
            identity.push(<FormDefField ref="email" key={1} def={this.fieldDefs.get('email')}/>);
        }

        if (ASK_USERNAME) {
            identity.push(<FormDefField ref="username" key={2} def={this.fieldDefs.get('username')}/>);
        }

        var inner = (<form className="form LoginPage__form">
            {identity}
            <FormDefField ref="password" def={this.fieldDefs.get('password')}/>
            <div className="form-def-row form-def-row-button-row">
                <button className="secondary" type="button" onClick={this._goHome.bind(this)}>
                    {this.s('cancelButtonLabel')}
                </button>
                <button className="last" type="button" onClick={this._save.bind(this)}
                        disabled={!this._isValid()}>
                    {this.s('loginButtonLabel')}
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
                    <form className="form LoginPage__form">
                        <FormDefField ref="loggedInTitle" def={this.fieldDefs.get('loggedInTitle')}></FormDefField>
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
                <h1>{this.s('title')}</h1>
                <p>{this.s('text')}</p>
                {inner}
            </div>
        </div>);

    }

}

export default LoginPage;
