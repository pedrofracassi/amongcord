const Game = require('./Game')

class GameManager {
  constructor () {
    this.games = new Map()
  }

  getGame (guildId) {
    return this.games.get(guildId)
  }

  newGame (guildId, voiceChannel) {
    console.log(`Starting new game on ${guildId}`)
    this.games.set(guildId, new Game(voiceChannel))
  }

  endGame (guildId) {
    Game.players.forEach(player => {
        player.member.voice.setMute(false)
    })
    
    console.log(`Ending game on ${guildId}`)
    return this.games.delete(guildId)
  }

  hasGame (guildId) {
    return this.games.has(guildId)
  }
}

module.exports = GameManager
