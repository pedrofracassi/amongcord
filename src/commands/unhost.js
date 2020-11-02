const Command = require('../Command')
const Utils = require('../Utils')

const GameExistenceRequirement = require('../GameExistenceRequirement')
const PlayerColors = require('../PlayerColors')

module.exports = class Unhost extends Command {
  constructor () {
    super({
      name: 'unhost',
      description: 'Exits "host mode" and frees you from being the host',

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
