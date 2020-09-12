const Command = require('../Command')

const GameExistenceRequirement = require('../GameExistenceRequirement')
const GameParticipationRequirement = require('../GameParticipationRequirement')

module.exports = class Leave extends Command {
  constructor () {
    super({
      name: 'leave',
      aliases: [ 'l' ],
      description: 'Leaves the current game',

      gameExistenceRequirement: GameExistenceRequirement.GAME,
      gameParticipationRequirement: GameParticipationRequirement.PARTICIPATING,
      voiceChannelOnly: true
    })
  }

  run ({ message, game }) {
    game.removePlayer(message.member)
    message.channel.send(`You left the game`)
  }
}
