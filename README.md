## ReactUserBoilerplate

This is an implementation of the [ReactStarterKit](https://github.com/kriasoft/react-starter-kit)
with a Redux-based Store. 

As of now two things are stored in the Store:

the `.user` (with no required attributes) 
the `.userState` which is defined using constants defined in Actions.js. 

the userState moves through the following chain: 

* `USER_LOGOFF` is the start state, in which there is no data in user (is null). 
* `USER_LOGIN` in which the user has entered in all required fields to register 
  and that data has been sent to the API for validation.
* `USER_LOGIN_VALID` after the server has validated the user is a registerd user; 
  this is the state that the application should be in most of the time. 
* `USER_LOGIN_INVALID` if the server has rejected the users' credentials. 

A similar chain exists for registration. 

## the injectibles 

This example is written around firebase. However the methods for actually executing
login and registration are injectable. UserAuth has two methods, setUserRegistration
and setUserValidation, that determine how login and registration are processed. 

This can be set and reset at any time; so you can have more than one system of 
registration and login and inject the methodology immediately before submission. 
This allows you to, for instance, use social and local userbases in combination. 

## Users and Sessions

The user data is kept in session in the field "user". In the client, whatever data 
is stored in session is also passed to the client, so that the client can then 
mutate that data in the User class to fill out the client-relevant information. 

You can, for instance, simply pass the ID of the user and poll the rest of the data
from the API. 

## Identity

Some user bases require an email/password combination (as is the case with firebase). 
Some require a username/password. Some require username, email and password. 
To be as flexible as possible the system as four constants:

ASK_USERNAME
USERNAME_REQUIRED
ASK_EMAIL
EMAIL_REQUIRED

this allows you to, for instance, ask both email and username, but only *require* username.
At least one identity field must be both asked and required.
You coould have a user registration systems with just a psasword if you want but its a bad idea.

Although these are system wide constants, provided from UserAuth, 
they can be made resettable var's if needed. 

## Some notes on data validation

The only actions that require user information are logIn and reg. 

logInBad has an optional data manifest, 'userInvalidReason', that contains server feedback to use in displaying 
information about which field(s) are invalid; its up to the app designer to decide whether to tell the user 
what went wrong... security vs. user friendliness. 

All other actions exist purely to update userState.
