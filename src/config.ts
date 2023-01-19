import * as fs from 'fs';

export class Config {
  private static instance: Config;
  private static readonly defaultPath = './config.json';
  private static readonly defaultConfig = {
    spotifyAccessToken: '',
    spotifyRefreshToken: '',
  };

  public spotifyAccessToken: string;
  public spotifyRefreshToken: string;

  constructor() {
    this.spotifyAccessToken = Config.defaultConfig.spotifyAccessToken;
    this.spotifyRefreshToken = Config.defaultConfig.spotifyRefreshToken;
    this.read();
  }

  public read(path: string = Config.defaultPath): void {
    if (fs.existsSync(path)) {
      let config = JSON.parse(fs.readFileSync(path).toString());
      this.spotifyAccessToken = config.spotifyAccessToken;
      this.spotifyRefreshToken = config.spotifyRefreshToken;
    }
  }

  public write(path: string = Config.defaultPath): void {
    fs.writeFileSync(
      path,
      JSON.stringify({ spotifyAccessToken: this.spotifyAccessToken, spotifyRefreshToken: this.spotifyRefreshToken })
    );
  }
}
