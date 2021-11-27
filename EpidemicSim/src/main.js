const units = 1000;
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
  // Google Map Init
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  placeService = new google.maps.places.PlacesService(map);

  // Create overlay instance
  const overlay = new GoogleMapsOverlay({});
  


  // ----------------Init Loop----------------
var initLoop = window.setInterval(() => 
{ 
  if(searchComplete == placeList.length)    // wait search to complete 
  {   
    manager.Init(units, placeCounter);      // #of unit, #of dest 
    let spawnPos = 0;                       // inf spawn location
    while(manager.m_destList[spawnPos].m_susList.size == 0){
      spawnPos = (spawnPos + 1) % placeCounter;
    }
    manager.SpawnSpot(spawnPos); 
    manager.InitLocation(renderStep); 

    data = JSON.stringify(manager.m_animData);
    console.log(data);
    //props = CreateAnimProperties("trip", dat);
    props = CreateAnimProperties("trip", DATA_URL);

    executeStep = 1;                        // update stage => 1
    clearInterval(initLoop);                
  } 
}, timeStep); 



  // ----------------Logic Loop----------------
var mainLoop = window.setInterval(() =>
{
  if(executeStep >= 1)                      // check stage >= 1
  {                   
    console.time("loop_time")
    manager.MoveUnits();
    manager.UpdateDests();
    manager.UpdateAnimColor();              // get color state of units

    executeStep = 2;                        // update stage => 2
    console.timeEnd("loop_time")

    stepCounter++; /*iterate*/
    if(stepCounter >= loop){ clearInterval(mainLoop); } // end loop
  }
}, timeStep);



// ----------------render Loop----------------
var renderLoop = window.setInterval(() =>
{
  if(executeStep >= 2){
    console.time("render_time")
    currentTime = (currentTime + 10) % LOOP_LENGTH;
    console.log(currentTime);

    const animate = () => 
    {
      const tripsLayer = new TripsLayer({
        ...props,
        currentTime: currentTime,
        getColor: (data) => manager.m_vendorColor[data.vendor],
      });

      overlay.setProps({
        layers: [tripsLayer],
      });
      window.requestAnimationFrame(animate);
    };

    window.requestAnimationFrame(animate);
    overlay.setMap(map);
    
    if(stepCounter >= loop){ clearInterval(renderLoop); } // end loop
    console.timeEnd("render_time")
  }
}, renderStep);



  // ---------------- Mouse Callback ----------------
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
      fillOpacity: 0.1,
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
  for(let i = 0; i < placeList.length; i++)
  { 
    placeService.nearbySearch(CreateSearchRequest({lat, lng}, placeList[i]), SearchNearbyCallback); 
  } 
}