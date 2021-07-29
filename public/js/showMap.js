mapboxgl.accessToken = mapboxToken;

if (campground.geometry.coordinates.length > 0) {
	const map = new mapboxgl.Map({
		container: 'map', // container ID
		style: 'mapbox://styles/mapbox/streets-v11', // style URL
		center: campground.geometry.coordinates, // starting position [lng, lat]
		zoom: 10 // starting zoom
	});
	
	// Create a default Marker and add it to the map.
	const marker1 = new mapboxgl.Marker({color: 'red'})
		.setLngLat(campground.geometry.coordinates)
		.setPopup(
			new mapboxgl.Popup({ offset: 30, closeButton: false, anchor: 'bottom' })
				.setHTML(
					`<h5>${campground.title}</h5>
					<p>${campground.location}</p>`
				)
		)
		.addTo(map);
}
