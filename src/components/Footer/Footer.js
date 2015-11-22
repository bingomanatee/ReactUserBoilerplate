/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react';
import styles from './Footer.css';
import withViewport from '../../decorators/withViewport';
import withStyles from '../../decorators/withStyles';
import Link from '../Link';

@withViewport
@withStyles(styles)
class Footer extends Component {

    static propTypes = {
        viewport: PropTypes.shape({
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired,
        }).isRequired,
    };

    render() {
        const width = this.props.width || 0;
        const height = this.props.height || 0;
        return (
            <div className="Footer">
                <div className="Footer-container">
                    <span className="Footer-text">© Your Company</span>
                    <span className="Footer-spacer">·</span>
                    <a className="Footer-link" href="/" onClick={Link.handleClick}>Home</a>
                    <span className="Footer-spacer">·</span>
                    <a className="Footer-link" href="/privacy" onClick={Link.handleClick}>Privacy</a>
                    <span className="Footer-spacer">·</span>
                    <a className="Footer-link" href="/not-found" onClick={Link.handleClick}>Not Found</a>
                    <span className="Footer-spacer"> | </span>
                    <span ref="viewport"
                          className="Footer-viewport Footer-text Footer-text--muted">Viewport: {width}x${height}</span>
                </div>
            </div>
        );
    }

}

export default Footer;
