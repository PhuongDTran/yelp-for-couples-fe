export const MAX_RADIUS = 40000; // in meters, max radius allowed to use for yelp apis

export const convertMilesToMeters = (distanceInMiles) => {
  return Number(distanceInMiles) * 1609.34;
}

export const convertMetersToMiles = (distanceInMeters) => {
  return Math.round(Number(distanceInMeters) / 1609.34);
}