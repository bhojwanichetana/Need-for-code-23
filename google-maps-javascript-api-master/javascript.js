var lat, long, count=0;
let data =[];

function initialize() {
	
	var mapOptions, map, marker, searchBox, city,
		infoWindow = '',
		addressEl = document.querySelector( '#map-search' ),
		latEl = document.querySelector( '.latitude' ),
		longEl = document.querySelector( '.longitude' ),
		element = document.getElementById( 'map-canvas' );
		city = document.querySelector( '.reg-input-city' );

	mapOptions = {
		// How far the maps zooms in.
		zoom: 13,
		// Current Lat and Long position of the pin/
		center: new google.maps.LatLng( 19.0760, 72.8777 ),
		// center : {
		// 	lat: -34.397,
		// 	lng: 150.644
		// },
		disableDefaultUI: false, // Disables the controls like zoom control on the map if set to true
		scrollWheel: true, // If set to false disables the scrolling on the map.
		draggable: true, // If set to false , you cannot move the map around.
		// mapTypeId: google.maps.MapTypeId.HYBRID, // If set to HYBRID its between sat and ROADMAP, Can be set to SATELLITE as well.
		// maxZoom: 11, // Wont allow you to zoom more than this
		// minZoom: 9  // Wont allow you to go more up.

	};

	/**
	 * Creates the map using google function google.maps.Map() by passing the id of canvas and
	 * mapOptions object that we just created above as its parameters.
	 *
	 */
	// Create an object map with the constructor function Map()
	map = new google.maps.Map( element, mapOptions ); // Till this like of code it loads up the map.

	/**
	 * Creates the marker on the map
	 *
	 */
	marker = new google.maps.Marker({
		position: mapOptions.center,
		map: map,
		// icon: 'http://pngimages.net/sites/default/files/google-maps-png-image-70164.png',
		draggable: true
	});

	

	
	
	/**
	 * Finds the new position of the marker when the marker is dragged.
	 */
	google.maps.event.addListener( marker, "dragend", function ( event ) {
		

		console.log( 'i am dragged' );
		lat = marker.getPosition().lat();
		long = marker.getPosition().lng();
		console.log(lat+" "+long);
		storeData(lat,long);

		var geocoder = new google.maps.Geocoder();
		geocoder.geocode( { latLng: marker.getPosition() }, function ( result, status ) {
			if ( 'OK' === status ) {  // This line can also be written like if ( status == google.maps.GeocoderStatus.OK ) {
				address = result[0].formatted_address;
				resultArray =  result[0].address_components;

				// Get the city and set the city input value to the one selected
				for( var i = 0; i < resultArray.length; i++ ) {
					if ( resultArray[ i ].types[0] && 'administrative_area_level_2' === resultArray[ i ].types[0] ) {
						citi = resultArray[ i ].long_name;
						console.log( citi );
						city.value = citi;
					}
				}
				addressEl.value = address;
				latEl.value = lat;
				longEl.value = long;

			} else {
				console.log( 'Geocode was not successful for the following reason: ' + status );
			}

			// Closes the previous info window if it already exists
			if ( infoWindow ) {
				infoWindow.close();
			}

			/**
			 * Creates the info Window at the top of the marker
			 */
			
		} );
	});


}
document.getElementById("savelocation").addEventListener("click", saveLocation);
document.getElementById("uploadimages").addEventListener("click", uploadImage);


function storeData(a,b){
	lat = a;
	long = b;
}
function saveLocation(){
	console.log("location saved")
	console.log(lat+" "+long)
	datatemp = {key:count,lat:lat,long:long};
	data.push(datatemp)
	console.log(data)
	count++

}

function uploadImage(){
	console.log("image uploaded")
}