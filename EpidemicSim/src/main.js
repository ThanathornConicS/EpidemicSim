
let mapMarker;
let placeService;

const units = 10;
const dests = 3;
const loop = 10; 
const timeStep = 1000 // msec

let disablePlaces = true;

const latLng = 
[
    { lat: 13.760908340064168, lng: 100.50323524044852 },
    { lat: 13.796141420615395, lng: 100.5179707956749},
    { lat: 13.773579874674216, lng: 100.51335956111564},
    { lat: 13.765024187194893, lng: 100.53825408115135},
];
const image = "Ahegaopng.png";

var mapOptions = 
{
    center: latLng[0],
    // Zoom range: 0-22
    zoom: 12,
    mapId: "5afdd176907dbee8",
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
};
var placeRequest = 
{
    location: latLng[0],
    radius: 1000,
    type: ["resturant"],
};

function InitMap()
{
    //map = new google.maps.Map(document.getElementById('map'), mapOptions);

    if(disablePlaces === false)
    {
        placeService = new google.maps.places.PlacesService(map);
        placeService.nearbySearch(placeRequest, SearchNearbyCallback);
    }

    //map.setCenter(latLng[0]);


    // test Init
    console.time("init_time")
    let manager = new Manager();
    manager.Init(units, dests);
    manager.SpawnSpot(Math.floor(Math.random() * dests));
    console.timeEnd("init_time")

    let i = 0;

    // test Loop

    var mainLoop = window.setInterval(function(){
        /// call your function here
        console.time("loop_time")
        manager.MoveUnits();
        manager.UpdateDests();

        // checking

        document.write("**********LOOP:" + i + "**********<br>");
        for(let j = 0; j < manager.m_destList.length; j++){
            document.write("Destination" + j + ": ");
            document.write("<br>");
            
            // sus
            document.write("sus_list: ");
            for(let [key, value] of manager.m_destList[j].m_susList){
                document.write(manager.m_destList[j].m_susList.get(value) + " ");
            }
            document.write("<br>");
            // inf
            document.write("inf_list: ");
            for(let [key, value] of manager.m_destList[j].m_infList){
                document.write(manager.m_destList[j].m_infList.get(value) + " ");
            }
            document.write("<br>");
            document.write("<br>");
        }

        document.write("Traveling: <br>");
        document.write("sus_list: ");
        for(let j = 0; j < manager.m_unitList.length; j++){
            if(manager.m_unitList[j].m_onTrav && !manager.m_unitList[j].m_state){document.write(j + " ");}
        }
        document.write("<br>");
        document.write("inf_list: ");
        for(let j = 0; j < manager.m_unitList.length; j++){
            if(manager.m_unitList[j].m_onTrav && manager.m_unitList[j].m_state){document.write(j + " ");}
        }
        document.write("<br>");
        document.write("<br>");
        if(i >= loop){ clearInterval(mainLoop); }
        else{ i++; /*iterate*/ }
        
        console.timeEnd("loop_time")
      }, timeStep);
    
}

function CreateMarker(place)
{
    if(!place.geometry || !place.geometry.location) return;

    mapMarker = new google.maps.Marker
    ({
        map,
        draggable: false,
        animation: google.maps.Animation.DROP,
        position: place.geometry.location,
        title: "AHEGAO",
        icon: 
        {
            url: image,
            scaledSize: new google.maps.Size(80, 80)
        },
    });

    mapMarker.addListener("click", ToggleBounce);

}

function ToggleBounce()
{
    if(mapMarker.getAnimation() !== null)
        mapMarker.setAnimation(null);
    else
        mapMarker.setAnimation(google.maps.Animation.BOUNCE);
}

function SearchNearbyCallback(results, status)
{
    if (status == google.maps.places.PlacesServiceStatus.OK) 
    {
        for (var i = 0; i < results.length; i++) 
        {
          CreateMarker(results[i]);
        }
    }
}