// This stores props and state for each node. Uses the address of the node as the key.

// Planning to add other storage objects here and have them all be keys on the export.
let storage = {
  address: {},
  id: {}, 
  class: {}, 
  node: {} 
};

const empty = () => storage = {
  address: {},
  id: {}, 
  class: {}, 
  node: {} 
};

module.exports = {
  storage,
  empty
};