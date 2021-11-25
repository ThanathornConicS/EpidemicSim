const units = 10;
//const dests = 3;
const loop = 100; 
const timeStep = 1000 // msec
const renderStep = 100 // msec
let stepCounter = 0;
let executeStep = 0;

var currentTime = 0;

var map;
var placeService;

let manager = new Manager();

const placeList = ["resturant", "airport","bus_station" ,"hospital" ,"school" ,"shopping_mall" ]; 

// Create Properties for overlay
let props;
let data = "data.json";

// Main Function
loadScript(GOOGLE_MAPS_API_URL).then(() => 
{
  //Initialize
  console.time("init_map")

  // Google Map Init
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  placeService = new google.maps.places.PlacesService(map);

  // Create overlay instance
  const overlay = new GoogleMapsOverlay({});

  console.timeEnd("init_map")

  //const props = CreateAnimProperties("trip", DATA_URL);

  var unitColor = [];
  
  // Init 
var initLoop = window.setInterval(() => 
{ 
  if(searchComplete == placeList.length){ 
    console.log("Counter: " + placeCounter); 
 
    manager.Init(units, placeCounter);     // #of unit, #of dest 
    manager.SpawnSpot(Math.floor(Math.random() * placeCounter)); 
 
    manager.InitLocation(renderStep); 

    data = JSON.stringify(manager.m_animData);
    console.log(data);

    props = CreateAnimProperties("trip", dat);
    //props = CreateAnimProperties("trip", DATA_URL);
 
    // // checking 
 
    // console.log(manager.m_unitList[0].m_stayDelay + " " + manager.m_unitList[0].m_travDelay); 
 
    // for(let i = 0; i < manager.m_unitList[0].m_anim.datPath.length; i++){ 
    //   console.log(manager.m_unitList[0].m_anim.datPath[i][0] + ", " + manager.m_unitList[0].m_anim.datPath[i][1]); 
    // } 
 
    // for(let i = 0; i < manager.m_unitList[0].m_anim.datTimestamp.length; i++){ 
    //   console.log(manager.m_unitList[0].m_anim.datTimestamp[i]); 
    // } 
    executeStep = 1; 
    clearInterval(initLoop); 
  } 
 
}, timeStep); 

  // Logic Loop
var mainLoop = window.setInterval(() =>
{
  /// call your function here
  if(executeStep >= 1){
    console.time("loop_time")
    manager.MoveUnits();
    manager.UpdateDests();
    
    unitColor = [];

    for(let i = 0; i < manager.m_unitList.length; i++)
    {
      unitColor.push(manager.m_unitList[i].m_state);
    }

    stepCounter++; /*iterate*/
    if(stepCounter >= loop){ clearInterval(mainLoop); }
    
    //console.log("Place Counter: " + placeCounter);

    console.timeEnd("loop_time")

    executeStep = 2;
  }
}, timeStep);

// render Loop
var renderLoop = window.setInterval(() =>
{
  if(executeStep >= 2){
    console.time("render_time")
    //console.log("[renderLoop] Place Counter: " + placeCounter);
    currentTime = (currentTime + 5) % LOOP_LENGTH;
    
    console.log(currentTime);

    const animate = () => 
    {
      const tripsLayer = new TripsLayer({
        ...props,
        currentTime: currentTime,
        getColor: [0, 0, 255],
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
  }
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
    
    Initmanager(lat, lng);

    // console.log(lat + " - " + lng);
    google.maps.event.clearInstanceListeners(map);
  });

});

async function Initmanager(lat, lng)
{
  await AddCircle();

  console.time("init_Sim")

  for(let i = 0; i < placeList.length; i++){ 
    placeService.nearbySearch(CreateSearchRequest({lat, lng}, placeList[i]), SearchNearbyCallback); 
  } 

  // Search
  //placeService.nearbySearch(CreateSearchRequest({lat, lng}, "airport"), SearchNearbyCallback);
  // placeService.nearbySearch(CreateSearchRequest({lat, lng}, "bus_station"), SearchNearbyCallback);
  // placeService.nearbySearch(CreateSearchRequest({lat, lng}, "hospital"), SearchNearbyCallback);
  // placeService.nearbySearch(CreateSearchRequest({lat, lng}, "school"), SearchNearbyCallback);
  // placeService.nearbySearch(CreateSearchRequest({lat, lng}, "shopping_mall"), SearchNearbyCallback);
  //placeService.nearbySearch(CreateSearchRequest({lat, lng}, "resturant"), SearchNearbyCallback);

  // setTimeout(function (){

  //   console.log("Counter: " + placeCounter);
  //   manager.Init(units, placeCounter);     // #of unit, #of dest
  //   manager.SpawnSpot(Math.floor(Math.random() * placeCounter));

  //   manager.InitLocation(renderStep);
    
  //   //let json = JSON.stringify(manager.m_animData);
  //   //props = CreateAnimProperties("trips", dat)

  //   // // checking

  //   // console.log(manager.m_unitList[0].m_stayDelay + " " + manager.m_unitList[0].m_travDelay);

  //   // for(let i = 0; i < manager.m_unitList[0].m_anim.datPath.length; i++){
  //   //   console.log(manager.m_unitList[0].m_anim.datPath[i][0] + ", " + manager.m_unitList[0].m_anim.datPath[i][1]);
  //   // }

  //   // for(let i = 0; i < manager.m_unitList[0].m_anim.datTimestamp.length; i++){
  //   //   console.log(manager.m_unitList[0].m_anim.datTimestamp[i]);
  //   // }
  
  // }, 5000); 

  // executeStep = 1;  

  console.timeEnd("init_Sim")
}