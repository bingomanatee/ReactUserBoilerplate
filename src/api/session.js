var options = require('./.auth/firebase.json');
const session = require('express-session');
const FirebaseStore = require('connect-firebase')(session);

module.exports = (app) => {
    app.use(session({
        store: new FirebaseStore(options),
        secret: options.sessionSecret,
        resave: true,
        saveUninitialized: true
    }));
};
