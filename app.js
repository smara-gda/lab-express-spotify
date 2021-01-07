require('dotenv').config();
const path = require('path');
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// setting the spotify-api goes here:
const spotifyAPI = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyAPI
  .clientCredentialsGrant()
  .then((data) => spotifyAPI.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:
app.get('/', (req, res) => {
  res.render('index');
});
app.get('/artist-search', (req, res) => {
  const myQuery = req.query.q;
  spotifyAPI
    .searchArtists(myQuery)
    .then((results) => {
      const artists = results.body.artists.items;
      // console.log('got an answer:', results.body.artists.items[0]);
      res.render('artist-search-results', {
        myQuery,
        artists
      });
    })
    .catch((error) => {
      console.log('I was unable to fetch the requested information', error);
    });
});

app.get('/albums/:id', (req, res) => {
  const id = req.params.id;
  // console.log('Got album id', id);
  spotifyAPI
    .getArtistAlbums(id)
    .then((album) => {
      const albums = album.body.items;
      console.log(albums);
      res.render('albums', { albums });
    })
    .catch((error) => {
      console.log('Could not find that album', error);
    });
});
app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
