const Command = require('../Command')
const Utils = require('../Utils')

const GameExistenceRequirement = require('../GameExistenceRequirement')
const PlayerColors = require('../PlayerColors')

module.exports = class Unhost extends Command {
  constructor () {
    super({
      name: 'host',
      description: 'Sets you as the game host so only you can control the bot',

      voiceChannelOnly: true,
      gameExistenceRequirement: GameExistenceRequirement.GAME,
      voicePermissionRequirement: [ 'MUTE_MEMBERS' ],
      new: true,
      hostOnly: true
    })
  }

  run ({ channel, message, game }) {
    game.getPlayer(message.member).setHost(false)
    channel.send('You\'re not the game host anymore. Freedom!')
  }
}
