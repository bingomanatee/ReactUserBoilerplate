import React, { PropTypes, Component } from 'react';
import {logOff, overlay} from '../../actions';
import html from '../../core/HttpClient';
import FormFeedback from '../FormFeedback';
import store from '../../stores/Store';
import strings from './../../utils/Strings';

class LogoutPage extends Component {

    constructor() {
        super();
        this.s = strings('LogoutPage', store.getState().lang);
    }

    componentDidMount() {
        const done = (result) => {
            console.log('result of logging off: ', result);
            store.dispatch(overlay({}));
            document.location = '/';
        };
        store.dispatch(logOff());
        store.dispatch(overlay({title: this.s('title'), text: this.s('text'), show: true}));
        html.get('/api/users/logout/')
            .then(done, done);
    }

    render() {
        return (<h1>{this.s('title') }</h1>);
    }
}


export default LogoutPage;
