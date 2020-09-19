const Command = require('../Command')
const Utils = require('../Utils')

const GameExistenceRequirement = require('../GameExistenceRequirement')
const PlayerColors = require('../PlayerColors')

module.exports = class JoinAll extends Command {
  constructor () {
    super({
      name: 'joinall',
      aliases: [ 'ja' ],
      description: 'Adds everyone in the voice channel to the game as a random color.',

      voiceChannelOnly: true,
      gameExistenceRequirement: GameExistenceRequirement.GAME,
      voicePermissionRequirement: [ 'MUTE_MEMBERS' ],
      new: true
    })
  }

  run ({ message, game, voiceChannel }) {
    const filteredMembers = voiceChannel.members.filter(m => !m.user.bot && !game.getPlayer(m))
    if (filteredMembers.size === 0) return message.channel.send('Everyone in this voice channel is already in the game.')
    if (filteredMembers.size + game.getPlayers().length > Object.keys(PlayerColors).length) return message.channel.send('There aren\'t enough colors for everyone.')
    filteredMembers.forEach(member => {
      game.addPlayer(member, game.getAvailableColors()[Math.floor(Math.random() * game.getAvailableColors().length)])
    })
    if (filteredMembers.size === 1) {
      message.channel.send(`Added ${filteredMembers.size} player to the game as a random color.`)
    } else {
      message.channel.send(`Added ${filteredMembers.size} players to the game as random colors.`)
    }
  }
}
