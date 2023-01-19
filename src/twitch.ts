import tmi, { ChatUserstate } from 'tmi.js';
import { Spotify } from './spotify';

export class Twitch {
  private requests: string[] = [];
  private spotify: Spotify;
  private client: tmi.Client;

  constructor(spotify: Spotify) {
    this.spotify = spotify;
    this.client = new tmi.Client({
      identity: { username: process.env.TWITCH_USER, password: process.env.TWITCH_TOKEN },
      channels: [process.env.TWITCH_CHANNEL || ''],
    });
    this.client.connect();
  }

  private async currentPlaying(channel: string) {
    const data = await this.spotify.currentPlaying();
    if (data && data.item) {
      this.client.say(
        channel,
        `Now Playing: ${data.item.name} - ${(data.item as any).artists[0].name} - Album: ${
          (data.item as any).album.name
        }`
      );
    } else {
      this.client.say(channel, `Sorry, I couldn't get the current song.`);
    }
  }

  private async songRequest(channel: string, tags: ChatUserstate, message: string) {
    if (this.requests.filter((x) => x === tags['user-id']).length > 0) {
      let music = message.replace('!sr ', '');

      if (music.startsWith('https://open.spotify.com/track/')) {
        let id = music.split('/')[4].split('?')[0];
        const data = await this.spotify.getTrack(id);

        if (data) {
          await this.spotify.addTrackToQueue(`spotify:track:${id}`);
          this.client.say(
            channel,
            `Add to the queue: ${data.name} - ${data.artists[0].name} - Album: ${data.album.name} requested by ${tags['display-name']}`
          );
          this.requests = this.requests.filter((x) => x !== tags['user-id']);
        } else {
          this.client.say(channel, `Sorry ${tags['display-name']}, I couldn't find the song you requested.`);
        }
      } else {
        const data = await this.spotify.searchTracks(music);

        if (data && data.tracks && data.tracks.items.length > 0) {
          const track = data.tracks.items[0];
          await this.spotify.addTrackToQueue(track.uri);
          this.client.say(
            channel,
            `Add to the queue: ${track.name} - ${track.artists[0].name} - Album: ${track.album.name} requested by ${tags['display-name']}`
          );
          this.requests = this.requests.filter((x) => x !== tags['user-id']);
        } else {
          this.client.say(channel, `Sorry ${tags['display-name']}, I couldn't find the song you requested.`);
        }
      }
    }
  }

  setup() {
    this.client.on('message', async (channel, tags, message) => {
      if (message.startsWith('!song')) {
        await this.currentPlaying(channel);
      }
      if (message.startsWith('!sr')) {
        await this.songRequest(channel, tags, message);
      }
    });

    this.client.on('redeem', async (channel, username, rewardType, tags) => {
      if (tags['custom-reward-id'] === process.env.TWITCH_REDEMPTION_ID) {
        if (tags['user-id']) this.requests.push(tags['user-id']);
      }
    });
  }
}
