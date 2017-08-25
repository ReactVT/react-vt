const expect = require('chai').expect;
import React from 'react';
import { mount } from 'enzyme';
import 'jsdom-global/register';
import App from '../../src/components/App';
 
describe('React VT Tests', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<App />);
  });
 
  it('should equal X', () => {
    wrapper.find('#board').childAt(0).childAt(0).simulate('click');
  expect(wrapper.find('Square').at(0).props().letter).to.equal('X');
  });
 
});