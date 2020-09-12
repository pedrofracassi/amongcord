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
}
