let currentTime = 0;

var map;
var placeService;

var circle;

// Main Function
loadScript(GOOGLE_MAPS_API_URL).then(() => 
{
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  placeService = new google.maps.places.PlacesService(map);

  // Logic==========================================================
  map.addListener("click", (mapMouseEvent) => 
  {
    // Add Circle Later
    let lat = mapMouseEvent.latLng.lat();
    let lng =  mapMouseEvent.latLng.lng();

    circle = new google.maps.Circle
    ({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      center: {lat: lat, lng: lng},
      radius: 3000,
    });

    AddCircle();

    placeService.nearbySearch(CreateSearchRequest({lat, lng}, "Resturant"), SearchNearbyCallback);

    console.log(lat + " - " + lng);
  });
  // Logic==========================================================

  // Create overlay instance
  const overlay = new GoogleMapsOverlay({});

  // Create Properties for overlay
  const props = CreateAnimProperties("trips", DATA_URL);

  // Render=========================================================
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
  // Render=========================================================
});