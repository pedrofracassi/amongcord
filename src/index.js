const Discord = require('discord.js')
const client = new Discord.Client()

const Game = require('./Game')
const GameStages = require('./GameStages')
const PlayerColors = require('./PlayerColors')

let game

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', message => {
  if (message.author.id === client.user.id) return
  if (message.channel.type !== 'text') return
  if (message.author.bot) return

  if (message.content === ',newgame') {
    game = new Game(message.member.voice.channel)
    message.channel.send('New game started!')
    return
  }

  if (message.content === ',endgame') {
    game = null
    message.channel.send('Game ended. Start a new one with `,newgame`')
  }

  if (message.content === ',lobby') {
    if (!game) return message.channel.send('No game, type `,newgame` to start one!')
    game.setStage(GameStages.LOBBY)
    message.channel.send('Stage set to **lobby**')
    return
  }

  if (message.content === ',discussion') {
    if (!game) return message.channel.send('No game, type `,newgame` to start one!')
    game.setStage(GameStages.DISCUSSION)
    message.channel.send('Stage set to **discussion**')
    return
  }

  if (message.content === ',tasks') {
    if (!game) return message.channel.send('No game, type `,newgame` to start one!')
    game.setStage(GameStages.TASKS)
    message.channel.send('Stage set to **tasks**')
    return
  }

  if (message.content.startsWith(',join')) {
    if (!game) return message.channel.send('No game, type `,newgame` to start one!')
    if (game.getPlayer(message.member)) return message.channel.send('You\'re already in this game. Type `,leave` to leave it.')
    const color = message.content.split(' ')[1]
    if (!color || !PlayerColors[color.toUpperCase()]) return message.channel.send(`Invalid color. Try one of these: ${getFormattedList(game.getAvailableColors())}`)
    if (game.isColorOccupied(color)) return message.channel.send(`There's already a player with the color \`${color}\`. Try one of these:`)
    const player = game.addPlayer(message.member, color)
    message.channel.send(`You joined the game as \`${player.color}\``)
  }

  if (message.content.startsWith(',leave')) {
    if (!game) return message.channel.send('No game, type `,newgame` to start one!')
    if (!game.getPlayer(message.member)) return message.channel.send('You\'re not in this game. Type `,join` to join it.')
    const player = game.removePlayer(message.member)
    message.channel.send(`You left the game`)
  }

  if (message.content === ',players') {
    if (!game) return message.channel.send('No game, type `,newgame` to start one!')
    message.channel.send(`**Players:**\n${game.players.map(p => ` - \`${p.member.user.tag}\` (${p.color}) ${p.alive ? '' : '☠'}`).join('\n')}`)
  }

  if (message.content.startsWith(',dead')) {
    if (!game) return message.channel.send('No game, type `,newgame` to start one!')
    const color = message.content.split(' ')[1]
    if (!color) return message.channel.send(`No color was given.`)
    const player = game.getPlayerByColor(color)
    if (!player) return message.channel.send(`There's no \`${color}\` player in this game. Try one of these: ${getFormattedList(game.getAliveColors())}`)
    if (!player.alive) return message.channel.send(`**${player.member.user.tag}** is not alive. Try one of these: ${getFormattedList(game.getAliveColors())}`)
    game.setPlayerAlive(player.member, false)
    return message.channel.send(`**${player.member.user.tag}** (${player.color}) has been marked as dead.`)
  }

  if (message.content.startsWith(',alive')) {
    if (!game) return message.channel.send('No game, type `,newgame` to start one!')
    const color = message.content.split(' ')[1]
    if (!color) return message.channel.send(`No color was given.`)
    const player = game.getPlayerByColor(color)
    if (!player) return message.channel.send(`There's no \`${color}\` player in this game. Try one of these: ${getFormattedList(game.getDeadColors())}`)
    if (player.alive) return message.channel.send(`**${player.member.user.tag}** is not dead. Try one of these: ${getFormattedList(game.getDeadColors())}`)
    game.setPlayerAlive(player.member, true)
    return message.channel.send(`**${player.member.user.tag}** (${player.color}) has been marked as alive.`)
  }
})

function getFormattedList (array) {
  return array.map(c => `\`${c}\``).join(', ')
}

client.login(process.env.DISCORD_TOKEN)