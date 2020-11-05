const Command = require('../Command')
const Utils = require('../Utils')

const GameExistenceRequirement = require('../GameExistenceRequirement')
const PlayerColors = require('../PlayerColors')
const GameParticipationRequirement = require('../GameParticipationRequirement')
const HostExistenceRequirement = require('../HostExistenceRequirement')

module.exports = class Host extends Command {
  constructor () {
    super({
      name: 'host',
      description: 'Sets you as the game host so only you can control the bot',

      voiceChannelOnly: true,
      gameExistenceRequirement: GameExistenceRequirement.GAME,
      gameParticipationRequirement: GameParticipationRequirement.PARTICIPATING,
      hostExistenceRequirement: HostExistenceRequirement.NO_HOST,
      voicePermissionRequirement: [ 'MUTE_MEMBERS' ],
      new: true
    })
  }

  run ({ message, game }) {
    game.refreshSyncId()
    game.getPlayer(message.member).setHost(true)
    message.channel.send('You\'re now the game host. A new sync code has been sent to you.')
    message.member.send(`The new sync code for your game in **${game.voiceChannel.name}** is \`${game.syncId}\`. Click this link to open the web app: ${process.env.SYNC_BASE_URL}/${game.syncId}`)
  }
}
