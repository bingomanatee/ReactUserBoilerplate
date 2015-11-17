var Firebase = require('firebase');
var express = require('express');
var FirebaseTokenGenerator = require('firebase-token-generator');
var options = require('./.auth/firebase.json');
var tokenGenerator = new FirebaseTokenGenerator(options.secret);
var token = tokenGenerator.createToken({uid: 'eatTheRich', a: 1, b: 2});

var uri = 'https://' + options.host;

var root = new Firebase(uri);

root.authWithCustomToken(token, function (err, fb) {
    if (err) {
        throw err;
    }
});

import { Router } from 'express';

module.exports = (app) => {
    var router = new Router();
    router.get('/logout', (req, res) => {
        console.log('logging out!!!!');
        try {
            try {
                delete req.session.user;
            } catch (err) {
                console.log('error in logout: ', err);
                req.session.user = null;
            }
            console.log('POST LOGOUT session: ', req.session);
            res.redirect(200, '/');
        } catch (err2) {
            console.log('err 2: ', err2);
        }
});

router.post('/facebook', (req, res) => {
    console.log('req.body: ', req.body);
    try {
        root.child('users/' + req.body.uid).set(req.body);
        // a little fast and loose -- writing without waiting for validation
        req.session.user = req.body;
        res.send({saved: req.body.uid});
    } catch (err){
        console.log('error in send: ', err);
        res.status(400).send(err);
    }
});

router.post('/reg', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var bio = req.body.bio;

    if (!(email && password)) {
        res.status(400).send({error: 'email and password are required'});
    } else {
        root.createUser({
            email: email,
            password: password,
            bio: bio
        }, function (error, userData) {
            if (error) {
                console.log('Error creating user:', error);
                res.status(400).send(error);
            } else {
                console.log('Successfully created user account with uid:', userData.uid);
                root.child('users/' + userData.uid).set(userData); // copy to app data.
                res.send(userData);
            }
        });
    }
});

router.post('/auth', (req, res) => {
    if (!req.body) {
        console.log('wierd req: ', req);
    }
    var email = req.body.email;
    var password = req.body.password;

    console.log('logging in with ', email, password);
    if (!(email && password)) {
        res.status(400).send({error: 'email and password are required'});
    } else {
        root.authWithPassword({
            email: email,
            password: password
        }, function (error, user) {
            if (error) {
                console.log("Login Failed!", error);
                res.status(400).send(error);
            } else {
                req.session.user = user;
                res.send(user);
            }
        });
    }
});

app.use('/api/users', router);
}
;
