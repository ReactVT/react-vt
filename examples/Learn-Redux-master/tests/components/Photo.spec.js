import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import expect from 'expect';
import expectJSX from 'expect-jsx';
expect.extend(expectJSX);
import Photo from '../../client/components/Photo';

// grab some data to use
import comments from '../../client/data/comments';
import posts from '../../client/data/posts';


describe('Photo Component', function () {
  var result;
  
  before(()=> {
    var renderer = ReactTestUtils.createRenderer();
    
    const props = {
      post : posts[0],
      comments : comments[posts[0].code],
      i : 0,
      increment: expect.createSpy()
    };

    renderer.render(<Photo {...props} />)
    result = renderer.getRenderOutput();
  });

  it('should return a figure element',()=>{
    expect(result.type).toEqual('figure');
  });

  it('should have two children',()=>{
    expect(result.props.children.length).toEqual(2);
  });

})
