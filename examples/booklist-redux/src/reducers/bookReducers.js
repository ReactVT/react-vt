// ./src/reducers/bookReducers.js
export default (state = [], action) => {
  switch (action.type){
    case 'CREATE_BOOK':
        return [
          ...state,
          Object.assign({}, action.book)
        ];
    default:
          return state;
  }
};