import { useState } from 'react';
import { TextField, Checkbox, Button } from "@mui/material"
function Form(props) {
    const [location, setLocation] = useState('');
    const [foodType, setFoodType] = useState('');
    const [radius, setRadius] = useState('');
    const [price, setPrice] = useState(''); // 1, 2, 3, 4 => $, $$, $$$, $$$$

    const handleSubmit = () => {
        props.setPartnerInfo({
            location: location,
            foodType: foodType,
            radius: radius, //How far from the location willing to travel in meters
            price: price, //Pricing levels to filter the search result with: 1 = $, 2 = $$, 3 = $$$, 4 = $$$$.        
        })
        
        props.setPartnerForm(prevState => prevState + 1);
    }

    const handleCheckbox = (price) => {
        setPrice(prevState => {
            if (prevState === '') {
                return prevState + price
            } else if (prevState.includes(price)) {
                return prevState.replace(price, '');
            } else if (prevState !== '') {
                return prevState + ', ' + price;
            } else {
                return prevState;
            }
        })
    }
    return (
        <div>
            <h2>Partner {props.currentPartnerForm} Preferences:</h2>
            {
                props.currentPartnerForm === 1 && 
                <TextField type="text" placeholder="City, State, Zipcode" onChange={(e) => setLocation(e.target.value)}></TextField>
            }
            <TextField type="text" placeholder="Food Type? (Italian, Thai)" onChange={(e) => setFoodType(e.target.value)}></TextField>
            <TextField type="text" placeholder="How far? (meters)" onChange={(e) => setRadius(e.target.value)}></TextField>
            <Checkbox onChange={() => handleCheckbox('1')}></Checkbox> Low Prices
            <Checkbox onChange={() => handleCheckbox('2')}></Checkbox> Medium Prices
            <Checkbox onChange={() => handleCheckbox('3')}></Checkbox> High Prices
            <Checkbox onChange={() => handleCheckbox('4')}></Checkbox> Expensive Prices
            <Button onClick={handleSubmit}>Submit</Button>
        </div>
    )
}

export default Form;