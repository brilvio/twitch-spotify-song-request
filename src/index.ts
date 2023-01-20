import * as dotenv from 'dotenv';
import express from 'express';
import Config from './config';
import Spotify from './spotify';
import Twitch from './twitch';

dotenv.config();

const config = new Config();

const app = express();
const port = process.env.PORT || 3000;

const spotify = new Spotify(config);
spotify.setup();

app.get('/callback', async (req, res) => {
  if (req.query.code) {
    const authorized = await spotify.autorize(req.query.code.toString());

    if (authorized) {
      res.status(200).send('Authorized');
    } else {
      res.status(400).send('Error authorizing with spotify');
    }
  } else {
    res.status(400).send('No code provided');
  }
});

const twitch = new Twitch(spotify);

twitch.setup();

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Bot running on port ${port}`);
});
