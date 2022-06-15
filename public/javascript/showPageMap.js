
// mapboxgl.accessToken=mapToken;





mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center:campground.geometry.coordinates,
// center: [-119.571615, 37.737363], // starting position [lng, lat]   -119.571615, 37.737363
zoom: 8// starting zoom
});
new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(
        `<h3>${campground.title}</h3><p>${campground.location}</p>`
    )
)
.addTo(map)