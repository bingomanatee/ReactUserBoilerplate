/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import withStyles from '../../decorators/withStyles';
import styles from './FormDefField.css';
import FormFeedback from './../FormFeedback';
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
    }

    componentWillUnmount() {
    }

    _onChange(value) {
        console.log('FormDefField value: ', value);
        this.props.def.fieldValue = value;
        this.forceUpdate();
    }

    render() {
        var def = this.props.def;
        console.log(this.name, 'def value:', def.fieldValue);
        var valueLink = {
            value: def.fieldValue,
            requestChange: this._onChange.bind(this)
        };
        var input = null;

        switch (def.fieldType) {

            case 'password':
                input = (<input type="password" name={def.name} placeholder={def.placeholder} autoComplete="off"
                                valueLink={valueLink}/>);
                break;

            case 'textarea':
                var rows = this.props.rows || 4;
                input = (<textarea name={def.name} placeholder={def.placeholder} value={def.fieldValue}
                                   valueLink={valueLink}/>);
                break;

            default:
                input = (<input type={def.fieldType} name={def.name} placeholder={def.placeholder}
                                valueLink={valueLink}/>);
        }

        const errors = def.errors ? ( <FormFeedback message={def.errors} isError={1} />) : '';

        return (<div className="form-row">
            <label>{def.label}</label>
            <div className="form-row__input">
                {input}
                {errors}
            </div>
        </div>);
    }
}

export default FormDefField;
