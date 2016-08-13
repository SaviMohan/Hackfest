function test() {
	console.log(typeof city_name);
}

function initMap() {
	// Display the route between the initial start and end selections.
	calculateAndDisplayRoute();

	// Listen to change events from the start and end lists.
	var onChangeHandler = function() {
		calculateAndDisplayRoute();
	};
	document.getElementById('start').addEventListener('change', onChangeHandler);
	document.getElementById('end').addEventListener('change', onChangeHandler);
}

function calculateAndDisplayRoute() {
    // First, remove any existing markers from the map
    markers[0].setMap(null);

	// Retrieve the start and end locations and create a DirectionsRequest using WALKING directions.
	directionsService.route({
		origin: xmlhttp,
		destination: document.getElementById('end').value,
		travelMode: 'WALKING'
	}, function(response, status) {
		// Route the directions and pass the response to a function to create
		// markers for each step.
		if (status === 'OK') {
			document.getElementById('warnings-panel').innerHTML = '<b>' + response.routes[0].warnings + '</b>';
			directionsDisplay.setDirections(response);
			showSteps();
			} else {
			window.alert('Directions request failed due to ' + status);
		}
	});
}

function showSteps() {
	// For each step, place a marker, and add the text to the marker's infowindow.
	// Also attach the marker to an array so we can keep track of it and remove it when calculating new routes.
	var myRoute = directionResult.routes[0].legs[0];
	for (var i = 0; i < myRoute.steps.length; i++) {
		var marker = markers[i] = markers[i] || new google.maps.Marker();
		marker.setMap(map);
		marker.setPosition(myRoute.steps[i].start_location);
		attachInstructionText(myRoute.steps[i].instructions);
	}
}

function attachInstructionText(text) {
	google.maps.event.addListener(marker, 'click', function() {
		// Open an info window when the marker is clicked on, containing the text of the step.
		stepDisplay.setContent(text);
		stepDisplay.open(map, marker);
	});
}
