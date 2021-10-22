// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const AIR_PORTS =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';

// Set your Google Maps API key here or via environment variable
const GOOGLE_MAPS_API_KEY = "AIzaSyDEQPWQuG15KfetsMZM2jPzrwJyz0vAdAc"; // eslint-disable-line
const GOOGLE_MAP_ID = "5afdd176907dbee8"; // eslint-disable-line
const GOOGLE_MAPS_API_URL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDEQPWQuG15KfetsMZM2jPzrwJyz0vAdAc&map_ids=5afdd176907dbee8&v=beta";

const DATA_URL = "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf.trips.json";
const LOOP_LENGTH = 1800;

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
    center: { lat: 37.77605537998559, lng: -122.41466001900622 },
    tilt: 45,
    zoom: 15,
    mapId: GOOGLE_MAP_ID
  });

  // Create overlay instance
  const overlay = new GoogleMapsOverlay({});

  const props = 
    {
      id: "TripsLayer",
      data: DATA_URL,
      /* props from TripsLayer class */
      fadeTrail: true,
      getTimestamps: d => d.waypoints.map(p => p.timestamp - 1554772579000),
      trailLength: 50,
      
      /* props inherited from PathLayer class */
      
      // billboard: false,
      capRounded: true,
      getColor: [255, 0, 255],
      getPath: d => d.waypoints.map(p => p.coordinates),
      // getWidth: 1,
      jointRounded: true,
      // miterLimit: 4,
      rounded: true,
      // widthMaxPixels: Number.MAX_SAFE_INTEGER,
      widthMinPixels: 8,
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
    }

  let currentTime = 0;

  const animate = () => 
  {
    currentTime = (currentTime + 1) % LOOP_LENGTH;

    const tripsLayer = new TripsLayer({
      ...props,
      currentTime,
    });

    overlay.setProps({
      layers: [tripsLayer],
    });
    window.requestAnimationFrame(animate);
  };

  window.requestAnimationFrame(animate);
  overlay.setMap(map);
});