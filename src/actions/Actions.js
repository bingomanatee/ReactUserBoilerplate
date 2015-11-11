const USER_LOGIN = 'USER_LOGIN';
const USER_LOGOFF = 'USER_LOGOFF';

const logIn = (user) => ({type: USER_LOGIN, user: user});
const logOff = () => ({type: USER_LOGOFF});

module.exports = { USER_LOGIN, USER_LOGOFF, logIn, logOff };
