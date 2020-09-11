const Discord = require('discord.js')
const client = new Discord.Client()

const glob = require('glob')
const path = require('path')

const GameManager = require('./GameManager')

let gameManager = new GameManager()
let commands = []

const prefix = process.env.PREFIX || ','

glob.sync('./src/commands/**/*.js').forEach(file => {
  console.log(`Loading ${file}`)
  const Command = require(path.resolve(file))
  commands.push(new Command())
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', message => {
  if (message.author.id === client.user.id) return
  if (message.channel.type !== 'text') return
  if (message.author.bot) return

  const game = gameManager.getGame(message.guild.id)

  commands.forEach(command => {
    if (message.content.startsWith(`${prefix}${command.name}`)) {
      command.run({
        message,
        gameManager,
        game
      })
    }
  })
})

client.login(process.env.DISCORD_TOKEN)