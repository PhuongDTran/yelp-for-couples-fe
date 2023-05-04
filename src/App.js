import * as React from "react";

import {
  TextField,
  IconButton,
  Checkbox,
  Button,
  Divider,
  InputAdornment,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

import { searchBussiness } from "./yelpApi";

import Filter from "./Filter";
import BusinessCard from "./BusinessCard";

import Form from "./components/Form";
import "./App.css";

const defaultFilterOptions = {
  rating: 3.0,
  distance: 10000, // in meters
  price: [1, 2, 3, 4],
};

function App() {
  const [searchText, setSearchText] = React.useState("");

  // this is search result fetched from yelp.
  // DO NOT modify this data
  const [businesses, setBusinesses] = React.useState(null);

  // business list after applying filters
  const [filterBusinesses, setFilterBusinesses] = React.useState(null);

  const [filterOptions, setFilterOptions] =
    React.useState(defaultFilterOptions);

  const [currentPartnerForm, setCurrentPartnerForm] = React.useState(1); //If at 3, then don't show form
  const [partnerAInfo, setPartnerAInfo] = React.useState({});
  const [partnerBInfo, setPartnerBInfo] = React.useState({});

  // apply filters to saved business list when a filter changed
  React.useEffect(() => {
    const filterResult = applyFilters(businesses);
    setFilterBusinesses(filterResult);
  }, [filterOptions]);

  // triggered when "Search" clicked
  const handleSearch = async () => {
    const averageRadius =
      (parseInt(partnerAInfo.radius) + parseInt(partnerBInfo.radius)) / 2;
    //Combines the prices of both partners, creates unique string ex: 1, 2, 3 => $, $$, $$$ in yelp
    const partnerCombinedPrices = Array.from(
      new Set([partnerAInfo.price, partnerBInfo.price].join(",").split(","))
    ).join(",");
    let queryParams = `location=${partnerAInfo.location}
    &radius=${averageRadius}
    &categories=${partnerAInfo.foodType}
    &categories=${partnerBInfo.foodType}
    &price=${partnerCombinedPrices}
    &sort_by=best_match&limit=20
    `;

    //If forms were not submitted, default the query params
    queryParams = !partnerAInfo.location
      ? queryParams.replace("location=undefined", "location=nyc")
      : queryParams;
    queryParams = !averageRadius
      ? queryParams.replace("&radius=NaN", "")
      : queryParams;
    queryParams = !partnerAInfo.foodType
      ? queryParams.replace("&categories=undefined", "")
      : queryParams;
    queryParams = !partnerBInfo.foodType
      ? queryParams.replace("&categories=undefined", "")
      : queryParams;
    queryParams =
      partnerCombinedPrices === ""
        ? queryParams.replace("&price=", "")
        : queryParams;
    queryParams = queryParams.trim();

    const resp = await searchBussiness(queryParams);

    setBusinesses(resp.businesses);
    // filter and render businesses
    console.log(resp.businesses);
    const filterResult = applyFilters(resp.businesses);
    setFilterBusinesses(filterResult);
  };

  const handleFilterOptionsChange = (option, value) => {
    let updatedFilter = { ...filterOptions };
    updatedFilter[option] = value;
    setFilterOptions(updatedFilter);
  };

  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
    });
  };

  const applyFilters = (businessList) => {
    const result = businessList?.filter((business) => {
      return (
        filterOptions.rating <= business.rating &&
        // TODO: price may not exist
        filterOptions.price.includes(business.price?.length) && // 1 = $, 2 = $$, 3 = $$$, 4 = $$$$ => number == string length
        filterOptions.distance >= business.distance
      );
    });
    return result;
  };

  return (
    <div className="App" style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            border: "1px solid red",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TextField
            size="small"
            variant="standard"
            InputProps={{
              disableUnderline: true,
            }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Divider orientation="vertical" variant="fullWidth" flexItem />
          <TextField
            size="small"
            variant="standard"
            placeholder="location"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton color="primary" onClick={handleCurrentLocation}>
                    {" "}
                    <LocationOnOutlinedIcon />{" "}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <IconButton color="primary" onClick={handleSearch}>
          <SearchOutlinedIcon />
        </IconButton>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div style={{ marginRight: "20px" }}>
          <Filter
            onChange={handleFilterOptionsChange}
            options={filterOptions}
          />
        </div>
        
        {currentPartnerForm <= 2 && (
          <Form
            currentPartnerForm={currentPartnerForm}
            partner={currentPartnerForm === 1 ? partnerAInfo : partnerBInfo}
            setPartnerInfo={ currentPartnerForm === 1 ? setPartnerAInfo : setPartnerBInfo }
            setPartnerForm={setCurrentPartnerForm}
          />
        )}

        <button onClick={handleSearch}>
          Get Restaurant Data (after submissions)
        </button>
        <div>
          {filterBusinesses &&
            filterBusinesses.map((business) => (
              <BusinessCard key={business.id} businessDetails={business} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
