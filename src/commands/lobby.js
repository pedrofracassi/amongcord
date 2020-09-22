const Command = require('../Command')

const GameStages = require('../GameStages')
const GameExistenceRequirement = require('../GameExistenceRequirement')
const GameParticipationRequirement = require('../GameParticipationRequirement')

module.exports = class Lobby extends Command {
  constructor() {
    super({
      name: 'lobby',
      aliases: ['lb'],
      description: 'Sets the stage to Lobby, marks everyone as alive and unmutes them',

      gameExistenceRequirement: GameExistenceRequirement.GAME,
      gameParticipationRequirement: GameParticipationRequirement.PARTICIPATING,
      voiceChannelOnly: true
    })
  }

  run({ message, game }) {
    if (!Utils.muteUsersPermCheck(message.author)) return message.reply(`Make sure you have the proper permissions to do this!`)
    game.setStage(GameStages.LOBBY)
    message.channel.send({
      content: 'Stage set to **lobby**. Thanks for playing!',
      embed: {
        description: `If you appreciate **Amongcord**, please consider [supporting the creator on Patreon](https://patreon.com/pedrofracassi) :)`,
        color: 0xf96854
      }
    })
  }
}