jest.dontMock('./../FieldDef');
jest.dontMock('./../Strings');
const fieldDef = require('./../FieldDef');
const strings = require('./../Strings');
jest.dontMock('redux');

describe('FieldDef', function () {
    describe('base parameters', function () {
        var field;

        beforeEach(function () {
            field = new fieldDef.FieldDef('alpha', 'foo', {});
        });

        it('should accept the name', function () {
            expect(field.name).toBe('alpha');
        });

        it('should accept the fieldValue', function () {
            expect(field.fieldValue).toBe('foo');
        });
    });

    describe('validators', function () {
        describe('min', function () {
            var badField;
            var goodField;
            const TOO_SHORT = 'too short';

            beforeEach(function () {
                badField = new fieldDef.FieldDef('beta', 'foo foo', 'text', {
                    validators: [
                        [{type: 'min', limit: 5}, TOO_SHORT]
                    ]
                });
                goodField = new fieldDef.FieldDef('beta', 'foo', 'text', {
                    validators: [
                        [{type: 'min', limit: 5}, TOO_SHORT]
                    ]
                });
            });

            it('should register "foo" as tooShort', function () {
                expect(goodField.errors).toBe(TOO_SHORT);
            });

            it('should register "foo foo" as null (long enough)', function () {
                expect(badField.errors).toBeNull();
            });

            it('should change bad to good when field value changes', function () {
                badField.fieldValue = 'a very long value';
                expect(badField.errors).toBeNull();
            });

            it('should change good to bad when field value changes', function () {
                goodField.fieldValue = 'foo';
                expect(goodField.errors).toBe(TOO_SHORT);
            });
        });

        describe('regex', function () {
            var badField;
            var goodField;
            const BAD_REGEX = 'bad regex';
            const REGEX = /^\d[\w]+$/;

            beforeEach(function () {
                badField = new fieldDef.FieldDef('beta', 'alpha', 'text', {
                    validators: [
                        [{type: 'regex', limit: REGEX}, BAD_REGEX]
                    ]
                });
                goodField = new fieldDef.FieldDef('gamma', '2alpha', 'text', {
                    validators: [
                        [{type: 'regex', limit: REGEX}, BAD_REGEX]
                    ]
                });
            });

            it('should register "alpha" as ' + BAD_REGEX, function () {
                expect(badField.errors).toBe(BAD_REGEX);
            });

            it('should register "2alpha" as null (long enough)', function () {
                expect(goodField.errors).toBeNull();
            });

            it('should change bad to good when field value changes', function () {
                badField.fieldValue = '3beat';
                expect(badField.errors).toBeNull();
            });

            it('should change good to bad when field value changes', function () {
                goodField.fieldValue = 'foo';
                expect(goodField.errors).toBe(BAD_REGEX);
            });
        });
    });
});
