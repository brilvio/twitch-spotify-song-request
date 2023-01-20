import * as fs from 'fs';

export default class Config {
  private static readonly defaultPath = './config/config.json';

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
      const config = JSON.parse(fs.readFileSync(path).toString());
      this.spotifyAccessToken = config.spotifyAccessToken;
      this.spotifyRefreshToken = config.spotifyRefreshToken;
    }
  }

  public write(path: string = Config.defaultPath): void {
    fs.writeFileSync(
      path,
      JSON.stringify({
        spotifyAccessToken: this.spotifyAccessToken,
        spotifyRefreshToken: this.spotifyRefreshToken,
      }),
    );
  }
}
