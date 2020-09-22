const Command = require('../Command')

const GameStages = require('../GameStages')
const GameExistenceRequirement = require('../GameExistenceRequirement')
const GameParticipationRequirement = require('../GameParticipationRequirement')
const Utils = require('../Utils')

module.exports = class Discussion extends Command {
  constructor() {
    super({
      name: 'discussion',
      aliases: ['ds'],
      description: 'Sets the stage to discussion, umnutes everyone who is alive',

      gameExistenceRequirement: GameExistenceRequirement.GAME,
      gameParticipationRequirement: GameParticipationRequirement.PARTICIPATING,
      voiceChannelOnly: true
    })
  }

  run({ message, game, prefix }) {
    if (!game) return message.channel.send(`No game, type \`${prefix}newgame\` to start one!`)
    if (!Utils.muteUsersPermCheck(message.author)) return message.reply(`Make sure you have the proper permissions to do this!`)
    game.setStage(GameStages.DISCUSSION)
    message.channel.send('Stage set to **discussion**')
  }
}
