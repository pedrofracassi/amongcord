const Discord = require('discord.js')
const client = new Discord.Client()

const glob = require('glob')
const path = require('path')

const GameManager = require('./GameManager')
const ColorRequirement = require('./ColorRequirement')
const GameExistenceRequirement = require('./GameExistenceRequirement')
const GameParticipationRequirement = require('./GameParticipationRequirement')
const PlayerColors = require('./PlayerColors')
const Utils = require('./Utils')

let gameManager = new GameManager()
let commands = []
let emojis = new Map()

const prefix = process.env.PREFIX || ','

glob.sync('./src/commands/**/*.js').forEach(file => {
  console.log(`Loading ${file}`)
  const Command = require(path.resolve(file))
  commands.push(new Command())
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  if (process.env.GUILD_ID) client.guilds.cache.get(process.env.GUILD_ID).emojis.cache.each(e => {
    console.log(`Loaded ${e}`)
    emojis.set(e.name, e.toString())
  })
})

client.on('ratelimit', ratelimitInfo => {
  console.log(ratelimitInfo)
})

client.on('voiceStateUpdate', (oldState, newState) => {
  if (oldState.channelID !== newState.channelID && gameManager.hasGame(oldState.channel)) {
    const game = gameManager.getGame(oldState.channel)
    game.textChannel.send(`**${oldState.member.user.tag}** has been removed from the game in **${oldState.channel.name}** because they've left the channel.`)
    game.removePlayer(oldState.member)
  }
})

client.on('message', message => {
  if (message.author.id === client.user.id) return
  if (message.channel.type !== 'text') return
  if (message.author.bot) return

  if ([`<@!${client.user.id}>`, `<@${client.user.id}>`].includes(message.content)) return message.channel.send(`**Hi, I\'m Amongcord!** For help, type \`${prefix}help\`.`)

  commands.forEach(command => {
    if (message.content.startsWith(`${prefix}${command.name}`)) {
      console.log(`[${message.guild.name}] #${message.channel.name} <${message.author.tag}> ${message.content}`)

      const game = gameManager.getGame(message.member.voice.channel)

      if (command.voiceChannelOnly) {
        if (!message.member.voice.channel) return message.channel.send('Join a voice channel.')
      }

      switch (command.gameExistenceRequirement) {
        case GameExistenceRequirement.GAME:
          if (!gameManager.hasGame(message.member.voice.channel)) return message.channel.send(`There's no game in the channel you're in. Type \`${prefix}newgame\` to start one.`)
          break
        case GameExistenceRequirement.NO_GAME:
          if (gameManager.hasGame(message.member.voice.channel)) return message.channel.send(`There's already a game in the channel you're in. Type \`${prefix}endgame\` to end it.`)
          break
      }

      switch (command.gameParticipationRequirement) {
        case GameParticipationRequirement.PARTICIPATING:
          if (!game.getPlayer(message.member)) return message.channel.send(`**You're not in this game.** Type \`${prefix}join\` to join it.`)
          break
        case GameParticipationRequirement.NOT_PARTICIPATING:
          if (game && !!game.getPlayer(message.member)) return message.channel.send(`**You\'re already in this game.** Type \`${prefix}leave\` to leave it.`)
          break
      }

      if (command.colorRequirement !== null) {
        const colors = Object.values(PlayerColors)
        const colorArgument = message.content.split(' ')[1]
        const suggestions = Utils.getFormattedList(Utils.getColorSuggestions(command.colorRequirement))
        if (!colorArgument) return message.channel.send(`**You need to give me a color.** Try one of these: ${suggestions}`)
        const color = colorArgument.toLowerCase()
        if (!colors.includes(color)) return message.channel.send(`**Invalid color.** Try one of these: ${suggestions}`)

        if ([ColorRequirement.ALIVE, ColorRequirement.DEAD, ColorRequirement.OCCUPIED].includes(command.colorRequirement)) {
          if (!game.isColorOccupied(color)) return message.channel.send(`**There's no player with the color \`${color}\`.** Try one of these: ${suggestions}`)
        }

        if (command.colorRequirement === ColorRequirement.AVAILABLE) {
          if (!game.isColorAvailable(color)) return message.channel.send(`**There's already a player with the color \`${color}\`.** Try one of these: ${suggestions}`)
        }

        if (command.colorRequirement === ColorRequirement.ALIVE) {
          const player = game.getPlayerByColor(color)
          if (!player.alive) return message.channel.send(`**${player.member.user.tag} (${color}) is not alive.** Try one of these: ${suggestions}`)
        }

        if (command.colorRequirement === ColorRequirement.DEAD) {
          const player = game.getPlayerByColor(color)
          if (player.alive) return message.channel.send(`**${player.member.user.tag} (${color}) is not dead.** Try one of these: ${suggestions}`)
        }
      }

      command.run({
        message,
        gameManager,
        game,
        prefix,
        voiceChannel: message.member.voice.channel,
        commands,
        client,
        emojis
      })
    }
  })
})

client.login(process.env.DISCORD_TOKEN)