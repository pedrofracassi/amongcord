const Sentry = require("@sentry/node")
const Tracing = require("@sentry/tracing")

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
})

const glob = require('glob')
const path = require('path')

const GameManager = require('./GameManager')
const ColorRequirement = require('./ColorRequirement')
const GameExistenceRequirement = require('./GameExistenceRequirement')
const GameParticipationRequirement = require('./GameParticipationRequirement')
const PlayerColors = require('./PlayerColors')
const Utils = require('./Utils')

const permissionStrings = require('./strings/permissions.json')

let commands = []
let emojis = new Map()

const prefix = process.env.PREFIX || ','

const Discord = require('discord.js')
const client = new Discord.Client({
  shards: 'auto',
  messageCacheMaxSize: 1,
  presence: {
    activity: {
      name: `${prefix}help`,
      type: 'PLAYING'
    }
  }
})

const io = require('socket.io')(process.env.PORT || 80)

let gameManager = new GameManager(io)

io.on('connection', socket => {
  socket.on('join', id => {
    Sentry.setTag('sync_event', 'join')
    console.log('Sync client trying to join', id)
    if (gameManager.hasGameBySyncId(id)) {
      socket.join(id)
      const game = gameManager.getGameBySyncId(id)
      console.log(`Sync client connected to ${id} in ${Utils.getGameLogString(game)}`)
      socket.emit('gameStateUpdate', gameManager.getGameBySyncId(id).toJSON())
    } else {
      console.log('Invalid sync code', id)
      socket.emit('joinFailed')
    }
  })

  socket.on('setStage', data => {
    Sentry.setTag('sync_event', 'setStage')
    const { sync_id, game_stage } = JSON.parse(data)
    const game = gameManager.getGameBySyncId(sync_id)
    console.log(`Client set the stage to ${game_stage} in game ${game.syncId} at ${Utils.getGameLogString(game)}`)
    game.setStage(game_stage)
  })

  socket.on('setAlive', data => {
    Sentry.setTag('sync_event', 'setAlive')
    const { sync_id, color, alive } = JSON.parse(data)
    const game = gameManager.getGameBySyncId(sync_id)
    console.log(`Client set ${color} to ${alive? 'alive' : 'dead'} in game ${game.syncId} at ${Utils.getGameLogString(game)}`)
    game.setPlayerAlive(game.getPlayerByColor(color).member, alive)
  })
})

glob.sync('./src/commands/**/*.js').forEach(file => {
  console.log(`Loading ${file}`)
  const Command = require(path.resolve(file))
  commands.push(new Command())
})

client.on('ready', () => {
  Sentry.setTag('discord_event', 'ready')
  console.log(`Logged in as ${client.user.tag}!`)
  if (process.env.GUILD_ID) client.guilds.cache.get(process.env.GUILD_ID).emojis.cache.each(e => {
    console.log(`Loaded ${e}`)
    emojis.set(e.name, e.toString())
  })
})

client.on('ratelimit', ratelimitInfo => {
  Sentry.setTag('discord_event', 'ratelimit')
  console.log(ratelimitInfo)
})

client.on('voiceStateUpdate', (oldState, newState) => {
  Sentry.setTag('discord_event', 'voiceStateUpdate')
  if (oldState.channelID !== newState.channelID && gameManager.hasGame(oldState.channel)) {
    const game = gameManager.getGame(oldState.channel)
    if (game.getPlayer(oldState.member)) {
      game.textChannel.send(`**${oldState.member.user.tag}** has been removed from the game in **${oldState.channel.name}** because they've left the channel.`)
      game.removePlayer(newState.member)
    }
  }
})

client.on('message', message => {
  Sentry.setTag('discord_event', 'message')
  if (message.author.id === client.user.id) return
  if (message.channel.type !== 'text') return
  if (message.author.bot) return

  if ([`<@!${client.user.id}>`, `<@${client.user.id}>`].includes(message.content)) return message.channel.send(`**Hi, I\'m Amongcord!** For help, type \`${prefix}help\`.`)

  const safePrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const commandExpression = new RegExp(`^${safePrefix}([a-z]*) ?`)
  
  const commandMatch = commandExpression.exec(message.content)
  if (!commandMatch) return

  const invokedCommand = commandMatch[1]

  const command = commands.find(c => c.name === invokedCommand || c.aliases.includes(invokedCommand))
  if (!command) return

  Sentry.setTag('command', command.name)

  Sentry.setContext('Command Execution', {
    'Message': message.content
  })

  console.log(`[${message.guild.name}] #${message.channel.name} <${message.author.tag}> ${message.content}`)

  const game = gameManager.getGame(message.member.voice.channel)

  const target = message.mentions.members.first()

  if (command.voiceChannelOnly) {
    if (!message.member.voice.channel) return message.channel.send('Join a voice channel.')
  }

  if (command.voicePermissionRequirement.length > 0) {
    for (const index in command.voicePermissionRequirement) {
      const permission = command.voicePermissionRequirement[index]
      if (!message.member.voice.channel.permissionsFor(message.member).has(permission)) return message.channel.send(`You need the **${permissionStrings[permission]}** permission to do that.`)
    }
  }

  if (command.requiresTarget && !target) return message.channel.send('You need to mention someone.')

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
      if (game && !!game.getPlayer(message.member)) return message.channel.send(`**You're already in this game.** Type \`${prefix}leave\` to leave it.`)
      break
  }

  if (target) {
    switch (command.targetGameParticipationRequirement) {
      case GameParticipationRequirement.PARTICIPATING:
        if (!game.getPlayer(target)) return message.channel.send(`**${target.user.tag} is not in this game.** Type \`${prefix}forcejoin\` to add them to it.`)
        break
      case GameParticipationRequirement.NOT_PARTICIPATING:
        if (game && !!game.getPlayer(target)) return message.channel.send(`**${target.user.tag} is already in this game.** Type \`${prefix}kick ${game.getPlayer(target).color}\` to kick them from it.`)
        break
    }
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
    emojis,
    target
  })
})

client.login(process.env.DISCORD_TOKEN)