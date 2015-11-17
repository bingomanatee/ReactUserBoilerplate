import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import styles from './Navigation.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
import { USER_STATE_ANON, USER_STATE_VALIDATED } from '../../actions/Actions';
import strings from '../../utils/Strings';
import store from '../../stores/Store';
import FacebookLogin from '../FacebookLogin';

const USER_STATE_ANON_LINKS = require('./links/anon.json');
const USER_STATE_VALIDATED_LINKS = require('./links/validated.json');

const linkToTag = (info, i) => {
    if (info.spacer) {
        return (<span key={i} className="Navigation-spacer"> | </span>)
    } else if (info.href === '^facebook') {
        return <FacebookLogin key={i} info={info}/>
    }
    else {
        return (<a key={i} className="Navigation-link" href={info.href} onClick={Link.handleClick}>{info.label}</a>);
    }

}

@withStyles(styles)
class Navigation extends Component {

    constructor() {
        super();

        var storeState = store.getState();
        this.s = strings('Navigation', storeState.lang || 'en');

        this.state = {
            userState: storeState.userState || USER_STATE_ANON,
            user: storeState.user || null
        };

    }

    componentWillUnmount() {
        this._unsubStore();
    }

    componentDidMount(){
        this._unsubStore = store.subscribe(this._onStoreChange.bind(this));
    }

    _onStoreChange() {
        const storeState = store.getState();
        console.log('store state', storeState);
        if (this.state.userState !== storeState.userState) {
            this.setState({userState: storeState.userState, user: storeState.user});
        }
    }

    static propTypes = {
        className: PropTypes.string,
    };

    render() {
        var linkData = {links: []}

        switch (this.state.userState) {
            case USER_STATE_ANON:
                linkData = USER_STATE_ANON_LINKS;
                break;

            case USER_STATE_VALIDATED:
                linkData = USER_STATE_VALIDATED_LINKS;
                break;

            default:
                linkData = {links: []};
        }

        const labelLink = info => {
            var out = {};
            if (info.label) {
                out.label = this.s(info.label);
            }
            return out;
        }

        const links = linkData.links.map(info => Object.assign({}, info, labelLink(info))).map(linkToTag);

        return (
            <div className="Navigation-links" role="navigation">
                {links}
            </div>
        );
    }

}

export default Navigation;
