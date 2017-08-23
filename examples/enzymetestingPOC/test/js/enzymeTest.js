const expect = require('chai').expect;
import React from 'react';
import { mount } from 'enzyme';
import 'jsdom-global/register';
import App from '../../src/components/App';
import ReactTestUtils from 'react-dom/test-utils';
 
describe('React VT Tests', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<App />);
  });
 
  it('test', () => {
  	wrapper.find('#listInput').simulate('keyDown', {which: 66 });

    wrapper.find('#listInput').simulate('keyDown', { key: 'Enter', keyCode: 13, which: 13 });
    

    expect(wrapper.find('li').at(6).text()).to.equal('bro');
  });
 
});