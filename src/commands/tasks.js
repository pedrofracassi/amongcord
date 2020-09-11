const Command = require('../Command')
const GameStages = require('../GameStages')

module.exports = class Tasks extends Command {
  constructor () {
    super({
      name: 'tasks',
      aliases: [ 'ts' ],
      gameExistenceRequirement: true
    })
  }

  run ({ message, game }) {
    if (!game) return message.channel.send('No game, type `,newgame` to start one!')
    game.setStage(GameStages.TASKS)
    message.channel.send('Stage set to **tasks**')
  }
}
