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
import BusinessCard from './BusinessCard';

import Form from './components/Form';
import './App.css';

function App() {
  const [searchText, setSearchText] = React.useState('');

  // this is search result fetched from yelp.
  // DO NOT modify this data
  const [businesses, setBusinesses] = React.useState(null);

  // business list after applying filters
  const [filterBusinesses, setFilterBusinesses] = React.useState(null);

  const [filterOptions, setFilterOptions] = React.useState({
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

  // apply filters to saved business list when a filter changed
  React.useEffect(() => {
    const filterResult = applyFilters(businesses);
    setFilterBusinesses(filterResult);
  }, [filterOptions]);

  // triggered when "Search" clicked
  const handleSearch = async () => {
    const queryParams = 'location=nyc';
    const resp = await searchBussiness(queryParams);
    setBusinesses(resp.businesses);
    // filter and render businesses
    const filterResult = applyFilters(resp.businesses);
    setFilterBusinesses(filterResult);
  }

  const handleFilterOptionsChange = (option, value) => {
    let updatedFilter = { ...filterOptions };
    updatedFilter[option] = value;
    setFilterOptions(updatedFilter);
  }


  const applyFilters = (businessList) => {
    const result = businessList?.filter(business => {
      return business.rating >= filterOptions.rating;
    });
    return result;
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
          <Filter onChange={handleFilterOptionsChange} options={filterOptions} />
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
            filterBusinesses && filterBusinesses.map(business =>
              <BusinessCard key={business.id} businessDetails={business} />
            )}
        </div>
      </div>
    </div>
  );
}

export default App;
