import expect from 'expect';
import posts from '../../client/reducers/posts';
import defaultPosts from '../../client/data/posts';

describe('Posts Reducer', function () {
  
  it('should add a like to an existing post', function () {
    const index = 2;
    const action = { type: 'INCREMENT_LIKES', index };
    const actual = posts(defaultPosts, action);
    expect(actual[index].likes).toEqual(defaultPosts[index].likes + 1);
  });
  
})
