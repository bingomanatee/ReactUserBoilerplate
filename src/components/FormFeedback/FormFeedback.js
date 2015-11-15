import React, { PropTypes, Component } from 'react';
import styles from './FormFeedback.css';
import withStyles from '../../decorators/withStyles';


@withStyles(styles)
class FormFeedback extends Component {
    render() {
        var classes = 'form-feedback';
        if (this.props.isError) {
            classes += ' form-feedaback--error';
        }
        return (<p className={classes}>
            {this.props.text}&nbsp;
        </p>);
    }
}

export default FormFeedback;
