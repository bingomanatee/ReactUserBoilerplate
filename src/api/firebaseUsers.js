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
    router.post('/', (req, res) => {
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
                    res.send(userData);
                }
            });
        }
    });

    router.post('/auth', (req, res) => {
        var email = req.body.email;
        var password = req.body.password;

        if (!(email && password)) {
            res.status(400).send({error: 'email and password are required'});
        } else {
            root.authWithPassword({
                email: email,
                password: password
            }, function (error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                    res.status(400).send(error);
                } else {
                    req.session.authData = authData;
                    res.send(authData);
                }
            });
        }
    });

    app.use('/api/users', router);
};
