const Command = require('../Command')

module.exports = class GitHub extends Command {
  constructor () {
    super({
      name: 'github',
      aliases: [ 'gh' ],
      description: 'Links to the bot\'s GitHub page'
    })
  }

  run ({ message }) {
    message.channel.send('https://github.com/pedrofracassi/amongcord')
  }
}
