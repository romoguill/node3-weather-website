const request = require('request');

const forecast = (lat, lon, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=69107435745d6241285fbb3dba9fd7ef&query=${lon},${lat}&units=f`;
  console.log(url);
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to weather service');
    } else if (body.error) {
      console.log(body.error);
      callback('Invalid location');
    } else {
      const temperature = body.current.temperature;
      const precip = body.current.precip;
      callback(
        undefined,
        `It is currently ${temperature} degrees out. There is a ${precip}% chance of rain`
      );
    }
  });
};

module.exports = forecast;
