import React, { PropTypes, Component } from 'react';
import Link from '../Link';
import { USER_STATE_ANON, USER_STATE_VALIDATED } from '../../actions/Actions';
import strings from '../../utils/Strings';
import store from '../../stores/Store';
import html from '../../core/HttpClient';
import Firebase from 'firebase';
import { alreadyLoggedIn } from '../../actions/Actions';

class FacebookLogin extends Component {
    auth(event) {
        event.stopPropagation();
        const ref = new Firebase("https://eatyourfriends2.firebaseio.com");
        ref.authWithOAuthPopup("facebook", (error, authData) => {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                    html.post('/api/users/facebook', authData)
                        .then(result => {
                            console.log('result from auth: ', result);
                            store.dispatch(alreadyLoggedIn(authData));
                            //@TODO: set logged in to state
                        }, (err) => console.log('error logging into facebook:', err));
                }
            }, {
                scope: 'email,user_friends'
            }
        );
        return false;
    }

    render() {
        return (<div className="Navigation-link" onClick={this.auth}>
            <div className="facebook-icon"><img src="/images/icons/facebook-icon.svg"/></div>
           <div className="social-label"> {this.props.info.label}</div>
        </div>);
    }
}

export default FacebookLogin;
