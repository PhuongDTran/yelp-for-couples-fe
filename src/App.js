import * as React from 'react';

import {
  TextField,
  IconButton
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

import { searchBussiness } from './yelpApi';

import Filter from './Filter';
import Business from './Business';

import './App.css';

function App() {
  const [searchText, setSearchText] = React.useState('');
  const [businesses, setBusinesses] = React.useState(null);
  const [filter, setFilter] = React.useState({
    rating: 3.5
  });

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
