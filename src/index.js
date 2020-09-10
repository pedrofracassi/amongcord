const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', message => {
  if (message.author.id === client.user.id) return

  if (message.content === ',mute') {
    message.member.voice.channel.members.forEach(m => {
      if (m.user.bot) return
      m.voice.setMute(true).catch(console.log)
    })
  }

  if (message.content === ',unmute') {
    message.member.voice.channel.members.forEach(m => {
      if (m.user.bot) return
      m.voice.setMute(false).catch(console.log)
    })
  }
})

client.login(process.env.DISCORD_TOKEN)