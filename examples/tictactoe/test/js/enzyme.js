const expect = require('expect');
const React = require('react');
import 'jsdom-global/register';
import App from '../../src/components/App';
import Square from '../../src/components/Square';
import Row from '../../src/components/Row';
import GameList from '../../src/components/GameList';
import { shallow } from 'enzyme';
import { mount } from 'enzyme';
import sinon from 'sinon';

// Enzyme is a wrapper around React test utilities which makes it easier to
// shallow render and traverse the shallow rendered tree.

describe('React unit tests', () => {
  describe('<Square />', () => {
    let wrapper;
    let spy

    before(() => {
      spy = sinon.spy();
      wrapper = shallow(<Square row={0} square={1} letter="X" handleClick={ spy } />);
    });

    it('Renders a <div> with class "square"', () => {
      expect(wrapper.text()).toEqual('X');
      expect(wrapper.type()).toEqual('div');
      expect(wrapper.props().className).toEqual('square');
    });

    it('Clicking on the square passes row and square props to handleClick', () => {
      //shallow-render parent
      wrapper.simulate('click');
      expect(spy.calledOnce).toBe(true);
      expect(spy.args[0]).toEqual([0, 1]);
    });
  });

  describe('<Row />', () => {
    let wrapper;
    // TODO: Write a test to make sure a Row renders 3 Squares
    it('Renders 3 squares', () => {
      wrapper = shallow(<Row key={2} row = {0} letters={['','','']} handleClick={ () => {} }/>);
      expect(wrapper.children().length).toEqual(3);
      expect(wrapper.childAt(1).name()).toBe('Square');
    });
  });

  describe('GameList', () => {
    // TODO: Write a test to make sure a GameList renders a <ul> with an <li>
    // for every item in its gameList array prop
    let wrapper;
    it('Renders a ul with an li', () => {
      wrapper = shallow(<GameList gameList = {  [
        {
          "winner": "X",
          "id": 0,
          "createdAt": "2017-06-30T18:19:38.581Z"
        },
        {
          "winner": "X",
          "id": 1,
          "createdAt": "2017-06-30T18:19:38.634Z"
        },
        {
          "winner": "O",
          "id": 2,
          "createdAt": "2017-06-30T18:20:06.597Z"
        },
        {
          "winner": "O",
          "id": 3,
          "createdAt": "2017-06-30T18:20:06.719Z"
        },
        {
          "winner": "O",
          "id": 4,
          "createdAt": "2017-06-30T18:20:07.773Z"
        },
        {
          "winner": "O",
          "id": 5,
          "createdAt": "2017-06-30T18:20:37.108Z"
        }
      ]} />);
      expect(wrapper.find('ul').length).toEqual(1);
      expect(wrapper.find('li').length).toEqual(6);
    });
  });
});
