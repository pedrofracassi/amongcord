const Command = require('../Command')

module.exports = class CommandsMD extends Command {
  constructor () {
    super({
      name: 'commandsmd',
      description: 'Command list markdown',
      hidden: true
    })
  }

  run ({ message, commands, prefix }) {
    message.channel.send(`\`\`\`| Command | Aliases | Description |\n|-|-|-|\n${commands.filter(c => !c.hidden).map(c => `| \`${prefix}${c.name}${c.usage ? ` ${c.usage}` : ''}\` | ${c.aliases ? c.aliases.map(a => `\`${prefix}${a}\``).join(',') : ''} | ${c.description} |`).join('\n')}\`\`\``)
  }
}
