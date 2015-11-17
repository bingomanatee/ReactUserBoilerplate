/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component } from 'react';
import styles from './Header.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
import Navigation from '../Navigation';
import  {
    logIn,
    logOff,
    logInGood,
    loginBad,
    resetAnon,

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
import store from '../../stores/Store';

@withStyles(styles)
class Header extends Component {
    constructor() {
        super();
        var storeState = store.getState();
        var userState = storeState.userState;
        this.state = {
            userState: userState
        };
        this._unsubStore = store.subscribe(this._onStoreChange.bind(this));
    }

    _onStoreChange() {
        const storeState = store.getState();

        this.setState({
            userState: storeState.userState,
            user: storeState.user
        });

    }

    render() {
        console.log('Header: state: ', this.state);

        var userIcon = '';

        if (this.state.user && this.state.user.image) {
            var iconStyle = {
                backgroundImage: `url(${this.state.user.image})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                width: '3.5rem',
                height: '3.5rem'
            };

            userIcon = (<div className="Header-container__item">
                <div style={iconStyle}></div>
            </div>);
        } else {
            console.log('no image in ', this.state.user);
        }
        return (
            <div className="Header">
                <div className="Header-container">
                    <div className="Header-container__item">
                        <a className="Header-brand" href="/" onClick={Link.handleClick}>
                            <img className="Header-brandImg" src={require('./logo-small.png')} width="38" height="38"
                                 alt="React"/>
                            <span className="Header-brandTxt">Reactor </span>
                        </a>
                    </div>
                    <div className="Header-container__item Header-container__item--nav">
                        <Navigation className="Header-nav"/>
                    </div>
                    {userIcon}
                </div>
                <p className="user-state">
                    <small>(userState = {this.state.userState} )</small>
                </p>
            </div>
        );
    }

}

export default Header;
