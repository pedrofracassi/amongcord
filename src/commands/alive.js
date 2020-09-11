const Command = require('../Command')
const Utils = require('../Utils')

module.exports = class Alive extends Command {
  constructor () {
    super({
      name: 'alive',
      aliases: [ 'a' ],
      gameExistenceRequirement: true
    })
  }

  run ({ message, game }) {
    if (!game) return message.channel.send('No game, type `,newgame` to start one!')
    const color = message.content.split(' ')[1]
    if (!color) return message.channel.send(`No color was given.`)
    const player = game.getPlayerByColor(color)
    if (!player) return message.channel.send(`There's no \`${color}\` player in this game. Try one of these: ${Utils.getFormattedList(game.getDeadColors())}`)
    if (player.alive) return message.channel.send(`**${player.member.user.tag}** is not dead. Try one of these: ${Utils.getFormattedList(game.getDeadColors())}`)
    game.setPlayerAlive(player.member, true)
    return message.channel.send(`**${player.member.user.tag}** (${player.color}) has been marked as alive.`)
  }
}
