const units = 10;
const dests = 3;
const loop = 10; 
const timeStep = 1000 // msec
const renderStep = 100 // msec
let stepCounter = 0;

let currentTime = 0;

var map;
var placeService;

var circle;

// Main Function
loadScript(GOOGLE_MAPS_API_URL).then(() => 
{
  //Initialize
  console.time("init_time")

  // Google Map Init
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  placeService = new google.maps.places.PlacesService(map);

  // Create overlay instance
  const overlay = new GoogleMapsOverlay({});

  let manager = new Manager();
  manager.Init(units, dests);
  manager.SpawnSpot(Math.floor(Math.random() * dests));

  manager.InitLocation(renderStep);

  // console.timeEnd("init_time")

  // document.write("-------------Location_list-------------<br>");
  // for(let i = 0; i < manager.m_destList.length; i++){
  //     document.write("Destination" + i + ": ");
  //     manager.m_destList[i].m_position.Write()
  //     document.write("<br>");
  // }

  // document.write("<br>");
  // document.write("---------------Sample_0---------------<br>");
  // document.write("travDelay : " +  manager.m_unitList[0].m_travDelay + "<br>");
  // document.write("Dest_Path : ");
  // for(let i = 0; i < manager.m_unitList[0].m_destPath.length; i++){
  //     document.write(manager.m_unitList[0].m_destPath[i] + " ");
  // }
  // document.write("<br><br>");

  // document.write("------------------Step------------------<br>");
      
  // for(let i = 0; i < manager.m_unitList[0].m_pathStep.length; i++){
  //     document.write("Path" + i + ": ");
  //     for(let j = 0; j < manager.m_unitList[0].m_pathStep[i].length; j++){
  //         manager.m_unitList[0].m_pathStep[i][j].Write();
  //         document.write(" ");
  //     }
  //     document.write("<br>");
  // }

  // Create Properties for overlay
  const props = CreateAnimProperties("trips", DATA_URL);

  // Logic Loop
  var mainLoop = window.setInterval(() =>
  {
    /// call your function here
    console.time("loop_time")
    manager.MoveUnits();
    manager.UpdateDests();

    stepCounter++; /*iterate*/
    if(stepCounter >= loop){ clearInterval(mainLoop); }
    
    console.timeEnd("loop_time")
  }, timeStep);

  // render Loop
  var renderLoop = window.setInterval(() =>
  {
    console.time("render_time")

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
    
    if(stepCounter >= loop){ clearInterval(renderLoop); }
    console.timeEnd("render_time")
  }, renderStep);

  map.addListener("click", (mouseEvent) => 
  {
    // Add Circle Later
    let lat = mouseEvent.latLng.lat();
    let lng =  mouseEvent.latLng.lng();

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

});