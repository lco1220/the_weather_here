// Making map and tiles
const mymap = L.map('checkInMap').setView([0, 0], 1);
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

showData();

async function showData() {
  const response = await fetch('/api');
  const all_data = await response.json();
  let item;

  for (item of all_data) {
    const marker = L.marker([item.lat, item.lon]).addTo(mymap);
    const weather_location = item.weather_location.split('/')[1].replace("_"," ");

    let text = `Location: ${weather_location} <br>
                The weather here at <strong>${item.lat.toFixed(2)}</strong>, <strong>${item.lon.toFixed(2)}</strong> is ${item.weather.summary} with a temperature of ${item.weather.temperature}&deg;C. <br>`;

    if(item.airQuality) {
      text += `The concentration of particulate matter (${item.airQuality.parameter}) is ${item.airQuality.value} ${item.airQuality.unit} last read on ${item.airQuality.lastUpdated}.`;
    } else {
      text += `  There's no air quality reading for this location`;
    }

    marker.bindPopup(text);

    // console.log(`From the client`);
    // console.log(item);
    // const date_string = new Date(item.timestamp).toLocaleString();

    // const container = document.createElement('div');
    // container.className = 'container';
    // const div_date = document.createElement('div');
    // const div_lat = document.createElement('div');
    // const div_lon = document.createElement('div');

    // div_date.className = 'container-data';
    // div_lat.className = 'container-data';
    // div_lon.className = 'container-data'; 

    // div_date.textContent = date_string;
    // div_lat.textContent = `Latitude: ${item.lat}`;
    // div_lon.textContent = `Longitude: ${item.lon}`;

    // container.append(div_date, div_lat, div_lon);
    // document.body.append(container);

  }

  console.log(all_data);
  
};
