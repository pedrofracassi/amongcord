const ColorRequirement = require('./ColorRequirement')
const PlayerColors = require('./PlayerColors')

module.exports = class Utils {
  static getFormattedList (array) {
    return array.map(c => `\`${c}\``).join(', ')
  }

  static getColorSuggestions (game, colorRequirement) {
    switch (colorRequirement) {
      case ColorRequirement.ALIVE:
        return game.getAliveColors()
        break
      case ColorRequirement.DEAD:
        return game.getDeadColors()
        break
      case ColorRequirement.AVAILABLE:
        return game.getAvailableColors()
        break
      case ColorRequirement.OCCUPIED:
        return game.getOccupiedColors()
        break
      default:
        return Object.values(PlayerColors)
    }
  }

  static getPlayerEmoji (player, emojis) {
    if (emojis.size === 0) return ''
    if (player.alive) {
      return emojis.get(player.color)
    } else {
      return emojis.get(`${player.color}_dead`)
    }
  }

  static getGameLogString (game) {
    return `${game.voiceChannel.guild.name} (${game.voiceChannel.guild.id}) / ${game.voiceChannel.name} (${game.voiceChannel.id})`
  }

  static editMember (member, newState) {
    if (!member.voice) return
    const currentState = {
      deaf: member.voice.serverDeaf,
      mute: member.voice.serverMute
    }
    if (newState.deaf === currentState.deaf && newState.mute === currentState.mute) return
    member.edit(newState)
  }
}
