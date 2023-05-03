import * as React from 'react';

import {
  TextField,
  IconButton,
  Checkbox,
  Button
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

import { searchBussiness } from './yelpApi';

import Filter from './Filter';
import Business from './Business';

import Form from './components/Form';
import './App.css';

function App() {
  const [searchText, setSearchText] = React.useState('');
  const [businesses, setBusinesses] = React.useState(null);
  const [filter, setFilter] = React.useState({
    rating: 3.5
  });

  const [currentPartnerForm, setCurrentPartnerForm] = React.useState(1); //If at 3, then don't show form
  const [partnerAInfo, setPartnerAInfo] = React.useState({
    location: '',
    foodType: '',
    radius: 0, //How far from the location willing to travel in meters
    price: '$', //Pricing levels to filter the search result with: 1 = $, 2 = $$, 3 = $$$, 4 = $$$$.

  });
  const [partnerBInfo, setPartnerBInfo] = React.useState({});

  const handleSearch = async () => {
    const queryParams = 'location=nyc';
    const resp = await searchBussiness(queryParams);
    setBusinesses(resp.businesses);
  }

  const handleFilterChange = (option, value) => {
    let updatedFilter = { ...filter };
    updatedFilter[option] = value;
    setFilter(updatedFilter);
  }

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%' }}>
        <TextField
          size="small"
          variant="outlined"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <IconButton color="primary" onClick={handleSearch}>
          <SearchOutlinedIcon />
        </IconButton>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <div style={{ marginRight: '20px' }}>
          <Filter onChange={handleFilterChange} options={filter} />
        </div>
        {currentPartnerForm === 1 && <Form 
          currentPartnerForm={currentPartnerForm}
          partner={partnerAInfo}
          setPartnerInfo={setPartnerAInfo}
          setPartnerForm={setCurrentPartnerForm} //Used to change from partner 1 to partner 2
        />}

        {currentPartnerForm === 2 && <Form 
          currentPartnerForm={currentPartnerForm}
          partner={partnerBInfo}
          setPartnerInfo={setPartnerBInfo}
          setPartnerForm={setCurrentPartnerForm}
        />}
        <button onClick={() => console.log(partnerAInfo, partnerBInfo)}>Check Partner Data</button>
        <div>
          {
            businesses && businesses.map(business => {
              if (business.rating >= filter.rating) {
                return (
                  <Business id={business.id} />
                )
              }
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
