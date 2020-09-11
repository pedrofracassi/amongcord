const Command = require('../Command')
const GameStages = require('../GameStages')

module.exports = class Lobby extends Command {
  constructor () {
    super({
      name: 'lobby',
      aliases: [ 'lb' ],
      gameExistenceRequirement: true
    })
  }

  run ({ message, game }) {
    if (!game) return message.channel.send('No game, type `,newgame` to start one!')
    game.setStage(GameStages.LOBBY)
    message.channel.send('Stage set to **lobby**')
  }
}