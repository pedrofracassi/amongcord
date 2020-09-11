const Command = require('../Command')

module.exports = class Add extends Command {
  constructor () {
    super({
      name: 'add',
      aliases: [ 'invite' ]
    })
  }

  run ({ message }) {
    message.channel.send('**Click this link to add Amongcord to your server:**\n<https://amongcord.pedrofracassi.me/add>')
  }
}
