// Set your Google Maps API key here or via environment variable
const GOOGLE_MAPS_API_KEY = "AIzaSyDEQPWQuG15KfetsMZM2jPzrwJyz0vAdAc"; // eslint-disable-line
const GOOGLE_MAP_ID = "5afdd176907dbee8"; // eslint-disable-line
const GOOGLE_MAPS_API_URL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDEQPWQuG15KfetsMZM2jPzrwJyz0vAdAc&libraries=places&map_ids=5afdd176907dbee8&v=beta";

//const DATA_URL = "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf.trips.json";         // DeckGL Test
const DATA_URL = "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/trips-v7.json";    // Google Map Test
const LOOP_LENGTH = 1600;

const dat = 
[
  {
    "vendor": 0,
    "datPath": [
      [-74.20986, 40.81773],
      [-74.20987, 40.81765],
      [-74.20998, 40.81746],
      [-74.21062, 40.81682],
      [-74.21002, 40.81644],
      [-74.21084, 40.81536],
      [-74.21142, 40.8146],
      [-74.20965, 40.81354],
      [-74.21166, 40.81158],
      [-74.21247, 40.81073],
      [-74.21294, 40.81019],
      [-74.21302, 40.81009],
      [-74.21055, 40.80768],
      [-74.20995, 40.80714],
      [-74.20674, 40.80398],
      [-74.20659, 40.80382],
      [-74.20634, 40.80352],
      [-74.20466, 40.80157]],
      "datTimestamps": [ 1191, 1193.803, 1205.321, 1249.883, 1277.923, 1333.85, 1373.257, 1451.769, 1527.939, 1560.114, 1579.966, 1583.555, 1660.904, 1678.797, 1779.882, 1784.858, 1793.853, 1868.948]
  }
]

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
    //widthScale: 2,
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