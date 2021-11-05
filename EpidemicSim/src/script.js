// Set your Google Maps API key here or via environment variable
const GOOGLE_MAPS_API_KEY = "AIzaSyDEQPWQuG15KfetsMZM2jPzrwJyz0vAdAc"; // eslint-disable-line
const GOOGLE_MAP_ID = "5afdd176907dbee8"; // eslint-disable-line
const GOOGLE_MAPS_API_URL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDEQPWQuG15KfetsMZM2jPzrwJyz0vAdAc&libraries=places&map_ids=5afdd176907dbee8&v=beta";

//const DATA_URL = "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf.trips.json";         // DeckGL Test
const DATA_URL = "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/trips-v7.json";    // Google Map Test
const LOOP_LENGTH = 1800;

const VENDOR_COLORS = 
[
  [0, 66, 176],
  [190, 25, 25], // vendor #1
];

const mapOptions = 
{
  center: { lat: 40.72, lng: -74 },   // New York
  //center: { lat: 13.764919202829386, lng: 100.53824571809045},  // Victory Monument
  tilt: 45, 
  zoom: 15,
  mapId: GOOGLE_MAP_ID,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: true,
  fullscreenControl: false
};

function loadScript(url) 
{
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  const head = document.querySelector('head');
  head.appendChild(script);
  return new Promise(resolve => {
    script.onload = resolve;
  });
}

function CreateAnimProperties(idName, data)
{
  var properties = 
  {
    id: idName,
    data: data,
    currentTime,
    /* props from TripsLayer class */
    fadeTrail: true,
    getTimestamps: (data) => data.timestamps,
    trailLength: 20,
    
    /* props inherited from PathLayer class */
    
    // billboard: false,
    capRounded: true,
    //getColor:  (data) => VENDOR_COLORS[data.vendor],
    getPath: (data) => data.path,
    // getWidth: 1,
    jointRounded: true,
    // miterLimit: 4,
    // widthMaxPixels: Number.MAX_SAFE_INTEGER,
    widthMinPixels: 4,
    // widthScale: 1,
    // widthUnits: 'meters',
    
    /* props inherited from Layer class */
    
    // autoHighlight: false,
    // coordinateOrigin: [0, 0, 0],
    // coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    // highlightColor: [0, 0, 128, 128],
    // modelMatrix: null,
    opacity: 1,
    // pickable: false,
    // visible: true,
    // wrapLongitude: false,
    shadowEnabled: true,
  }

  return properties;
}


// function SearchPalace()
// {
//   placeService.nearbySearch(CreateSearchRequest({lat, lng}, "airport"), SearchNearbyCallback);
//   placeService.nearbySearch(CreateSearchRequest({lat, lng}, "bus_station"), SearchNearbyCallback);
//   placeService.nearbySearch(CreateSearchRequest({lat, lng}, "hospital"), SearchNearbyCallback);
//   placeService.nearbySearch(CreateSearchRequest({lat, lng}, "school"), SearchNearbyCallback);
//   placeService.nearbySearch(CreateSearchRequest({lat, lng}, "shopping_mall"), SearchNearbyCallback);
//   placeService.nearbySearch(CreateSearchRequest({lat, lng}, "resturant"), SearchNearbyCallback);
// }