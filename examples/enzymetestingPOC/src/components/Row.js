import React, { PropTypes } from 'react';

const Row = (props) => {
  const {number} = props;
  let x = 'There are ' + number + ' rows'; 
  return (
    <div className="imaclass    alsoaclass">
      <h3>{x}</h3>
    </div>
  );
};

Row.propTypes = {
  number: PropTypes.number.isRequired,
};

export default Row;
