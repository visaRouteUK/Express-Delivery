function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 0, lng: 0 },
    zoom: 2,
    gestureHandling: 'greedy',
  });

  const locationInfoDiv = document.getElementById('location-info');
  const sourceInput = document.getElementById('source');
  const destinationInput = document.getElementById('destination');

  const marker = new google.maps.Marker({
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 5,
      fillColor: '#FF0000',
      fillOpacity: 1,
      strokeWeight: 0,
    },
  });

  let intervalId;
  let speed = 50;
  let sourceCoords;
  let destinationCoords;
  let currentLat;
  let currentLng;
  let isRunning = false;

  function animateMarker(source, destination) {
    const sourceCoords = new google.maps.LatLng(source.lat(), source.lng());
    const destinationCoords = new google.maps.LatLng(destination.lat(), destination.lng());

    const latDiff = (destinationCoords.lat() - sourceCoords.lat()) / 100;
    const lngDiff = (destinationCoords.lng() - sourceCoords.lng()) / 100;

    let i = 0;
    if (currentLat && currentLng) {
      i = Math.round(((currentLat - sourceCoords.lat()) / latDiff));
    }

    intervalId = setInterval(() => {
      const lat = sourceCoords.lat() + i * latDiff;
      const lng = sourceCoords.lng() + i * lngDiff;
      marker.setPosition(new google.maps.LatLng(lat, lng));
      currentLat = lat;
      currentLng = lng;

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: marker.getPosition() }, (results, status) => {
        if (status === 'OK') {
          const city = results[0].address_components.find(component => component.types.includes('locality'))?.long_name;
          const country = results[0].address_components.find(component => component.types.includes('country'))?.long_name;

          locationInfoDiv.innerHTML = `
            <span style="color: green;">Going:</span> ${city}, ${country}<br>
            <span>Coordinates:</span> ${lat.toFixed(4)}, ${lng.toFixed(4)}
          `;
        }
      });

      i++;
      if (i >= 100) {
        clearInterval(intervalId);
        isRunning = false;
        locationInfoDiv.innerHTML = `
          <span style="color: red;">Stopped:</span> <br>
          <span>Coordinates:</span> ${lat.toFixed(4)}, ${lng.toFixed(4)}
        `;
      }
    }, speed);

    isRunning = true;
  }

  function geocodeInput(inputField, callback) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: inputField.value }, (results, status) => {
      if (status === 'OK') {
        callback(results[0].geometry.location);
      } else {
        console.error('Geocoding failed');
      }
    });
  }

  document.getElementById('submit').addEventListener('click', () => {
    geocodeInput(sourceInput, (source) => {
      sourceCoords = source;
      geocodeInput(destinationInput, (destination) => {
        destinationCoords = destination;
        currentLat = null;
        currentLng = null;
        animateMarker(sourceCoords, destinationCoords);
      });
    });
  });

  document.getElementById('speed-down').addEventListener('click', () => {
    speed += 10;
    clearInterval(intervalId);
    if (sourceCoords && destinationCoords) {
      animateMarker(new google.maps.LatLng(currentLat, currentLng), destinationCoords);
    }
  });

  document.getElementById('stop').addEventListener('click', () => {
    clearInterval(intervalId);
    isRunning = false;
    const lat = marker.getPosition().lat();
    const lng = marker.getPosition().lng();
    currentLat = lat;
    currentLng = lng;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: marker.getPosition() }, (results, status) => {
      if (status === 'OK') {
        const city = results[0].address_components.find(component => component.types.includes('locality'))?.long_name;
        const country = results[0].address_components.find(component => component.types.includes('country'))?.long_name;
      }
    });
     locationInfoDiv.innerHTML = `
  <span style="color: red;">Stopped:</span> ${city}, ${country}<br>
  <span>Coordinates:</span> ${lat.toFixed(4)}, ${lng.toFixed(4)}
`;

  })
document.getElementById('start').addEventListener('click', () => {
  if (sourceCoords && destinationCoords) {
    animateMarker(new google.maps.LatLng(currentLat, currentLng), destinationCoords);
  }

});
}
