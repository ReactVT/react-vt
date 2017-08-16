// This stores props and state for each node. Uses the address of the node as the key.

// Planning to add other storage objects here and have them all be keys on the export.
let storage = {
  address: {},
  id: {}, 
  class: {}, 
  node: {}, 
  tag: {} 
};

const empty = function() {
  storage = {
  address: {},
  id: {}, 
  class: {}, 
  node: {}, 
  tag: {} 
}
};

module.exports = {
  storage,
  empty
};