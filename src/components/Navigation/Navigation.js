import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import styles from './Navigation.css';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';
import { USER_STATE_ANON, USER_STATE_VALIDATED } from '../../actions/Actions';
import strings from '../../utils/Strings';
import store from '../../stores/Store';
import FacebookLogin from '../FacebookLogin';
import TwitterLogin from '../TwitterLogin';
import UserLink from '../UserLink';

const USER_STATE_ANON_LINKS = require('./links/anon.json');
const USER_STATE_VALIDATED_LINKS = require('./links/validated.json');

const linkToTag = (info, i, user) => {
    var out;
    if (info.spacer) {
        out = (<span key={i} className="Navigation-spacer"> | </span>);
    } else if (info.href === '^facebook') {
        out = <FacebookLogin key={i} info={info}/>;
    } else if (info.href === '^twitter') {
        out = <TwitterLogin key={i} info={info}/>;
    } else if (info.href === '^user') {
        out = <UserLink key={i * 20} user={user} label={info.label}/>;
    } else {
        out = (<a key={i} className="Navigation-link" href={info.href} user={user}
                  onClick={Link.handleClick}>{info.label}</a>);
    }
    return out;
};

@withStyles(styles)
class Navigation extends Component {

    static propTypes = {
        className: PropTypes.string,
    };

    constructor() {
        super();

        var storeState = store.getState();
        this.s = strings('Navigation', storeState.lang);

        this.state = {
            userState: storeState.userState || USER_STATE_ANON,
            user: storeState.user || null
        };

    }

    componentDidMount() {
        this._unsubStore = store.subscribe(this._onStoreChange.bind(this));
    }

    componentWillUnmount() {
        this._unsubStore();
    }

    _onStoreChange() {
        const storeState = store.getState();
        if (!(this.state.userState === storeState.userState && this.state.user === storeState.user)) {
            this.setState({userState: storeState.userState, user: storeState.user});
        }
    }

    render() {
        var linkData;

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

        const labelLink = info => (info.label) ? {label: this.s(info.label)} : {};

        const links = linkData.links.map(info => Object.assign({}, info, labelLink(info))).map((link, i) => linkToTag(link, i, this.state.user));

        return (
            <div className="Navigation-links" role="navigation">
                {links}
            </div>
        );
    }

}

export default Navigation;
