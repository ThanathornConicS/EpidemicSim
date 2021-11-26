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
    "datPath":[
      ["-73.9951985","40.7184456"],
      ["-74.0043767",'40.7206786'],
      ["-74.0043767","40.7206786"],
      ["-74.00491629999999","40.7191799"],
      ["-74.00491629999999","40.7191799"],["-73.9951985","40.7184456"]],
    "datTimestamps":[0,200,200,400,400,600]
  },
  {
    "datPath":[
      ["-74.0043767","40.7206786"],
      ["-74.00007339999999","40.71981419999999"],
      ["-74.00007339999999","40.71981419999999"],
      ["-73.997417","40.7230126"],
      ["-73.997417","40.7230126"],
      ["-74.0043767","40.7206786"]],
    "datTimestamps":[100,200,500,600,900,1000]
  },
  {
    "datPath":[
      ["-74.0043767","40.7206786"],
      ["-73.9936795","40.7219874"],
      ["-73.9936795","40.7219874"],
      ["-73.99535390000001","40.7206308"],
      ["-73.99535390000001","40.7206308"],
      ["-74.0043767","40.7206786"]],
      "datTimestamps":[0,100,200,300,400,500]
    },
    {
      "datPath":[
        ["-73.9993752","40.71520940000001"],
        ["-73.9936795","40.7219874"],
        ["-73.9936795","40.7219874"],
        ["-73.99535390000001","40.7206308"],
        ["-73.99535390000001","40.7206308"],
        ["-73.9993752","40.71520940000001"]],
      "datTimestamps":[100,300,500,700,900,1100]
    }
]

// const dat = 
// [
//   {
//     "datPath": [
//       [-74.0059728,40.7127753],
//       [-74.00531076499999,40.713196679999996],
//       [-74.00464873,40.71361806],
//       [-74.003986695,40.71403944],
//       [-74.00332466,40.71446082],
//       [-74.002662625,40.7148822],
//       [-74.00200059,40.71530358],
//       [-74.00133855499999,40.71572496]],
//       "datTimestamps": [ 0,10.9999999999999,20,30,40,50,60,70]
//   },
//   {
//     "datPath": [
//       [-74.00475441999998,40.71962951],
//       [-74.00470046,40.71977938],
//       [-74.00464649999999,40.71992925],
//       [-74.00459253999999,40.72007912],
//       [-74.00453858,40.720228989999995]],
//       "datTimestamps": [ 0,10.9999999999999,20,30,40]
//   }
// ]

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