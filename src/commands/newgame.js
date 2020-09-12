const Command = require('../Command')

const GameExistenceRequirement = require('../GameExistenceRequirement')

module.exports = class NewGame extends Command {
  constructor () {
    super({
      name: 'newgame',
      aliases: [ 'ng' ],
      description: 'Starts a new game',

      gameExistenceRequirement: GameExistenceRequirement.NO_GAME,
      voiceChannelOnly: true
    })
  }

  run ({ message, gameManager, voiceChannel }) {
    gameManager.newGame(voiceChannel, message.channel)
    message.channel.send(`Started a new game in **${voiceChannel.name}**!`)
  }
}
