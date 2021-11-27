// Set your Google Maps API key here or via environment variable
const GOOGLE_MAPS_API_KEY = "AIzaSyDEQPWQuG15KfetsMZM2jPzrwJyz0vAdAc"; // eslint-disable-line
const GOOGLE_MAP_ID = "5afdd176907dbee8"; // eslint-disable-line
const GOOGLE_MAPS_API_URL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDEQPWQuG15KfetsMZM2jPzrwJyz0vAdAc&libraries=places&map_ids=5afdd176907dbee8&v=beta";

//const DATA_URL = "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf.trips.json";               // DeckGL Test
//const DATA_URL = "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/trips-v7.json";          // Google Map Test
const DATA_URL = "https://raw.githubusercontent.com/ThanathornConicS/EpidemicSim/develop/EpidemicSim/src/data.json"   // Our Test
const LOOP_LENGTH = 5900;

const dat = 
[
  {
    "vendor": 0, 
    "datPath":[
      ["-73.9928307","40.7132864"],
      ["-73.9959457","40.717396"],
      ["-73.9959457","40.717396"],
      ["-73.9959457","40.717396"],
      ["-73.9959457","40.717396"],
      ["-73.9928307","40.7132864"]],
    "datTimestamps":[100,300,500,700,900,1100]
  },
  {
    "vendor": 1, 
    "datPath":[
      ["-73.9951985","40.7184456"],
      ["-74.0043767",'40.7206786'],
      ["-74.0043767","40.7206786"],
      ["-74.00491629999999","40.7191799"],
      ["-74.00491629999999","40.7191799"],["-73.9951985","40.7184456"]],
    "datTimestamps":[0,200,200,400,400,600]
  },
  {
    "vendor": 2, 
    "datPath":[
      ["-74.0043767","40.7206786"],
      ["-74.00007339999999","40.71981419999999"],
      ["-74.00007339999999","40.71981419999999"],
      ["-73.997417","40.7230126"],
      ["-73.997417","40.7230126"],
      ["-74.0043767","40.7206786"]],
    "datTimestamps":[100,200,500,600,900,1000]
  },
]

const VENDOR_COLORS = 
[
  [0, 66, 176],
  [190, 25, 25], // vendor #1
  [25, 190, 25], //checking
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
    currentTime: 0,
    /* props from TripsLayer class */
    fadeTrail: true,
    //getTimestamps: (data) => data.timestamps,
    getTimestamps: (data) => data.datTimestamps,
    trailLength: 40,
    
    /* props inherited from PathLayer class */
    
    // billboard: false,
    capRounded: true,
    //getColor:  (data) => VENDOR_COLORS[data.vendor],
    //getPath: (data) => data.path,
    getPath: (data) => data.datPath,
    // getWidth: 1,
    jointRounded: true,
    // miterLimit: 4,
    // widthMaxPixels: Number.MAX_SAFE_INTEGER,
    widthMinPixels: 6,
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
    //shadowEnabled: true,
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