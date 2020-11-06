const PlayerColors = require('./PlayerColors')

class PlayerState {
  constructor (member, color) {
    this.member = member
    this.color = color.toLowerCase()
    this.alive = true
    this.host = false
  }

  setAlive (alive) {
    this.alive = alive
  }

  setColor (color) {
    this.color = color.toLowerCase()
  }

  setHost (host) {
    this.host = host
  }
}

module.exports = PlayerState