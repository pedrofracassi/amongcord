const PlayerColors = require('./PlayerColors')

class PlayerState {
  constructor (member, color) {
    this.member = member
    this.color = color.toLowerCase()
    this.alive = true
  }

  setAlive (alive) {
    this.alive = alive
  }

  setColor (color) {
    if (!PlayerColors[color]) throw Error('Invalid player color')
    this.color = color.toLowerCase()
  }
}

module.exports = PlayerState