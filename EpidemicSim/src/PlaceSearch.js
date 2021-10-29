function CreateSearchRequest(placeToSearch)
{
    var searchOption = 
    {
        location: { lat: 40.72, lng: -74 },     // Fized Center for now
        radius: 3000,
        type: [placeToSearch],
    };

    return searchOption;
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