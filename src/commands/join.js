const Command = require('../Command')
const Utils = require('../Utils')

const PlayerColors = require('../PlayerColors')

module.exports = class Join extends Command {
  constructor () {
    super({
      name: 'join',
      aliases: [ 'j' ],
      gameExistenceRequirement: true
    })
  }

  run ({ message, game }) {
    if (!game) return message.channel.send('No game, type `,newgame` to start one!')
    if (game.getPlayer(message.member)) return message.channel.send('You\'re already in this game. Type `,leave` to leave it.')
    const color = message.content.split(' ')[1]
    if (!color || !PlayerColors[color.toUpperCase()]) return message.channel.send(`Invalid color. Try one of these: ${Utils.getFormattedList(game.getAvailableColors())}`)
    if (game.isColorOccupied(color)) return message.channel.send(`There's already a player with the color \`${color}\`. Try one of these:`)
    const player = game.addPlayer(message.member, color)
    message.channel.send(`You joined the game as \`${player.color}\``)
  }
}
