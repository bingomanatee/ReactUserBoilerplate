/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import { Modal } from 'react-overlays';
import http from '../../core/HttpClient';
import styles from './App.css';
import withContext from '../../decorators/withContext';
import withStyles from '../../decorators/withStyles';
import Header from '../Header';
import Feedback from '../Feedback';
import Footer from '../Footer';
import store from '../../stores/Store';
import { alreadyLoggedIn, resize } from '../../actions/Actions';
import _ from 'lodash';
import withViewport from '../../decorators/withViewport';

var lastWidth = 0, lastHeight = 0;
const BROADCAST_SIZE_DELAY = 0.8 * 1000;
const MIN_HEIGHT_FOR_FOOTER = 800;

const broadcastSize = _.debounce((width, height) => store.dispatch(resize(width, height)), BROADCAST_SIZE_DELAY);

@withContext
@withStyles(styles)
class App extends Component {

    constructor() {
        super();
        this.state = {overlay: {}};
    }

    componentDidMount() {
        this._unstore = store.subscribe(this._storeChange.bind(this));
        if ((typeof window !== 'undefined')) {
            http.get('/api/users/')
                .then(result => {
                    if (result && result.user) {
                       store.dispatch(alreadyLoggedIn(result.user));
                    }
                }, (err) => {
                    console.log('user poll error: ', err);
                });
        }
        // this._updateSize(this.props);
    }

    componentWillUpdate(props, state) {
        // this._updateSize(props);
    }

    onWillUnmount() {
        this._unstore();
    }

    _updateSize(props) {
        if (props) {
            console.log('########## SIZE props: ', props.width, props.height);
        } else {
            console.log('############# SIZE no props');
            return;
        }
        if (isNaN(props.width)) {
            return;
        } else if ((typeof window !== 'undefined') && props && ((props.viewport.width != lastWidth) || (props.viewport.height != lastHeight))) {
            console.log('########## SIZE props: ', props.viewport.width, props.viewport.height);
            const wasTall = this._isTall();
            lastWidth = props.viewport.width;
            lastHeight = props.viewport.height;
            broadcastSize(lastWidth, lastHeight);
            if (wasTall !== this._isTall()) {
                this.forceUpdate();
            }
        }
    }

    /*   shouldComponentUpdate(nextProps, nextState) {
     return this._isTall() !== this._isTall(nextProps.viewport.height);
     }*/

    _isTall(height) {
        return true; // (height || lastHeight) > MIN_HEIGHT_FOR_FOOTER;
    }

    /*
     static propTypes = {
     children: PropTypes.element.isRequired,
     error: PropTypes.object,
     viewport: PropTypes.shape({
     width: PropTypes.number.isRequired,
     height: PropTypes.number.isRequired,
     }).isRequired
     }; */

    _storeChange() {
        /**
         * note - we are keeping dialogs up at least MIN_TIME ticks
         * to not jar the readers.
         */
        var state = store.getState();
        var overlay = state.overlay || {};
        setTimeout(() => this.setState({overlay: overlay}), 1);
    }

    render() {
        var modal = this.state && this.state.overlay ? (<Modal
            backdropClassName="overlay-background"
            show={this.state.overlay.show}
        >
            <div className="overlay-dialog">
                <div className="overlay-dialog__inner">
                    <h2>{this.state.overlay.title || ''}</h2>
                    <p>{this.state.overlay.text || ''}</p>
                </div>
            </div>
        </Modal>) : '';

        const feedback = this._isTall() ? <Feedback /> : '';

        return !this.props.error ? (
            <div id="app-inner">
                {modal}
                <Header />
                <div id="main">
                    {this.props.children}
                </div>
                {feedback}
                <Footer />
            </div>
        ) : this.props.children;
    }

}

export default App;
