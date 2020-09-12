const Command = require('../Command')

const GameExistenceRequirement = require('../GameExistenceRequirement')
const Utils = require('../Utils')
const { MessageEmbed } = require('discord.js')

module.exports = class Players extends Command {
  constructor () {
    super({
      name: 'players',
      aliases: [ 'p' ],
      description: 'Lists all players in the current game',

      gameExistenceRequirement: GameExistenceRequirement.GAME,
      voiceChannelOnly: true
    })
  }

  run ({ message, game, voiceChannel, emojis }) {
    if (!game || game.players.length === 0) return message.channel.send('There are no players in this game.')

    const embed = new MessageEmbed()
      .setFooter(voiceChannel.name)

    const alive = game.players.filter(p => p.alive)
    // alive.map(p => `${Utils.getPlayerEmoji(p)} ${p.member.user}`)
    
    const dead = game.players.filter(p => !p.alive)
    // dead.map(p => `${Utils.getPlayerEmoji(p)} ${p.member.user}`)

    message.channel.send([
      alive.length > 0 ? [
        `**Alive (${alive.length})**`,
        alive.map(p => `${Utils.getPlayerEmoji(p, emojis)} \`${p.member.user.tag}\``).join('\n')
      ].join('\n') : null,
      '',
      dead.length > 0 ? [
        `**Dead (${dead.length})**`,
        dead.map(p => `${Utils.getPlayerEmoji(p, emojis)} \`${p.member.user.tag}\``).join('\n')
      ].join('\n') : null
    ])
    //message.channel.send(`**${voiceChannel.name} - Players (${game.players.length}/10):**\n${game.players.map(p => ).join('\n')}`)
  }
}
