/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import { Modal } from 'react-overlays';

import styles from './App.css';
import withContext from '../../decorators/withContext';
import withStyles from '../../decorators/withStyles';
import Header from '../Header';
import Feedback from '../Feedback';
import Footer from '../Footer';
import store from '../../stores/Store';
import { alreadyLoggedIn } from '../../actions/Actions';

const MIN_TICS = 3 * 1000;

@withContext
@withStyles(styles)
class App extends Component {

    constructor() {
        super();
        this._unstore = store.subscribe(this._storeChange.bind(this));
        this.state = {
            overlay: {}
        }
        if ((typeof window !== 'undefined') && window.user) {
            console.log('alreadyLoggedIn: ', alreadyLoggedIn(user));
            store.dispatch(alreadyLoggedIn(window.user));
        }
    }

    onWillUnmount() {
        this._unstore();
    }

    static propTypes = {
        children: PropTypes.element.isRequired,
        error: PropTypes.object,
    };

    _storeChange() {
        /**
         * note - we are keeping dialogs up at least MIN_TIME ticks
         * to not jar the readers.
         */
        var state = store.getState();
        var overlay = state.overlay || {};
        this.setState({overlay: overlay})
    }

    render() {
        var modal = this.state && this.state.overlay && this.state.overlay.show ? (<Modal
            backdropClassName="overlay-background"
            show={true}
        >
            <div className="overlay-dialog">
                <div className="overlay-dialog__inner">
                    <h2>{this.state.overlay.title || ''}</h2>
                    <p>{this.state.overlay.text || ''}</p>
                </div>
            </div>
        </Modal>) : '';

        return !this.props.error ? (
            <div>
                {modal}
                <Header />
                {this.props.children}
                <Feedback />
                <Footer />
            </div>
        ) : this.props.children;
    }

}

export default App;
