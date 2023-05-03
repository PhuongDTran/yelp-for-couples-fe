import { useState } from 'react';
import { TextField, Checkbox, Button } from "@mui/material"
function Form(props) {
    const [location, setLocation] = useState('');
    const [foodType, setFoodType] = useState('');
    const [radius, setRadius] = useState('');
    const [price, setPrice] = useState(''); // $, $$, $$$, $$$$

    const handleSubmit = () => {
        props.setPartnerInfo({
            location: location,
            foodType: foodType,
            radius: radius, //How far from the location willing to travel in meters
            price: price, //Pricing levels to filter the search result with: 1 = $, 2 = $$, 3 = $$$, 4 = $$$$.        
        })
        
        props.setPartnerForm(prevState => prevState + 1);
    }
    return (
        <div>
            <h2>Partner {props.currentPartnerForm} Preferences:</h2>
            <TextField type="text" placeholder="Where do you live? (city)" onChange={(e) => setLocation(e.target.value)}></TextField>
            <TextField type="text" placeholder="Food Type? (Italian, Thai)" onChange={(e) => setFoodType(e.target.value)}></TextField>
            <TextField type="text" placeholder="How far? (meters)" onChange={(e) => setRadius(e.target.value)}></TextField>
            <Checkbox></Checkbox> Low Prices
            <Checkbox></Checkbox> Medium Prices
            <Checkbox></Checkbox> High Prices
            <Checkbox></Checkbox> Expensive Prices
            <Button onClick={handleSubmit}>Submit</Button>
        </div>
    )
}

export default Form;