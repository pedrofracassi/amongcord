const Command = require('../Command')
const Utils = require('../Utils')

const ColorRequirement = require('../ColorRequirement')
const GameExistenceRequirement = require('../GameExistenceRequirement')
const GameParticipationRequirement = require('../GameParticipationRequirement')

module.exports = class SetColor extends Command {
  constructor () {
    super({
      name: 'setcolor',
      aliases: [ 'sc', 'changecolor', 'cc' ],
      usage: '<color> <@mention>',
      description: 'Set the color of a player in your game',

      voiceChannelOnly: true,
      gameExistenceRequirement: GameExistenceRequirement.GAME,
      targetGameParticipationRequirement: GameParticipationRequirement.PARTICIPATING,
      colorRequirement: ColorRequirement.AVAILABLE,
      voicePermissionRequirement: [ 'MUTE_MEMBERS' ],
      requiresTarget: true,
      new: true
    })
  }

  run ({ message, game, emojis, target }) {
    if (message.mentions.members.size < 1) return message.channel.send(``)
    const player = game.getPlayer(target)
    const color = message.content.split(' ')[1].toLowerCase()

    const previousColor = player.color
    const previousEmoji = Utils.getPlayerEmoji(player, emojis)
    
    game.setPlayerColor(target, color)
    message.channel.send(`You changed the color of **${target.user.tag}** from ${previousEmoji} \`${previousColor}\` to ${Utils.getPlayerEmoji(player, emojis)} \`${player.color}\``)
  }
}
