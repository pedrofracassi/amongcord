const Command = require('../Command')
const Utils = require('../Utils')

const ColorRequirement = require('../ColorRequirement')
const GameExistenceRequirement = require('../GameExistenceRequirement')

module.exports = class ToJSON extends Command {
  constructor () {
    super({
      name: 'tojson',
      description: 'game as json',

      gameExistenceRequirement: GameExistenceRequirement.GAME,
      voiceChannelOnly: true,
    })
  }

  run ({ message, game }) {
    message.channel.send(`\`\`\`json\n${JSON.stringify(game.toJSON())}\n\`\`\``)
  }
}
