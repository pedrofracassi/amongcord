const Command = require('../Command')

module.exports = class EndGame extends Command {
  constructor () {
    super({
      name: 'endgame',
      aliases: [ 'eg' ],
      gameExistenceRequirement: true
    })
  }

  run ({ message, game, gameManager }) {
    if (!game) return message.channel.send('No game.')
    gameManager.endGame(message.guild.id)
    message.channel.send('Game ended. Start a new one with `,newgame`')
  }
}
