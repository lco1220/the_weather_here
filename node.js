const express = require('express');
const dataStore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

// console.log(process.env)

const app = express();
const port = process.env.PORT || 3010;

app.listen(port, () => console.log(`Running at port ${port}`));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const db = new dataStore('file_database.db');
db.loadDatabase();

app.get('/api', (request, response) => {
  db.find({}, (err, data) => {
    if(err) {
      response.end();
      return;
    } else {
      response.json(data);
    }
  });
});

app.post('/api', (request, response) => {
  console.log(request.body);
  const data_request = request.body;

  const data_timestamp = Date.now();
  data_request.timestamp = data_timestamp;
  db.insert(data_request);
  response.json(data_request);

});

app.get('/weather/:latlon', async (request, response) => {
  console.log(request.params);
  const latlon = request.params.latlon.split(',');
  const lat = latlon[0];
  const lon = latlon[1];
  console.log(latlon);
  console.log(lat,lon);

  const api_key = process.env.API_KEY;
  const weather_url = `https://api.darksky.net/forecast/${api_key}/${lat},${lon}/?units=si`;
  const weather_response = await fetch(weather_url);
  const weather_data = await weather_response.json();
  // response.json(weather_data);

  const airquality_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
  const airquality_response = await fetch(airquality_url);
  const airquality_data = await airquality_response.json();
  // response.json(airquality_data);

  const data = {
    weather: weather_data,
    air_quality: airquality_data
  };

  response.json(data);
});