const Command = require('../Command')

module.exports = class GitHub extends Command {
  constructor () {
    super({
      name: 'github',
      aliases: [ 'gh' ]
    })
  }

  run ({ message }) {
    message.channel.send('https://github.com/pedrofracassi/amongcord')
  }
}
