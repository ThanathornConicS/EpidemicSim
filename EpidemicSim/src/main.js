let currentTime = 0;

loadScript(GOOGLE_MAPS_API_URL).then(() => 
{
  const map = new google.maps.Map(document.getElementById('map'), 
  {
    center: { lat: 40.72, lng: -74 },   // Victory Monument
    tilt: 45, 
    zoom: 15,
    mapId: GOOGLE_MAP_ID,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: true,
    fullscreenControl: false
  });

  // Create overlay instance
  const overlay = new GoogleMapsOverlay({});

  const props = 
  {
    id: "TripsLayer",
    data: DATA_URL,
    currentTime,
    /* props from TripsLayer class */
    fadeTrail: true,
    getTimestamps: (d) => d.timestamps,
    trailLength: 20,
    
    /* props inherited from PathLayer class */
    
    // billboard: false,
    capRounded: true,
    getColor: (d) => VENDOR_COLORS[d.vendor],
    getPath: (d) => d.path,
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
    shadowEnabled: false,
  }

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