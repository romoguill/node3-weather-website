const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode.js');
const forecast = require('./utils/forecast.js');

const app = express();
// Heroku uses the port in process.env . For development the default is set to 3000
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Set handlebars as view engine
app.set('view engine', 'hbs');
// By default express looks for a folder name views. We can change that.
app.set('views', viewsPath);
// Configure hbs to use partials in the /partials
hbs.registerPartials(partialsPath);

// Serve static files in /public folder
app.use(express.static(publicDirectoryPath));

// Render template with handlebars. No need to specify .hbs
app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Rodrigo',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Rodrigo',
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address',
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    name: 'Rodrigo',
  });
});

app.get('/help/*', (req, res) => {
  res.render('404', {
    errorMsg: 'Error 404, no article found in /help',
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    errorMsg: 'Error 404, page not found',
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
