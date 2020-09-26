const Command = require('../Command')

module.exports = class GameCount extends Command {
  constructor () {
    super({
      name: 'gamecount',
      aliases: [ 'gc' ],
      description: 'Shows how many games are being tracked at the moment',
      hidden: true
    })
  }

  run ({ message, gameManager }) {
    const plural = gameManager.games.size !== 1
    message.channel.send(`There ${plural ? 'are' : 'is'} ${gameManager.games.size} ${plural ? 'games' : 'game'} being tracked right now.`)
  }
}
