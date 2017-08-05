// ./src/reducers/index.js
import { combineReducers } from 'redux';
import books from './bookReducers'

export default combineReducers({
  books: books,
  // More reducers if there are
  // can go here
});