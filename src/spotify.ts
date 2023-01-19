import SpotifyWebApi from 'spotify-web-api-node';
import { Config } from './config';

const scopes = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'app-remote-control',
  'streaming',
];

export class Spotify {
  private config: Config;
  private spotifyApi: SpotifyWebApi;

  constructor(config: Config) {
    this.config = config;
    this.spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: `http://localhost:${process.env.PORT || 3000}/callback`,
    });
  }

  private async refreshToken(): Promise<Boolean> {
    try {
      const data = await this.spotifyApi.refreshAccessToken();
      this.spotifyApi.setAccessToken(data.body['access_token']);
      this.config.spotifyAccessToken = data.body['access_token'];
      this.config.write();
      setTimeout(this.refreshToken, data.body['expires_in'] * 1000 - 1000, this);
      return true;
    } catch (err) {
      console.log('Something went wrong! Refreshing token', err);
      return false;
    }
  }

  setup() {
    if (this.config.spotifyAccessToken && this.config.spotifyRefreshToken) {
      this.spotifyApi.setAccessToken(this.config.spotifyAccessToken);
      this.spotifyApi.setRefreshToken(this.config.spotifyRefreshToken);
      this.refreshToken();
    } else {
      const authorizeURL = this.spotifyApi.createAuthorizeURL(scopes, '');
      console.log(`Click in the link and authorize the app to call spotify ${authorizeURL}`);
    }
  }

  async autorize(code: string): Promise<Boolean> {
    try {
      const data = await this.spotifyApi.authorizationCodeGrant(code);
      this.spotifyApi.setAccessToken(data.body['access_token']);
      this.spotifyApi.setRefreshToken(data.body['refresh_token']);
      this.config.spotifyAccessToken = data.body['access_token'];
      this.config.spotifyRefreshToken = data.body['refresh_token'];
      setTimeout(this.refreshToken, data.body['expires_in'] * 1000 - 1000, this);
      this.config.write();
      return true;
    } catch (err) {
      console.log('Something went wrong! Authorizing with spotify', err);
      return false;
    }
  }

  async currentPlaying(): Promise<SpotifyApi.CurrentlyPlayingResponse | null> {
    try {
      const data = await this.spotifyApi.getMyCurrentPlayingTrack();
      return data.body;
    } catch (err) {
      console.log('Something went wrong! Getting current playing track', err);
      return null;
    }
  }

  async getTrack(trackId: string): Promise<SpotifyApi.TrackObjectFull | null> {
    try {
      const data = await this.spotifyApi.getTrack(trackId);
      return data.body;
    } catch (err) {
      console.log('Something went wrong! Getting track', err);
      return null;
    }
  }

  async addTrackToQueue(trackId: string): Promise<Boolean> {
    try {
      await this.spotifyApi.addToQueue(trackId);
      return true;
    } catch (err) {
      console.log('Something went wrong! Adding track to queue', err);
      return false;
    }
  }

  async searchTracks(query: string): Promise<SpotifyApi.SearchResponse | null> {
    try {
      const data = await this.spotifyApi.searchTracks(query);
      return data.body;
    } catch (err) {
      console.log('Something went wrong! Searching tracks', err);
      return null;
    }
  }
}
