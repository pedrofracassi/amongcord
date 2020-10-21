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

  run ({ message, gameManager, voiceChannel, prefix }) {
    const game = gameManager.newGame(voiceChannel, message.channel)
    message.channel.send({
      content: `Started a new game in **${voiceChannel.name}**! Type \`${prefix}sync\` to control it through your phone.`,
      embed: {
        description: `If you appreciate **Amongcord**, please consider [supporting the creator on Patreon](https://patreon.com/pedrofracassi) :)`,
        color: 0xf96854
      }
    })
  }
}
