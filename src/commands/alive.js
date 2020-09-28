const Command = require('../Command')
const Utils = require('../Utils')

const ColorRequirement = require('../ColorRequirement')
const GameExistenceRequirement = require('../GameExistenceRequirement')

module.exports = class Alive extends Command {
  constructor () {
    super({
      name: 'alive',
      aliases: [ 'a' ],
      usage: '<color>',
      description: 'Marks a player as alive',

      gameExistenceRequirement: GameExistenceRequirement.GAME,
      voiceChannelOnly: true,
      colorRequirement: ColorRequirement.DEAD,
      isColorOptional: true,
    })
  }

  run ({ message, game, emojis }) {
    const player = this.getPlayer(message, game);
    game.setPlayerAlive(player.member, true)
    return message.channel.send(`**${player.member.user.tag}** (${player.color}) has been marked as alive.  ${Utils.getPlayerEmoji(player, emojis)}`)
  }

  getPlayer (message, game) {
    const color = message.content.split(' ')[1]
    if(color == undefined && this.isColorOptional) 
      return game.getPlayer(message.member)
    return game.getPlayerByColor(color.toLowerCase())
  }
}
