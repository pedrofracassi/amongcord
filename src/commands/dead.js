const Command = require('../Command')
const Utils = require('../Utils')

const ColorRequirement = require('../ColorRequirement')
const GameExistenceRequirement = require('../GameExistenceRequirement')

module.exports = class Dead extends Command {
  constructor () {
    super({
      name: 'dead',
      aliases: [ 'd' ],
      usage: '<color>',
      description: ' Marks a player as dead. Dead players are kept muted during the discussion stage.',

      gameExistenceRequirement: GameExistenceRequirement.GAME,
      voiceChannelOnly: true,
      colorRequirement: ColorRequirement.ALIVE,
      isColorOptional: true
    })
  }

  run ({ message, game, emojis }) {
    const player = this.getPlayer(message, game);
    game.setPlayerAlive(player.member, false)
    return message.channel.send(`**${player.member.user.tag}** (${player.color}) has been marked as dead. ${Utils.getPlayerEmoji(player, emojis)}`)
  }

  getPlayer (message, game) {
    const color = message.content.split(' ')[1]
    if(color == undefined && this.isColorOptional) 
      return game.getPlayer(message.member)
    return game.getPlayerByColor(color.toLowerCase())
  }
}
