const Command = require('../Command')
const { MessageEmbed } = require('discord.js')


module.exports = class Commands extends Command {
  constructor () {
    super({
      name: 'help',
      aliases: [ 'h' ],
      description: 'Lists all of the bot\'s commands'
    })
  }

  run ({ message, commands, prefix, client }) {
    message.channel.send(
      new MessageEmbed()
        .setThumbnail(client.user.avatarURL())
        .setColor(0x7289DA)
        .setDescription([
          commands.filter(c => !c.hidden).map(c => `**\`${prefix}${c.name}${c.usage ? ` ${c.usage}` : ''}\`** - ${c.description}`).join('\n'),
          '',
          '[**Add Amongcord to your server**](https://amongcord.pedrofracassi.me/add)',
          [
            '[GitHub](https://github.com/pedrofracassi/amongcord)',
            '[Twitter](https://twitter.com/plfracassi_)',
            '[Patreon](https://patreon.com/pedrofracassi)',
            `${client.guilds.cache.size.toLocaleString()} servers`
          ].join(' | '),
        ])
    )
  }
}
