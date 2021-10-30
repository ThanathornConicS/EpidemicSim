const image = "Ahegaopng.png";

function latlngObj(lat, lng)
{
    this.lat = lat;
    this.lng = lng;
}

var locationLatLng = [];

function CreateMarker(place)
{
    if(!place.geometry || !place.geometry.location) return;

    // locationLatLng.push(new latlngObj(place.geometry.location.lat(), place.geometry.location.lng()));
    // console.log(locationLatLng);

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
            scaledSize: new google.maps.Size(80, 80)
        },
    });
}

function AddCircle()
{
    circle.setMap(map);
}

function RemoveCircle()
{
    circle.setMap(null);
}