<div align="center">
  <img height="200" src="https://svgshare.com/i/PXE.svg">
  <p>Discord bot for controlling voice channels during Among Us matches</p>
  <a href="https://amongcord.pedrofracassi.me/add"><b>Click here to add Amongcord to your server</b></a>
</div>

---

## Commands

| Command | Aliases | Description |
|-|-|-|
| `,add` | `,invite` | Shows the bot's invite link |
| `,alive <color>` | `,a` | Marks a player as alive |
| `,dead <color>` | `,d` |  Marks a player as dead. Dead players are kept muted during the discussion stage. |
| `,discussion` | `,ds` | Sets the stage to discussion, unmutes everyone who is alive |
| `,endgame` | `,eg` | Ends the current game |
| `,forcejoin <color> <@mention>` | `,fj` | Forcibly adds someone to the current game |
| `,github` | `,gh` | Links to the bot's GitHub page |
| `,help` | `,h` | Lists all of the bot's commands |
| `,host` |  | Sets you as the game host so only you can control the bot |
| `,join <color>` | `,j` | Joins the current game as a color |
| `,joinall` | `,ja` | Adds everyone in the voice channel to the game as a random color. |
| `,kick <color>` | `,k` | Removes a player from the game |
| `,leave` | `,l` | Leaves the current game |
| `,lobby` | `,lb` | Sets the stage to Lobby, marks everyone as alive and unmutes them |
| `,newgame` | `,ng` | Starts a new game |
| `,players` | `,p` | Lists all players in the current game |
| `,setcolor <color> <@mention>` | `,sc`,`,changecolor`,`,cc` | Set the color of a player in your game |
| `,sync` | `,s` | Lets you control the bot through your phone |
| `,tasks` | `,ts` | Sets the stage to tasks and mutes everyone |
| `,unhost` |  | Exits "host mode" and frees you from being the host |

###### **\*** aliases have not been implemented yet.

## Support server

<div>
  <a href="https://discord.gg/E3F6U53NxT">
    <img src="https://invidget.switchblade.xyz/E3F6U53NxT"></img>
  </a>
</div>

## Self-hosting

If you prefer you run the bot yourself instead of using the [hosted instance](https://amongcord.pedrofracassi.me/add), you can either use **Docker** or **clone the repository directly**. For both methods, you'll need a  [bot token](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token) and the ID of a server that has the [emojis the bot needs](https://github.com/pedrofracassi/amongcord/tree/master/emojis) (the bot needs to be in the server).

### Docker

Images are automatically built and pushed to [Docker Hub](https://hub.docker.com/r/pedrofracassi/amongcord) whenever the source code changes. You can run your own instance of the bot with the command below:

```bash
$ docker run -e DISCORD_TOKEN=<your discord token> GUILD_ID=<emoji guild id> -d pedrofracassi/amongcord
```

### Cloning directly

Although not recommended for production, cloning the repository should work just fine for experimental purposes. If you want to, you can use a process manager like [pm2](https://pm2.keymetrics.io/) to keep the node process running, but bear in mind that **I don't run the bot this way and probably won't be able to help you out.**

1. Clone the repository
   > `git clone https://github.com/pedrofracassi/amongcord`
2. Enter the directory you just cloned into
   > `cd amongcord`
3. Install the dependencies
   > `npm install`
4. Set the **DISCORD_TOKEN** and **GUILD_ID** environment variables
5. Run the bot
   > `node src/.`

## Similar projects

- [AmongUsBot](https://github.com/alpharaoh/AmongUsBot) - automatically detects tasks/discussion stages with OCR instead of using commands, but needs to be installed on someone's computer.
- [amongusdiscord](https://github.com/denverquane/amongusdiscord) - same as above, but written in Go. Easier to install as prebuilt executables are provided.
