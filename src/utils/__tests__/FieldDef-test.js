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
                badField.value = 'a very long value';
                expect(badField.errors).toBeNull();
            });

            it('should change good to bad when field value changes', function () {
                goodField.value = 'foo';
                expect(goodField.errors).toBe(TOO_SHORT);
            });
        });
    });
});
