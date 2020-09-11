const Command = require('../Command')
const Utils = require('../Utils')

module.exports = class NewGame extends Command {
  constructor () {
    super({
      name: 'dead',
      aliases: [ 'dead' ],
      gameExistenceRequirement: true
    })
  }

  run ({ message, game }) {
    if (!game) return message.channel.send('No game, type `,newgame` to start one!')
    const color = message.content.split(' ')[1]
    if (!color) return message.channel.send(`No color was given.`)
    const player = game.getPlayerByColor(color)
    if (!player) return message.channel.send(`There's no \`${color}\` player in this game. Try one of these: ${Utils.getFormattedList(game.getAliveColors())}`)
    if (!player.alive) return message.channel.send(`**${player.member.user.tag}** is not alive. Try one of these: ${Utils.getFormattedList(game.getAliveColors())}`)
    game.setPlayerAlive(player.member, false)
    return message.channel.send(`**${player.member.user.tag}** (${player.color}) has been marked as dead.`)
  }
}
