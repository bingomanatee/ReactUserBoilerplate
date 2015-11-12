jest.dontMock('./../State');
jest.dontMock('./../Store');
jest.dontMock('./../../actions/Actions');
jest.dontMock('redux');
jest.dontMock('./../UserAuth');

var state = require('./../State');
var store = require('./../Store');
var Actions = require('./../../actions/Actions');


describe('Store', function () {
    describe('#startState', function () {
        it('should have null as a user', function () {
            const startState = store.getState();
            expect(startState.user).toBeNull();
        });
    });

    describe('#logIn', function () {
        it('should accept bob as a user', function () {
            store.dispatch(Actions.logIn({name: 'bob'}));
            const storeState = store.getState();

            expect(storeState.user.name).toBe('bob');
        });
    });

    describe('#logOff', function () {
        it('should wipe Bob after logoff', function () {
            store.dispatch(Actions.logIn({name: 'bob'}));
            store.dispatch(Actions.logOff());
            const storeState = store.getState();

            expect(storeState.user).toBeNull();
        });
    });
});
