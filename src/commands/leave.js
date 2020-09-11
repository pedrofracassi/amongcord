const Command = require('../Command')

module.exports = class Leave extends Command {
  constructor () {
    super({
      name: 'leave',
      aliases: [ 'l' ],
      gameExistenceRequirement: true
    })
  }

  run ({ message, game }) {
    if (!game) return message.channel.send('No game, type `,newgame` to start one!')
    if (!game.getPlayer(message.member)) return message.channel.send('You\'re not in this game. Type `,join` to join it.')
    game.removePlayer(message.member)
    message.channel.send(`You left the game`)
  }
}
