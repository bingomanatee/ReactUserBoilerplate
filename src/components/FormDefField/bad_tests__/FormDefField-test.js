jest.dontMock('../FormDefField');
jest.dontMock('../../../utils/FieldDef');
jest.dontMock('eventEmitter3');
jest.dontMock('../../../decorators/withStyles');
jest.dontMock('../FormDefField.css');
jest.dontMock('react');
jest.dontMock('react-dom');
jest.dontMock('css-loader');
jest.dontMock('react-addons-test-utils');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import {Component} from 'react';
const FormDefField = require('../FormDefField');
const fieldDefModule = require('../../../utils/FieldDef');

describe('FormDefField', function () {
    describe('text field', function () {
        var fieldDef;
        var fieldDefNode;
        var field;
        const TOO_SHORT = 'too short';

        beforeEach(function () {
            fieldDef = new fieldDefModule.FieldDef('alpha', 'foo', 'text', {
                validators: [
                    [{type: 'min', limit: 5}, TOO_SHORT]
                ]
            });

            console.log('fieldDef: ', fieldDef);

            fieldDef = TestUtils.renderIntoDocument(<FormDefField def={fieldDef}/>);
            fieldDefNode = ReactDOM.findDOMNode(fieldDef);
        });

        it('should render form field', function () {
            expect(fieldDefNode.textContent).toEqual('Off');
        });
    });
});
