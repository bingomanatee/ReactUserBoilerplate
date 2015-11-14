/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './FormDefField.css';

/**
 * This class doesn't show feedback for a second or so as
 * long as the feedback changes
 * to give the user time to finish typing.
 * @type {number}
 */
const FEEDBACK_DELAY = 1500;

@withStyles(styles)
class FormDefField extends Component {

    constructor() {
        super();
    }

    componentWillMount() {
        this.__onChange = this._onChange.bind(this);
        this.props.def.watch(this.__onChange);
    }

    componentWillUnmount() {
        this.props.def.unwatch(this.__onChange);
    }

    _onChange() {
        this.forceUpdate();
    }

    render() {
        var def = this.props.def;
        var valueLink = null;
        var input = null;

        switch (def.fieldType) {

            case 'password':
                input = (<input type="password" name={def.name} placeholder={def.placeholder} autoComplete="off"
                                valueLink={valueLink}/>);
                break;

            case 'textarea':
                var rows = this.props.rows || 4;
                input = (<textarea name={def.name} placeholder={def.placeholder}
                                   valueLink={valueLink}/>);
                break;

            default:
                input = (<input type={def.fieldType} name={def.name} placeholder={def.placeholder}
                                valueLink={valueLink}/>);
        }

        const errors = def.errors ? ( <p className="errors">
            <small>{def.errors}&nbsp;</small>
        </p>) : '';

        return (<div className="form-row">
            <label>{def.label}</label>
            <div className="form-row__input">
                {input}
                {errors}
            </div>
        </div>);
    }
}

module.exports = FormDefField;
