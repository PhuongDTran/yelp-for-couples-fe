import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [data, setData] = useState()
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer wUbMmmP57UL_e5AaOX5X2ZTjDrkWwMt-vjedpjqRKxqmAdNv8MJ_RTDykcIMJ2ehntGfJbk1-0_uY2DVRMkOwuSJvO5Q1-PiGzMLJhB4KJhT-gNpzMJzWtecs05RZHYx'
    }
  };
  
  async function getData() {
    fetch('https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=nyc&sort_by=best_match&limit=20', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
  }

  return (
    <div className="App">
      <h1>Yelp for couples</h1>
      <button onClick={getData}>Get data</button>
      {data}
    </div>
  );
}

export default App;
