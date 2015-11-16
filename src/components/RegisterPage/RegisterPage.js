/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './RegisterPage.css';
import withStyles from '../../decorators/withStyles';
import strings from './../../utils/Strings';
import FormDefField from '../FormDefField';
import {FieldDef } from './../../utils/FieldDef';
import {MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, REQUIRE_EMAIL, ASK_EMAIL, REQUIRE_USERNAME, ASK_USERNAME } from '../../config';
import  {
    reg,
    regGood,
    regBad,
    resetAnon,
    overlay,

    USER_REG,
    USER_REG_VALID,
    USER_REG_INVALID,
    USER_RESET_ANON,

    USER_STATE_ANON,
    USER_STATE_REG_SUBMITTED,
    USER_STATE_REG_REJECTED,
    USER_STATE_REG_ACCEPTED
} from '../../actions';
import html from '../../core/HttpClient';
import FormFeedback from '../FormFeedback';
import store from '../../stores/Store';
import {setUserRegistration, VALIDATION_METHOD_TYPE_PROMISE} from '../../stores/UserAuth';

const FEEDBACK_DURATION = 5 * 1000;

const userStateMessages = {};

userStateMessages[USER_STATE_ANON] = '';
userStateMessages[USER_STATE_REG_SUBMITTED] = 'registering';
userStateMessages[USER_STATE_REG_REJECTED] = 'badRegistering';
userStateMessages[USER_STATE_REG_ACCEPTED] = 'goodRegistering';

setUserRegistration(user => html.post('/api/users/reg', user), VALIDATION_METHOD_TYPE_PROMISE);

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
                    case USER_STATE_REG_REJECTED:
                        this._setFeedback('badRegistering', true);
                        store.dispatch(overlay({}));
                        break;

                    case USER_STATE_REG_SUBMITTED:
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
        event.preventDefault();
        if (!this._isValid()) {
            this._setFeedback('formIncomplete', true);
        } else {
            const username = this.state.username || '';
            const password = this.state.password || '';
            const password2 = this.state.password2 || '';
            const email = this.state.email || '';

            store.dispatch(reg({
                username: username,
                email: email,
                password: password,
                passwors2: password2
            }));
        }
    }

    _makeFieldDef(name, type, validators) {
        const value = this.state[name];
        const def = new FieldDef(name, value, type, {
            s: this.s,
            label: `s.${name}`,
            placeholder: `s.${name}Placeholder`,
            validators: validators
        });

        def.watch(value => {
            let newState = {};
            newState[name] = value;
            this.setState(newState);
        });

        this.fieldDefs.set(name, def);
    }

    _makeFieldDefs() {
        this.fieldDefs.forEach(def => def.destroy());
        this.fieldDefs.clear();

        if (ASK_EMAIL) {
            this._makeFieldDef('email', 'text', [
                [{type: 'email'}, 's.emailError']
            ]);
        }

        if (ASK_USERNAME) {
            this._makeFieldDef('username', 'text', []);
        }

        this._makeFieldDef('password', 'password', []);

        this._makeFieldDef('password2', 'password', []);

        this.fieldDefs.set('registeredTitle', new FieldDef('registeredTitle', 's.registeredTitle', 'title', {s: this.s}));
    }

    _goHome() {
        document.location = '/';
    }

    _goLogin() {
        document.location = '/login';
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
            case USER_STATE_REG_ACCEPTED:
                inner = (
                    <form className="form RegisterPage__form">
                        <FormDefField ref="registeredTitle" def={this.fieldDefs.get('registeredTitle')}></FormDefField>
                        <div className="form-def-row form-def-row-button-row">
                            <button className="last" type="button" onClick={this._goLogin.bind(this)}>
                                {this.s('logInButtonLabel')}
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
