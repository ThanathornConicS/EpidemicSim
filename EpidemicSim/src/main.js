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
const placeList = ["resturant"/*, "airport","bus_station" ,"hospital" ,"school" ,"shopping_mall" */]; 

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
  


  
  var executeLoop = window.setInterval(() => 
  { 
    if(searchComplete == placeList.length)    // wait search to complete 
    {   
      clearInterval(executeLoop);             // clear interval


      // ----------------Init Loop----------------
      manager.Init(units, placeCounter);      // #of unit, #of dest 
      let spawnPos = 0;                       // inf spawn location

      // hotfix: empty init location 
      while(manager.m_destList[spawnPos].m_susList.size == 0){
        spawnPos = (spawnPos + 1) % placeCounter;
      }

      
      manager.SpawnSpot(spawnPos); 
      
      // need change 
      manager.InitLocation(renderStep); 

      // need change 
      data = JSON.stringify(manager.m_animData);  
      console.log(data);
      //props = CreateAnimProperties("trip", dat);
      props = CreateAnimProperties("trip", DATA_URL);

      

      // ----------------Logic Loop----------------
      for(let i = 0; i < loop; i++)                    
      {                   
        //console.time("loop_time")
        manager.MoveUnits();
        manager.UpdateDests();
      
        /* function to collect infect population / timestep */
        /* function to collect color */
        //manager.UpdateAnimColor();

        //console.timeEnd("loop_time")
      }



      // ----------------render Loop----------------
      for(let i = 0; i < loop; i++)   
      {
        //console.time("render_time")
        currentTime = (currentTime + 5) % LOOP_LENGTH;
        console.log(currentTime);
    
        const animate = () => 
        {
          const tripsLayer = new TripsLayer({
            ...props,
            currentTime: currentTime,
            // getColor: (data) => manager.m_vendorColor[data.vendor],
            getColor: [0,0,255],
          });
    
          overlay.setProps({
            layers: [tripsLayer],
          });
          window.requestAnimationFrame(animate);
        };
    
        window.requestAnimationFrame(animate);
        overlay.setMap(map);
      }
    } 
  }, timeStep); 



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