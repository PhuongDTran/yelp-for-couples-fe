import axios from 'axios';

// read this for temp allowed use it
// https://github.com/Rob--W/cors-anywhere/issues/301
const CORS_PROXY = 'http://54.191.16.189:8081/';
const YELP_ENDPOINT = 'https://api.yelp.com/v3';

// set default headers
axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.REACT_APP_YELP_API_KEY}`;

// example of queryParams: location=nyc&sort_by=best_match
// ref: https://docs.developer.yelp.com/reference/v3_business_search
export const searchBussiness = async (queryParams) => {
  const url = CORS_PROXY + YELP_ENDPOINT + `/businesses/search?${queryParams}`;
  const response = await axios.get(url);
  return response.data;
}

export const getBusinessDetails = async(businessId) => {
  const url = CORS_PROXY + YELP_ENDPOINT + `/businesses/${businessId}`;
  const response = await axios.get(url);
  return response.data;
}
