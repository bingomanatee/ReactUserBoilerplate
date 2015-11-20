import React, { PropTypes, Component } from 'react';
import Link from '../Link';
import { USER_STATE_ANON, USER_STATE_VALIDATED } from '../../actions/Actions';
import strings from '../../utils/Strings';
import html from '../../core/HttpClient';
import Firebase from 'firebase';
import { alreadyLoggedIn } from '../../actions/Actions';

class FacebookLogin extends Component {


    render() {
        var user = this.props.user;
        var userIcon = '';
        if (!user) {
            return <div>...</div>;
        }

        if (this.props.user.image) {
            var iconStyle = {
                backgroundImage: `url(${user.image})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                width: '3.5rem',
                height: '3.5rem'
            };
            userIcon = (<div className="Header-container__item">
                <div style={iconStyle}></div>
            </div>);
        }

        return (<div className="User-link">
            <div><h3>Logged in as</h3><h4>{ user.name || '??'}</h4><a className="Navigation-link Navigation-link__small" href="/logout">{ this.props.label }</a></div>
            {userIcon}</div>);
    }
}

export default FacebookLogin;
