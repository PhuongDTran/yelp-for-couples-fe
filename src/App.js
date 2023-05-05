import * as React from "react";

import {
  TextField,
  IconButton,
  Checkbox,
  Button,
  Divider,
  InputAdornment,
  Grid
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

import { searchBussiness } from "./yelpApi";
import { MAX_RADIUS, getRandomInt } from './utils';

import Filter from "./Filter";
import BusinessCard from "./BusinessCard";

import Form from "./components/Form";
import "./App.css";

const defaultFilterOptions = {
  rating: 2,
  distance: 0, // in meters
  price: [],
  categories: [],
  location: ''
};

const combinePartnerFilters = (partnerA, partnerB) => {
  let filters = { ...defaultFilterOptions };

  // set location
  filters.location = partnerA.location;

  // use the largest distance
  filters.distance = Math.max(partnerA.radius, partnerB.radius);

  // combine prices
  let prices = new Set();
  partnerA.price.forEach(v => prices.add(v));
  partnerB.price.forEach(v => prices.add(v));
  filters.price = Array.from(prices);

  // combine categories
  let categories = new Set();
  categories.add(partnerA.foodType);
  categories.add(partnerB.foodType);
  filters.categories = Array.from(categories);

  return filters;
}

const buildQueryParams = (filters) => {
  let params = {};
  params['location'] = filters.location;
  params['radius'] = MAX_RADIUS; // max radus allowed to use in yelp api
  params['categories'] = filters.categories.toString();
  params['price'] = filters.price.toString();
  params['sort_by'] = 'best_match';
  // params['limit'] = 20;

  let queryString = '';
  for (let key of Object.keys(params)) {
    queryString += `${key}=${params[key]}&`
  }

  // the queryString has extra '&' at the end, need to trim it
  return queryString.substring(0, queryString.length - 1);
}

function App() {
  // this is search result fetched from yelp.
  // DO NOT modify this data
  const [businesses, setBusinesses] = React.useState(null);

  // business list after applying filters
  const [filterBusinesses, setFilterBusinesses] = React.useState(null);

  const [selectBusinesses, SetSelectBusinesses] = React.useState([]);

  const [filterOptions, setFilterOptions] = React.useState(defaultFilterOptions);

  const [hasPicked, setHasPicked] = React.useState(false);

  const [currentPartnerForm, setCurrentPartnerForm] = React.useState(1); //If at 3, then don't show form
  const [partnerAInfo, setPartnerAInfo] = React.useState({});
  const [partnerBInfo, setPartnerBInfo] = React.useState({});

  // apply filters to saved business list when a filter changed
  React.useEffect(() => {
    const filterResult = applyFilters(businesses);
    setFilterBusinesses(filterResult);
  }, [filterOptions]);

  React.useEffect(() => {
    if (Object.keys(partnerAInfo).length !== 0 &&
      Object.keys(partnerBInfo).length !== 0) {
      handleSearch()
    }

  }, [partnerAInfo, partnerBInfo]);

  // triggered when have all partners info
  const handleSearch = async () => {
    const mutualFilterOptions = combinePartnerFilters(partnerAInfo, partnerBInfo);
    // Note: fetch all restaurants with max radius allowed,
    // then using user radius input to filter out later.
    const queryParams = buildQueryParams(mutualFilterOptions);

    const resp = await searchBussiness(queryParams);

    // filter and render businesses
    const filterResult = applyFilters(resp.businesses);

    setBusinesses(resp.businesses);
    setFilterBusinesses(filterResult);
    setFilterOptions(mutualFilterOptions);

    document.getElementById("randomRestaurantButton").style.display = "block";
  };


  const handleFilterOptionsChange = (option, value) => {
    let updatedFilter = { ...filterOptions };
    updatedFilter[option] = value;
    setFilterOptions(updatedFilter);
  };

  const applyFilters = (businessList) => {
    const result = businessList?.filter((business) => {
      return (
        filterOptions.rating <= business.rating &&
        filterOptions.price.includes(business.price?.length) && // 1 = $, 2 = $$, 3 = $$$, 4 = $$$$ => number == string length
        filterOptions.distance >= business.distance
      );
    });
    return result;
  };

  const handleBusinessClick = (businessId) => {
    let businessClicked = filterBusinesses.find(v => v.id === businessId);

    const hasSelected = selectBusinesses.find(v => v.id === businessClicked.id);
    if (hasSelected) {
      const updatedSelection = selectBusinesses.filter(v => v.id !== businessClicked.id);
      SetSelectBusinesses(updatedSelection);
    } else {
      SetSelectBusinesses([...selectBusinesses, businessClicked]);
    }
  }

  const handlePickRandom = () => {
    if (selectBusinesses.length > 0) {
      const random = getRandomInt(selectBusinesses.length);
      setFilterBusinesses([selectBusinesses[random]]);
    } else {
      const random = getRandomInt(filterBusinesses.length);
      setFilterBusinesses([filterBusinesses[random]]);
    }
    setHasPicked(!hasPicked)
  }

  const handleUndoRandom = () => {
    const filterResult = applyFilters(businesses);
    setFilterBusinesses(filterResult);
    setHasPicked(!hasPicked)
    SetSelectBusinesses([]);
  }

  return (
    <div className="App" style={{ display: "flex", flexDirection: "column" }}>
      <div id="randomRestaurantButton">
        <h1>List of restaurants that fit your search</h1>
      </div>
      <div className="MainBody">
        <div className="sideFilters" >
          {businesses &&
            <div>
              <div>
                <Filter
                  onChange={handleFilterOptionsChange}
                  options={filterOptions}
                />
              </div>
              <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
              <div>
                <h3>Let us pick a restaurant for you</h3>
                <Button
                  variant="contained"
                  sx={{ marginRight: 2 }}
                  onClick={handlePickRandom}
                  disabled={hasPicked}
                >
                  {selectBusinesses.length > 0 ? "Pick from selected list" : 'Pick from search result'}
                </Button>
                <Button variant="contained" color="error" disabled={!hasPicked} onClick={handleUndoRandom}>Undo</Button>
              </div>
            </div>
          }
        </div>
        <div className="formDisplay">
          {currentPartnerForm <= 2 ? (
            <Form
              currentPartnerForm={currentPartnerForm}
              setPartnerInfo={currentPartnerForm === 1 ? setPartnerAInfo : setPartnerBInfo}
              setPartnerForm={setCurrentPartnerForm}
            />
          ) : null}
          {filterBusinesses &&
            <Grid container spacing={2}>
              {filterBusinesses.map((business) => (
                <Grid item key={business.id}>
                  <BusinessCard businessDetails={business} onClick={handleBusinessClick} />
                </Grid>
              ))}
            </Grid>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
