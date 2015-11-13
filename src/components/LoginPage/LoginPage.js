/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './LoginPage.css';
import withStyles from '../../decorators/withStyles';
import Strings from './../../utils/Strings';

@withStyles(styles)
class LoginPage extends Component {

    save() {
        // call getValue() to get the values of the form
        var value = this.refs.form.getValue();
        // if validation fails, value will be null
        if (value) {
            // value here is an instance of Person
            console.log(value);
        }
    }

    render() {
        const s = Strings('LoginPage');
        return (
            <div className="LoginPage">
                <div className="LoginPage-container">
                    <h1>{s.title}</h1>
                    <p>{s.text}</p>
                    <form className="form LoginPage__form">
                        <div className="form-row">
                            <label>{s.username}</label>
                            <div className="form-row__input">
                                <input type="text" name="username"/>
                            </div>
                        </div>
                        <div className="form-row">
                            <label>{s.password}</label>
                            <div className="form-row__input">
                                <input type="password" name="password"/>
                            </div>
                        </div>
                        <div className="form-row form-row-button-row">
                            <button type="Submit">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

}

export default LoginPage;
