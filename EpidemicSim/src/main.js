let currentTime = 0;

var map;
var placeService

// Main Function
loadScript(GOOGLE_MAPS_API_URL).then(() => 
{
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  placeService = new google.maps.places.PlacesService(map);

  placeService.nearbySearch(CreateSearchRequest("Resturant"), SearchNearbyCallback);

  // Logic==========================================================
  map.addListener("click", (mapMouseEvent) => 
  {
    // Add Circle Later
    console.log(mapMouseEvent.latLng.lat() + " - " + mapMouseEvent.latLng.lng());
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