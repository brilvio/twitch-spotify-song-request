# Twitch Spotify Song Request

## How to get working

1. First you need to create an developer account on Spotify https://developer.spotify.com/dashboard/

1. Add in the app settings -> Redirect URIs -> `http://localhost:3000/callback`

1. Get a twitch token here https://twitchapps.com/tmi/

1. Copy `.env.example` to `.env`

1. Fill the required fields **IMPORTANT** the `TWITCH_REDEMPTION_ID` is the id of the custom reward you want to use for song requests	

1. Run `yarn start` for developing you can run `yarn start:dev`


When you run for the first time it will generate a url that you have to open and authorize your app with spotify, after autorizing the access token and refresh token will be saved in the `./config.json` file   subsquently runs it will utilize the access token and refresh token saved.

## How to use

Viewers can use the command !song in chat to see what music is currently playing.

Viewers can use channel points to request songs, you have to setup a custom reward and mark the option that says `Require Viewer to Enter Text`. Then he can request by typing `!sr name of the music` or `!sr url from spotify`. The song will be added to the queue and played when it is the next song in the queue, and after the song is played your playlist will continue to play as normal.


## Todo:

* [ ] Add a command to skip the current song - only mods can use this command
* [ ] Add Dockerfile and docker-compose.yml for easy deployment
* [ ] Add a static page to show the current song and the queue it will connect to the backend via socket.io and update in real time
* [ ] Add automatic linting as an action on github
