const Command = require('../Command')

module.exports = class NewGame extends Command {
  constructor () {
    super({
      name: 'newgame',
      aliases: [ 'ng' ],
      gameExistenceRequirement: false
    })
  }

  run ({ message, gameManager }) {
    gameManager.newGame(message.guild.id, message.member.voice.channel)
    message.channel.send('New game started!')
  }
}
