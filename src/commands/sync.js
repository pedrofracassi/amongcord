const Command = require('../Command')
const Utils = require('../Utils')

const ColorRequirement = require('../ColorRequirement')
const GameExistenceRequirement = require('../GameExistenceRequirement')

module.exports = class Sync extends Command {
  constructor () {
    super({
      name: 'sync',
      description: 'Shows the Sync ID for the current game',

      gameExistenceRequirement: GameExistenceRequirement.GAME,
      voiceChannelOnly: true,
    })
  }

  run ({ message, game }) {
    message.channel.send(`Open https://sync.amongcord.xyz in a browser/smartphone and enter **\`${game.syncId}\`** to control the bot.`)
  }
}
