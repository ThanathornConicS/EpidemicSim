const image = "../Assets/mapPin.png";

var circle;

var locationLngLat = [];

function CreateMarker(place)
{
    if(!place.geometry || !place.geometry.location) return;

    locationLngLat.push(new Vec2(place.geometry.location.lng(), place.geometry.location.lat()));

    mapMarker = new google.maps.Marker
    ({
        map,
        draggable: false,
        animation: google.maps.Animation.DROP,
        position: place.geometry.location,
        title: "Search Marker",
        icon: 
        {
            url: image,
            scaledSize: new google.maps.Size(10, 20)
        },
    });
}

async function AddCircle()
{
    circle.setMap(map);
}

function RemoveCircle()
{
    circle.setMap(null);
}