import { useState, useEffect } from 'react';
import { TextField, Checkbox, Button, Card, FormGroup, FormControlLabel, Slider, Select, MenuItem, FormControl } from "@mui/material";

import './Form.css';
import { convertMilesToMeters, convertMetersToMiles, MAX_RADIUS } from '../utils';

function Form(props) {

    const [location, setLocation] = useState('');
    const [foodType, setFoodType] = useState('');
    const [radius, setRadius] = useState(MAX_RADIUS / 2); // in metters
    const [price, setPrice] = useState([]); // 1, 2, 3, 4 => $, $$, $$$, $$$$

    const [internalDistance, setInternalDistance] = useState(convertMetersToMiles(radius)); // in miles
    const [validation, setValidation] = useState('false');

    useEffect(() => {
        let isValid = foodType && price;

        isValid = isValid && price.length > 0;
        if (props.currentPartnerForm === 1) {
            isValid = isValid && location;
        }
        setValidation(isValid);
    }, [location, foodType, radius, price])

    const handleSubmit = () => {
        props.setPartnerInfo({
            location: location,
            foodType: foodType,
            radius: radius, //How far from the location willing to travel in meters
            price: price, //Pricing levels to filter the search result with: 1 = $, 2 = $$, 3 = $$$, 4 = $$$$.
        })
        props.setPartnerForm(prevState => prevState + 1);
        // clear the first form
        setLocation('');
        setFoodType('');
        setRadius(MAX_RADIUS / 2);
        setPrice([]);
    }

    const handlePriceChange = e => {
        let updatedPrice = [];
        if (e.target.checked) {
            updatedPrice = [...price, Number(e.target.value)];
        } else {
            updatedPrice = price.filter(v => v != e.target.value);
        }
        setPrice(updatedPrice);
    }

    return (
        <Card className='form-card'>
            <h2>Partner {props.currentPartnerForm} Preferences</h2>
            <div className='input-container-container'>
                <div className='input-container'>
                    <label>Location:</label>
                    <TextField variant='outlined' size='small' disabled={props.currentPartnerForm === 2} placeholder="City, State, Zipcode" onChange={(e) => setLocation(e.target.value)} value={location}></TextField>
                </div>
                <div className='input-container'>
                    <label>Food type: </label>
                    <FormControl fullWidth size='small'>
                    {/* <TextField variant='outlined' size='small' placeholder="Italian, Thai" onChange={(e) => setFoodType(e.target.value)} value={foodType}></TextField> */}
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={foodType}
                        onChange={e => setFoodType(e.target.value)}
                    >
                        <MenuItem value={'korean'}>Korean</MenuItem>
                        <MenuItem value={'thai'}>Thai</MenuItem>
                        <MenuItem value={'vietnamese'}>Vietnamese</MenuItem>
                        <MenuItem value={'chinese'}>Chinese</MenuItem>
                        <MenuItem value={'italian'}>Italian</MenuItem>
                        <MenuItem value={'japanese'}>Japanese</MenuItem>
                    </Select>
                    </FormControl>
                </div>
                <div className='input-container'>
                    <label>How far in miles?: </label>
                    <Slider
                        min={1}
                        max={convertMetersToMiles(MAX_RADIUS)}
                        value={internalDistance}
                        valueLabelDisplay="auto"
                        onChange={(e, v) => setInternalDistance(v)}
                        onChangeCommitted={(e, v) => setRadius(convertMilesToMeters(v))} />
                </div>

                <div className='input-container'>
                    <label> Prices: </label>
                    <FormGroup row>
                        <FormControlLabel control={<Checkbox name='price' value={1} checked={price.includes(1)} onChange={handlePriceChange} />} label="Low" />
                        <FormControlLabel control={<Checkbox name='price' value={2} checked={price.includes(2)} onChange={handlePriceChange} />} label="Medium" />
                        <FormControlLabel control={<Checkbox name='price' value={3} checked={price.includes(3)} onChange={handlePriceChange} />} label="High" />
                        <FormControlLabel control={<Checkbox name='price' value={4} checked={price.includes(4)} onChange={handlePriceChange} />} label="Expensive" />
                    </FormGroup>
                </div>
            </div>
            <Button className='submitButton' variant="contained" disabled={!validation} onClick={handleSubmit}>Submit</Button>
        </Card>
    )
}

export default Form;