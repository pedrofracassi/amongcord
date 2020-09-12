const Command = require('../Command')

const GameExistenceRequirement = require('../GameExistenceRequirement')

module.exports = class Players extends Command {
  constructor () {
    super({
      name: 'players',
      aliases: [ 'p' ],
      description: 'Lists all players in the current game',

      gameExistenceRequirement: GameExistenceRequirement.GAME,
      voiceChannelOnly: true
    })
  }

  run ({ message, game, voiceChannel }) {
    message.channel.send(`**${voiceChannel.name} - Players (${game.players.length}/10):**\n${game.players.map(p => ` - \`${p.member.user.tag}\` (${p.color}) ${p.alive ? '' : '☠'}`).join('\n')}`)
  }
}
