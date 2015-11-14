/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './FormField.css';

/**
 * This class doesn't show feedback for a second or so as
 * long as the feedback changes
 * to give the user time to finish typing.
 * @type {number}
 */
const FEEDBACK_DELAY = 1500;

@withStyles(styles)
class FormField extends Component {

    constructor() {
        super();
        this.state = {feedbackShowClass: 'hide'};
    }

    componentWillMount() {
        if (this._fbMessage(this.props)) {
            this.startFeedbackTimer();
        }
    }

    componentWillReceiveProps(nextProps) {
        const lastFeedbackMessage = this._fbMessage(this.props);
        const newFeedbackMessage = this._fbMessage(nextProps);
        if (lastFeedbackMessage !== newFeedbackMessage) {
            this.startFeedbackTimer();
        }
    }

    componentWillUnmount() {
        if (this._fbt) {
            clearTimeout(this._fbt);
        }
    }

    startFeedbackTimer() {
        if (this._fbt) {
            clearTimeout(this._fbt);
        }

        this.setState({feedbackShowClass: 'hide'});
        this._fbt = setTimeout(() => this.setState({feedbackShowClass: ''}), FEEDBACK_DELAY);
    }

    _fbMessage(props) {
        if (!props || !props.feedback) {
            return '';
        }
        return props.feedback.msg || '';
    }

    render() {
        let feedbackClass = this.props.feedback ? this.props.feedback.className : '';
        feedbackClass += ' ' + (this.state.feedbackShowClass || '');
        const feedbackMsg = this.props.feedback ? this.props.feedback.msg : '';
        var input = '';
        const placeholder = this.props.placeholder || this.props.label;
        switch (this.props.type) {

            case 'password':
                input = (<input type="password" name={this.props.name} placeholder={placeholder} autoComplete="off"
                                valueLink={this.props.valueLink}/>);
                break;

            case 'textarea':
                var rows = this.props.rows || 4;
                input = (<textarea name={this.props.name} rows={rows} placeholder={placeholder}
                                   valueLink={this.props.valueLink}/>);
                break;

            default:
                input = (<input type={this.props.type} name={this.props.name} placeholder={placeholder}
                                valueLink={this.props.valueLink}/>);
        }
        return (<div className="form-row">
            <label>{this.props.label}</label>
            <div className="form-row__input">
                {input}
                <p className={feedbackClass}>
                    <small>{feedbackMsg}&nbsp;</small>
                </p>
            </div>
        </div>);
    }
}

export default FormField;
