const Command = require('../Command')
const Utils = require('../Utils')

const ColorRequirement = require('../ColorRequirement')
const GameExistenceRequirement = require('../GameExistenceRequirement')
const GameParticipationRequirement = require('../GameParticipationRequirement')

module.exports = class Join extends Command {
  constructor () {
    super({
      name: 'forcejoin',
      aliases: [ 'fj' ],
      usage: '<color> <@mention>',
      description: 'Forcibly adds someone to the current game',

      voiceChannelOnly: true,
      gameExistenceRequirement: GameExistenceRequirement.GAME,
      targetGameParticipationRequirement: GameParticipationRequirement.NOT_PARTICIPATING,
      colorRequirement: ColorRequirement.AVAILABLE,
      voicePermissionRequirement: [ 'MUTE_MEMBERS' ],
      requiresTarget: true,
      new: true
    })
  }

  run ({ message, game, emojis, target }) {
    if (message.mentions.members.size < 1) return message.channel.send(``)
    const color = message.content.split(' ')[1].toLowerCase()
    const player = game.addPlayer(target, color)
    message.channel.send(`You added **${target.user.tag}** the game as ${Utils.getPlayerEmoji(player, emojis)} \`${player.color}\``)
  }
}
