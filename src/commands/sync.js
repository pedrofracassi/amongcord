const Command = require('../Command')
const Utils = require('../Utils')

const ColorRequirement = require('../ColorRequirement')
const GameExistenceRequirement = require('../GameExistenceRequirement')
const { MessageEmbed } = require('discord.js')

module.exports = class Sync extends Command {
  constructor () {
    super({
      name: 'sync',
      aliases: [ 's' ],
      description: 'Lets you control the bot through your phone',
      new: true,

      gameExistenceRequirement: GameExistenceRequirement.GAME,
      voiceChannelOnly: true,
    })
  }

  run ({ message, game }) {
    message.channel.send(
      new MessageEmbed()
        .setColor(0x7289DA)
        .setTitle(`${game.syncId}`)
        .setURL(`${process.env.SYNC_BASE_URL}/${game.syncId}`)
        .setDescription([
          `  **1.** Open [**sync.amongcord.xyz**](${process.env.SYNC_BASE_URL}/${game.syncId}) on your smartphone`,
          '  **2.** Enter the code above and click **Connect**.'
        ])
        .setFooter('You can also click the code to open Sync directly.')
    )
    // message.channel.send(`Open https://sync.amongcord.xyz in a browser/smartphone and enter **\`${game.syncId}\`** to control the bot.`)
  }
}
