let currentTime = 0;

// Main Function
loadScript(GOOGLE_MAPS_API_URL).then(() => 
{
  const map = new google.maps.Map(document.getElementById('map'), mapOptions);

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