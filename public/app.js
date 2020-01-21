let lat, lon, weather, weather_location, airQuality;
const timezone_span = document.getElementById('timezone') 
      temp_span = document.getElementById('temperature') 
      summ_span = document.getElementById('summary');

  if('geolocation' in navigator) {
    console.log('geolocation available');

    navigator.geolocation.getCurrentPosition(
      async position => {
        
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        
        document.getElementById('latitude').textContent = lat.toFixed(2);
        document.getElementById('longitude').textContent = lon.toFixed(2);
        const weather_url = `/weather/${lat},${lon}`;
        const weather_response = await fetch(weather_url);
        const weather_data = await weather_response.json();
        console.log(weather_data);
        weather = weather_data.weather.currently;
        weather_location = weather_data.weather.timezone;
        const timezone_array = weather_data.weather.timezone.split('/');
        // console.log(timezone_array);
        timezone_span.textContent = timezone_array[1].replace("_"," ");
        summ_span.textContent = weather.summary;
        temp_span.textContent = weather.temperature;
        
        try {
        // 3.2 
        airQuality = weather_data.air_quality.results[0].measurements[0];
        document.getElementById('aq_pm').textContent = airQuality.parameter;
        document.getElementById('aq_value').textContent = airQuality.value;
        document.getElementById('aq_unit').textContent = airQuality.unit;
        document.getElementById('aq_date').textContent = airQuality.lastUpdated;
        } catch {
          document.getElementById('airQ-container').textContent = "There's no air quality reading for this location";
        }

        // 3.3 Mapping Database Entries with Leaflet.js

        const data_save = {lat, lon, weather_location, weather, airQuality};
        // const location = {lat , lon};
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data_save)
        };
            
        const db_response = await fetch('/api', options);
        const data_response = await db_response.json();
        // console.log(data_response);

      });

  } else {
    console.log('Activate the Geolocation');
  }
