const units = 20;
//const dests = 3;
const totalDays = 7;
const perDay = 24; 
const timeStep = 1000 ;// msec
const loop = perDay * totalDays;
// const renderStep = 100 // msec

// let stepCounter = 0;
// let executeStep = 0;
// var currentTime = 0;

var map;
var placeService;

let manager = new Manager();
const placeList = ["resturant"/*, "airport","bus_station" ,"hospital" ,"school" ,"shopping_mall" */]; 

// Create Properties for overlay
let props;

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
      manager.InitLocation(); 

      // need change 
      let infdata = JSON.stringify(manager.m_infAnimData);
      let data = JSON.stringify(manager.m_animData);  
      

      console.log(data);
      console.log(infdata);

      console.log(manager.m_animData);
      console.log(manager.m_infAnimData);

      //props = CreateAnimProperties("trip", dat);
      susProps = CreateAnimProperties("sus", DATA_URL);
      infProps = CreateAnimProperties("inf", DATA_URL);

      console.log("FINISH DATA");

      // ----------------Logic Loop----------------
      
      for(let day = 0; day < totalDays; day++){
        for(let hour = 0; hour < perDay; hour++)                    
        {  
          console.log("LOGIC");                 
          //console.time("loop_time")
          manager.MoveUnits(hour, day);
          manager.UpdateDests();
        
          /* function to collect infect population / timestep */
          /* function to collect color */
          //manager.UpdateAnimColor();

          //console.timeEnd("loop_time")
        }
      }

      // ----------------render Loop----------------
      for(let i = 0; i < loop; i++)   
      {
        console.log("DRAW");
        //console.time("render_time")
        //currentTime = (currentTime + 1) % loop;
        //console.log(currentTime);
    
        const animate = () => 
        {
          const susLayer = new TripsLayer({
            ...susProps,
            currentTime: i,
            // getColor: (data) => manager.m_vendorColor[data.vendor],
            getColor: [0, 66, 176],
          });

          const infLayer = new TripsLayer({
            ...infProps,
            currentTime: i,
            // getColor: (data) => manager.m_vendorColor[data.vendor],
            getColor: [190, 25, 25],
          });
    
          overlay.setProps({
            layers: [susLayer, infLayer],
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