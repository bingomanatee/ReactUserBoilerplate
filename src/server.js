/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel-core/polyfill';
import path from 'path';
import express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Router from './routes';
import Html from './components/Html';
const bodyParser = require('body-parser');

const server = global.server = express();
server.use(require('cookie-parser')());
server.use(bodyParser.json()); // get information from html forms
server.use(bodyParser.urlencoded({extended: true}));

server.set('port', (process.env.PORT || 5000));
server.use(express.static(path.join(__dirname, 'public')));

//
// Register API middleware
// -----------------------------------------------------------------------------
server.use('/api/content', require('./api/content'));
require('./api/session')(server);
require('./api/firebaseUsers')(server);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
server.get('*', async (req, res, next) => {
    try {
        let statusCode = 200;
        let user = req.session && req.session.user ? req.session.user : null;
        console.log('user: =============== ', user);
        const data = {title: '', description: '', css: '', body: ''};
        const css = [];
        const context = {
            onInsertCss: value => css.push(value),
            onSetTitle: value => data.title = value,
            onSetMeta: (key, value) => data[key] = value,
            onPageNotFound: () => statusCode = 404,
        };

        let userJS = '';

        if (user){
            userJS = `<script language="javascript">
            /${'* --------------- INJECTING USER ----------------- *'}/
                    window.user = ${JSON.stringify(user)};
                </script>`;
        }

        await Router.dispatch({path: req.path, context}, (state, component) => {
            data.body = userJS + ReactDOM.renderToString(component);
            data.css = css.join('');
        });

        const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
        res.status(statusCode).send('<!doctype html>\n' + html);
    } catch (err) {
        next(err);
    }
});

//
// Launch the server
// -----------------------------------------------------------------------------

server.listen(server.get('port'), () => {
    /* eslint-disable no-console */
    console.log('The server is running at http://localhost:' + server.get('port'));
    if (process.send) {
        process.send('online');
    }
});
