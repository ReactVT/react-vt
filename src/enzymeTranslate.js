const data = [
 {name: 'firstBlock', asserts: [
    {'type': 'greaterthan', 'selector': 'component', 'selectorName': 'Row', 'selectorModifier': '.length', 'value': '2', 'dataType': 'number'}, 
    {'type': 'equal', 'selector': 'id', 'selectorName': 'previousMatches', 'source': 'text', 'value': 'Previous matches', 'type': 'string'}, 
    {'type': 'equal', 'selector': 'class', 'selectorName': 'rows', 'selectorModifier': '[0]' 'source': 'text', 'value': 'Previous matches', 'dataType': 'string'}
 ]}
];





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

  describe('Full Mount Test', () => {
    // TODO: Write a test to make sure a GameList renders a <ul> with an <li>
    // for every item in its gameList array prop
    it('allows us to check state', () => {
      const wrapper = mount(<App />);
      expect(wrapper.state().turn).toEqual('X');
      expect(wrapper.find(Row).length).toEqual(3);
    });
  });
});