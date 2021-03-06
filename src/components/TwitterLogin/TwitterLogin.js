import React, { PropTypes, Component } from 'react';
import Link from '../Link';
import { USER_STATE_ANON, USER_STATE_VALIDATED } from '../../actions/Actions';
import strings from '../../utils/Strings';
import store from '../../stores/Store';
import html from '../../core/HttpClient';
import Firebase from 'firebase';
import { alreadyLoggedIn } from '../../actions/Actions';

class TwitterLogin extends Component {
    auth(event) {
        event.stopPropagation();
        const ref = new Firebase('https://eatyourfriends2.firebaseio.com');
        ref.authWithOAuthPopup('twitter', (error, authData) => {
                if (error) {
                    console.log('Login Failed!', error);
                } else {
                    html.post('/api/users/facebook', authData)
                        .then(result => store.dispatch(alreadyLoggedIn(authData)),
                            err => console.log('error logging into facebook:', err));
                }
            }, {
                scope: 'email,user_friends'
            }
        );
        return false;
    }

    render() {
        return (<div className="Navigation-link" onClick={this.auth}>
            <div className="twitter-icon"><img src="/images/icons/twitter-icon.svg"/></div>
            <div className="social-label">{this.props.info.label}</div>
        </div>);
    }
}

export default TwitterLogin;
