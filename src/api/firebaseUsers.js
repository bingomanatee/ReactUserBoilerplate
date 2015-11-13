var Firebase = require('firebase');
var express = require('express');

var options = require('./.auth/firebase.json');
var uri = 'https://' + options.host;

var root = new Firebase(uri);

root.authWithCustomToken(options.token, function (err, fb) {
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
            }, function(error, userData) {
                if (error) {
                    console.log('Error creating user:', error);
                } else {
                    console.log('Successfully created user account with uid:', userData.uid);
                }
            });
        }
    });
    app.use('/api/users', router);
};
