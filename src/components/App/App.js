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
import _ from 'lodash';
import withViewport from '../../decorators/withViewport';

import {
    overlay,
    alreadyLoggedIn,
    resize,
} from '../../actions';
import html from '../../core/HttpClient';
import FormFeedback from '../FormFeedback';

var lastWidth = 0;
var lastHeight = 0;
const BROADCAST_SIZE_DELAY = 1.5 * 1000;
const MIN_HEIGHT_FOR_FOOTER = 500;

const broadcastSize = _.debounce((width, height) => store.dispatch(resize(width, height)), BROADCAST_SIZE_DELAY);

/**
 * note -- this module will broacast (with debounce) any size change to state.
 * However it itself doesn't listen to state, just its viewport.
 */

@withViewport
@withContext
@withStyles(styles)
class App extends Component {

    constructor() {
        super();
        this.state = {overlay: {}, firstRun: true};

        this.__updateSize = broadcastSize;
        this.__updateSize();
    }

    componentDidMount() {
        if ((typeof window !== 'undefined')) {
            http.get('/api/users/')
                .then(result => {
                    if (result && result.user) {
                        store.dispatch(alreadyLoggedIn(result.user));
                    }
                }, (err) => {
                    console.log('user poll error: ', err);
                });
            setTimeout(() => this.setState({firstRun: false}));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.viewport) {
            if (!(nextProps.viewport.width === lastWidth && nextProps.viewport.height === lastHeight)) {
                lastWidth = nextProps.viewport.width;
                lastHeight = nextProps.viewport.height;
                this.__updateSize();
            }
        } else {
            console.log('no viewport in ', nextProps);
        }
    }

    onWillUnmount() {
        this._unstore();
    }

    _sizeChange() {
        store.dispatch(resize(
            this.props.viewport.width,
            this.props.viewport.height
        ));
    }

    _isTall() {
        return (!this.state.firstRun) && this.props.viewport.height > MIN_HEIGHT_FOR_FOOTER;
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

        var feedback;
        if (this._isTall()) {
            feedback = <Feedback />;
        }

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
