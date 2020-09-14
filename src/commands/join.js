const Command = require('../Command')
const Utils = require('../Utils')

const ColorRequirement = require('../ColorRequirement')
const GameExistenceRequirement = require('../GameExistenceRequirement')
const GameParticipationRequirement = require('../GameParticipationRequirement')

module.exports = class Join extends Command {
  constructor () {
    super({
      name: 'join',
      aliases: [ 'j' ],
      usage: '<color>',
      description: 'Joins the current game as a color',

      gameExistenceRequirement: GameExistenceRequirement.GAME,
      gameParticipationRequirement: GameParticipationRequirement.NOT_PARTICIPATING,
      colorRequirement: ColorRequirement.AVAILABLE
    })
  }

  run ({ message, game, emojis }) {
    const color = message.content.split(' ')[1].toLowerCase()
    const player = game.addPlayer(message.member, color)
    message.channel.send(`You joined the game as ${Utils.getPlayerEmoji(player, emojis)} \`${player.color}\``)
  }
}
