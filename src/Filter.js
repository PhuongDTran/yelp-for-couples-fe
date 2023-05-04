import * as React from 'react';
import {
  Rating,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';


const convertMilesToMeters = (distanceInMiles) => {
  return Number(distanceInMiles) * 1609.34;
}

const convertMetersToMiles = (distanceInMeters) => {
  return Math.round(Number(distanceInMeters) / 1609.34);
}


function Filter(props) {
  const { onChange, options } = props;

  const [internalDistance, setInternalDistance] = React.useState(convertMetersToMiles(options.distance)); // in miles

  const handleRatingChange = e => {
    onChange(e.target.name, e.target.value);
  }

  const handleDistanceChange = (e, value) => {
    onChange('distance', convertMilesToMeters(value));
  }

  const handlePriceChange = e => {
    let updatedPrice = [];
    if (e.target.checked) {
      updatedPrice = [...options.price, Number(e.target.value)];
    } else {
      updatedPrice = options.price.filter(v => v != e.target.value);
    }
    onChange(e.target.name, updatedPrice);
  }

  return (
    <div style={{ borderRight: '1px solid red' }}>
      <h2> Preferences</h2>
      <div>
        <h4> Restaurant ratings: </h4>
        <Rating name="rating" value={Number(options.rating)} precision={0.5} onChange={handleRatingChange} />
      </div>
      <div>
        <h4> How far? (miles): </h4>
        <Slider
          name='distance'
          min={1}
          max={100}
          value={internalDistance}
          valueLabelDisplay="auto" onChange={(e, v) => setInternalDistance(v)}
          onChangeCommitted={handleDistanceChange} />
      </div>
      <div>
        <h4> Prices: </h4>
        <FormGroup>
          <FormControlLabel control={<Checkbox name='price' value={1} checked={options.price.includes(1)} onChange={handlePriceChange} />} label="Low" />
          <FormControlLabel control={<Checkbox name='price' value={2} checked={options.price.includes(2)} onChange={handlePriceChange} />} label="Medium" />
          <FormControlLabel control={<Checkbox name='price' value={3} checked={options.price.includes(3)} onChange={handlePriceChange} />} label="High" />
          <FormControlLabel control={<Checkbox name='price' value={4} checked={options.price.includes(4)} onChange={handlePriceChange} />} label="Expensive" />
        </FormGroup>
      </div>
    </div>
  )
}

export default Filter;