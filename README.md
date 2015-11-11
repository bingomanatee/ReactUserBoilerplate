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

## Some notes on data validation

The only action that requires user information is logIn. 

logInBad has an optional data manifest, 'userInvalidReason', that contains server feedback to use in displaying 
information about which field(s) are invalid; its up to the app designer to decide whether to tell the user 
what went wrong... security vs. user friendliness. 

All other actions exist purely to update userState. 
