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

  run ({ message, commands, prefix, client, emojis }) {
    message.channel.send(
      new MessageEmbed()
        .setThumbnail(client.user.avatarURL())
        .setColor(0x7289DA)
        .setDescription([
          commands.filter(c => !c.hidden).map(c => {
            return `**\`${prefix}${c.name}${c.usage ? ` ${c.usage}` : ''}\`** - ${c.description} ${c.new ? emojis.get('new') || '' : ''}`
          }).join('\n'),
          '',
          '[**Add Amongcord to your server**](https://amongcord.pedrofracassi.me/add)',
          [
            '[GitHub](https://github.com/pedrofracassi/amongcord)',
            '[Twitter](https://twitter.com/plfracassi_)',
            '[Patreon](https://patreon.com/pedrofracassi)',
            '[Discord](https://discord.gg/ENcM67N)',
            `**${client.guilds.cache.size.toLocaleString()} servers**`,
            `Shard ${message.guild.shardID}`
          ].join(' | '),
        ])
    )
  }
}
