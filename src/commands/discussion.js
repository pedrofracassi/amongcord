const Command = require('../Command')
const GameStages = require('../GameStages')

module.exports = class Discussion extends Command {
  constructor () {
    super({
      name: 'discussion',
      aliases: [ 'ds' ],
      gameExistenceRequirement: true
    })
  }

  run ({ message, game }) {
    if (!game) return message.channel.send('No game, type `,newgame` to start one!')
    game.setStage(GameStages.DISCUSSION)
    message.channel.send('Stage set to **discussion**')
  }
}
