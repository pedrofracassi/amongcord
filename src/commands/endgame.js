const Command = require('../Command')

const GameExistenceRequirement = require('../GameExistenceRequirement')

module.exports = class EndGame extends Command {
  constructor () {
    super({
      name: 'endgame',
      aliases: [ 'eg' ],
      description: 'Ends the current game',

      gameExistenceRequirement: GameExistenceRequirement.GAME,
      hostOnly: true
    })
  }

  run ({ message, gameManager, prefix, voiceChannel }) {
    gameManager.endGame(voiceChannel)
    message.channel.send(`Game ended. Start a new one with \`${prefix}newgame\``)
  }
}
