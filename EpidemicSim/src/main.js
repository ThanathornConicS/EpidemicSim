
let mapMarker;
let placeService;

const units = 100;
const dests = 10;
const maxdest = 3;
const maxTime = 5;

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

    console.time("init_time")

    let manager = new Manager();

    for(let i = 0; i < dests; i++){
        manager.m_destList.push(Dest);
    }

    for(let i = 0; i < units; i++){
        manager.m_unitList.push(new Unit(Math.floor(Math.random()* maxTime) + 1, Math.floor(Math.random()* maxTime) + 1));
        manager.m_unitList[i].InitDest(manager.m_destList.length, maxdest);
    }

    console.timeEnd("init_time")


    for(let i = 0; i < manager.m_unitList.length; i++){
        document.write(manager.m_unitList[i].m_dest[0] + " " + manager.m_unitList[i].m_dest[1] + " " + manager.m_unitList[i].m_dest[2]);
        document.write("<br>");
        document.write("stay: " + manager.m_unitList[i].m_stayDelay + " trav:  " + manager.m_unitList[i].m_travDelay);
        document.write("<br>");
        document.write("<br>");
    }

    while(true){
        
        for(let i = 0; i < manager.m_unitList.length; i++){
            manager.m_unitList[i].Update();
        }

    }

    
    
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