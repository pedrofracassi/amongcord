const Command = require('../Command')

const GameExistenceRequirement = require('../GameExistenceRequirement')

module.exports = class EndGame extends Command {
  constructor() {
    super({
      name: 'endgame',
      aliases: ['eg'],
      description: 'Ends the current game',

      gameExistenceRequirement: GameExistenceRequirement.GAME
    })
  }

  run({ message, gameManager, prefix, voiceChannel }) {
    if (!Utils.muteUsersPermCheck(message.author)) return message.reply(`Make sure you have the proper permissions to do this!`)
    gameManager.endGame(voiceChannel)
    message.channel.send(`Game ended. Start a new one with \`${prefix}newgame\``)
  }
}
