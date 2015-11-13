/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import request from 'superagent';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';

function getUrl(path) {
    if (path.startsWith('http') || canUseDOM) {
        return path;
    }

    return process.env.WEBSITE_HOSTNAME ?
        `http://${process.env.WEBSITE_HOSTNAME}${path}` :
        `http://127.0.0.1:${global.server.get('port')}${path}`;
}

const HttpClient = {

    _finish: (request, resolve, reject) => request.accept('application/json').end((err, res) => {
        if (err) {
            if (err.status === 404) {
                resolve(null);
            } else {
                reject(err);
            }
        } else {
            resolve(res.body);
        }
    }),

    get: path => new Promise((resolve, reject) => HttpClient._finish(request.get(getUrl(path)), resolve, reject)),

    post: (path, params) => new Promise((resolve, rej) => HttpClient._finish(request.post(getUrl(path), params), resolve, rej))

};

export default HttpClient;
