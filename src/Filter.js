import * as React from 'react';
import { Rating } from '@mui/material';

function Filter(props) {
  const {onChange, options} = props;

  const handleRatingChange = e => {
    onChange(e.target.name, e.target.value);
  }

  return (
    <div style={{ borderRight: '1px solid red' }}>
      <h2> Filters</h2>
      <div>
        <h4> Restaurant ratings: </h4>
        <Rating name="rating" value={Number(options.rating)} precision={0.5} onChange={handleRatingChange} />
      </div>
    </div>
  )
}

export default Filter;