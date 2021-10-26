// Set your Google Maps API key here or via environment variable
const GOOGLE_MAPS_API_KEY = "AIzaSyDEQPWQuG15KfetsMZM2jPzrwJyz0vAdAc"; // eslint-disable-line
const GOOGLE_MAP_ID = "5afdd176907dbee8"; // eslint-disable-line
const GOOGLE_MAPS_API_URL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDEQPWQuG15KfetsMZM2jPzrwJyz0vAdAc&map_ids=5afdd176907dbee8&v=beta";

//const DATA_URL = "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf.trips.json";         // DeckGL Test
const DATA_URL = "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/trips-v7.json";    // Google Map Test
const LOOP_LENGTH = 1800;

const VENDOR_COLORS = 
[
  [0, 66, 176],
  [190, 25, 25], // vendor #1
];

function loadScript(url) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  const head = document.querySelector('head');
  head.appendChild(script);
  return new Promise(resolve => {
    script.onload = resolve;
  });
}