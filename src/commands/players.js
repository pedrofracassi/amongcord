const Command = require('../Command')

module.exports = class Players extends Command {
  constructor () {
    super({
      name: 'players',
      aliases: [ 'p' ],
      gameExistenceRequirement: true
    })
  }

  run ({ message, game }) {
    if (!game) return message.channel.send('No game, type `,newgame` to start one!')
    message.channel.send(`**Players:**\n${game.players.map(p => ` - \`${p.member.user.tag}\` (${p.color}) ${p.alive ? '' : '☠'}`).join('\n')}`)
  }
}
