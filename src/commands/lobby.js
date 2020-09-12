const Command = require('../Command')

const GameStages = require('../GameStages')
const GameExistenceRequirement = require('../GameExistenceRequirement')

module.exports = class Lobby extends Command {
  constructor () {
    super({
      name: 'lobby',
      aliases: [ 'lb' ],
      description: 'Sets the stage to Lobby, marks everyone as alive and unmutes them',

      gameExistenceRequirement: GameExistenceRequirement.GAME
    })
  }

  run ({ message, game }) {
    game.setStage(GameStages.LOBBY)
    message.channel.send('Stage set to **lobby**')
  }
}