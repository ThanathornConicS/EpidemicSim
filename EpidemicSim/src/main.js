// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const AIR_PORTS =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';

// Set your Google Maps API key here or via environment variable
const GOOGLE_MAPS_API_KEY = "AIzaSyDEQPWQuG15KfetsMZM2jPzrwJyz0vAdAc"; // eslint-disable-line
const GOOGLE_MAP_ID = "5afdd176907dbee8"; // eslint-disable-line
const GOOGLE_MAPS_API_URL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDEQPWQuG15KfetsMZM2jPzrwJyz0vAdAc&map_ids=5afdd176907dbee8&v=beta";

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

loadScript(GOOGLE_MAPS_API_URL).then(() => 
{
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 51.47, lng: 0.45},
    zoom: 5,
    mapId: GOOGLE_MAP_ID
  });

  // Create overlay instance
  const overlay = new GoogleMapsOverlay
  ({
      layers: []
  });

  // Add overlay to map
  overlay.setMap(map);
});