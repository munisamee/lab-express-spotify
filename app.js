require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render("index");
  });

app.get('/artist-search', (req, res) => {
// Handle the search logic here
const artistName = req.query.artist;

app.get('/albums/:artistId', async (req, res) => {
    const artistId = req.params.artistId;

try {
    // Get artist albums using Spotify Web API
    const albumsResult = await spotifyApi.getArtistAlbums(artistId);
    const albums = albumsResult.body.items.map(album => ({
    name: album.name,
    image: album.images[0].url, // Assuming the first image is the album cover
    }));
    
    // Render albums page with albums data
    res.render('albums', { albums });
    } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).send('Error fetching albums');
    }
    });

spotifyApi
  .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
    
// For now, let's just send back a response confirming the search
res.render(`You searched for: ${artistName}`);
});
  
  

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
