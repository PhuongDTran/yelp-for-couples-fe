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
import { get } from "mongoose";

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
    document.getElementById("showRestaurants").style.display = "none";
    document.getElementById("randomRestaurantButton").style.display = "block";
  };


  const handleFilterOptionsChange = (option, value) => {
    let updatedFilter = { ...filterOptions };
    updatedFilter[option] = value;
    setFilterOptions(updatedFilter);
  };

  /*
  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
    });
  };
  */

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

  function getRandomVenue() {
    let listOfUnselected = document.getElementsByClassName("unselected");
    let listOfSelected = document.getElementsByClassName("selected");
    let selected = true;

    let randomValue = Math.floor(Math.random() * listOfSelected.length);

    if (listOfSelected.length == 0) {
      randomValue = Math.floor(Math.random() * listOfUnselected.length);
      selected = false;
    }

    for (let index = 0; index < listOfUnselected.length; index++) {
      if (!selected && index == randomValue) {
        listOfUnselected[index].classList.add("selected");
        listOfUnselected[index].classList.remove("unselected");
        index--;
        randomValue = null;
        continue;
      }
      listOfUnselected[index].style.display = "none";
    }

    if (selected) {
      for (let index = 0; index < listOfSelected.length; index++) {
        if (index == randomValue) {
          continue;
        }
        listOfSelected[index].style.display = "none";
      }
    }

    document.getElementById("Unsort").style.display = "block";
    document.getElementById("Sort").style.display = "none";
  }

  function undoRandomVenue(){
    let listOfVenues = document.getElementsByClassName('business');

    for (let index = 0; index < listOfVenues.length; index++) {
      listOfVenues[index].style.display = "block";
    }
    document.getElementById("Unsort").style.display = "none";
    document.getElementById("Sort").style.display = "block";
  }

  return (
    <div className="App" style={{backgroundColor:"#555", display: "flex", flexDirection: "column" }}>
        <div id="randomRestaurantButton">
          <div id="Sort" className="tabcontent">
            <h1>List of resturants that fit your search</h1>
          </div>

          <div id="Unsort" className="tabcontent">
            <h1>One randomly selected option</h1>
          </div>

          <button className="tablink" onClick={getRandomVenue} id="defaultOpen">Select Random Venue</button>
          <button className="tablink" onClick={undoRandomVenue}>Undo Selection</button>
        </div>
        <div className="MainBody">
        <div className="sideFilters" >
          <Filter
            onChange={handleFilterOptionsChange}
            options={filterOptions}
          />
        </div>
        <div className="formDisplay">
        {currentPartnerForm <= 2 && (
          <Form
            currentPartnerForm={currentPartnerForm}
            partner={currentPartnerForm === 1 ? partnerAInfo : partnerBInfo}
            setPartnerInfo={currentPartnerForm === 1 ? setPartnerAInfo : setPartnerBInfo}
            setPartnerForm={setCurrentPartnerForm}
          />
        )}{
          currentPartnerForm === 3 && (
            <button id="showRestaurants" onClick={handleSearch} display="none">
              Get Restaurant Data
            </button>
          )
        }
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
