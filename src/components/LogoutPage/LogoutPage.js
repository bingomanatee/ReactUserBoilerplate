import React, { PropTypes, Component } from 'react';
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

class LogoutPage extends Component {

    constructor() {
        super();

        store.dispatch(logOff());

        html.get('/api/users/logout')
            .then(() => document.location = '/', () => doclument.location = '/');
    }

    render () {
        return <h1>Logging Out</h1>
    }
}


export default LogoutPage;
