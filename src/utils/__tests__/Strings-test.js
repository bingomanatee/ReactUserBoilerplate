jest.dontMock('./../Strings');
const strings = require('./../Strings');
jest.dontMock('redux');

describe('strings', function () {
    var enStrings = null;
    var lvStrings = null;
    beforeEach(function () {
        enStrings = strings('StringsTest', 'en');
        lvStrings = strings('StringsTest', 'lv');
    });
    describe('simple strings', function () {
        it('should give head:en(default)', function () {
            expect(enStrings('head')).toBe('head');
        });
        it('should give head:lv', function () {
            expect(lvStrings('head')).toBe('galva');
        });
    });

    describe('parametric strings', function () {
        it('should allow you to replace terms manually', function () {
            expect(enStrings('extraHoldThe', {EXTRA: 'xtra!!', HOLD: 'høld'})).toBe('extra xtra!! hold the høld');
        });
    });

    describe('metatranslation', function () {
        it('should embed translated terms into other terms:en', function () {
            expect(enStrings('metaKn')).toBe('meta knife');
        });
        it('should embed translated terms into other terms:lv', function () {
            expect(lvStrings('metaKn')).toBe('rekursijas nazis'); // i didn't know that either;
        });
    });
});
