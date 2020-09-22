const Command = require('../Command')
const Utils = require('../Utils')

const ColorRequirement = require('../ColorRequirement')
const GameExistenceRequirement = require('../GameExistenceRequirement')
const GameParticipationRequirement = require('../GameParticipationRequirement')

module.exports = class Join extends Command {
  constructor() {
    super({
      name: 'kick',
      aliases: ['k'],
      usage: '<color>',
      description: 'Removes a player from the game',

      gameExistenceRequirement: GameExistenceRequirement.GAME,
      colorRequirement: ColorRequirement.OCCUPIED
    })
  }

  run({ message, game }) {
    if (!Utils.muteUsersPermCheck(message.author)) return message.reply(`Make sure you have the proper permissions to do this!`)
    const color = message.content.split(' ')[1].toLowerCase()
    const player = game.getPlayerByColor(color)
    message.channel.send(`**${player.member.user.tag}** has been kicked from the game.`)
    game.removePlayer(player.member)
  }
}
