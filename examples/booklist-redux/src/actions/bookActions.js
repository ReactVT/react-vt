// ./src/actions/bookActions.js
export const createBook = (book) => {
  // Return action
  return {
    // Unique identifier
    type: 'CREATE_BOOK',
    // Payload
    book: book
  }
};