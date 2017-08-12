import React, { PropTypes } from 'react';

const Row = (props) => {
  const {number} = props;
  let x = 'There are ' + number + ' rows'; 
  return (
    <div className="row">
      <h3 id="supbro">{x}</h3>
    </div>
  );
};

Row.propTypes = {
  number: PropTypes.number.isRequired,
};

export default Row;
