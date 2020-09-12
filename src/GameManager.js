const Game = require('./Game')
const GameStages = require('./GameStages')

class GameManager {
  constructor () {
    this.games = new Map()
  }

  getGame (voiceChannel) {
    return voiceChannel && this.games.get(voiceChannel.id)
  }

  newGame (voiceChannel) {
    console.log(`Starting new game on ${voiceChannel.name}`)
    this.games.set(voiceChannel.id, new Game(voiceChannel))
    return this.games.get(voiceChannel.id)
  }

  endGame (voiceChannel) {
    console.log(`Ending game on ${voiceChannel.name}`)
    this.getGame(voiceChannel).setStage(GameStages.LOBBY)
    return this.games.delete(voiceChannel.id)
  }

  hasGame (voiceChannel) {
    return voiceChannel && this.games.has(voiceChannel.id)
  }
}

module.exports = GameManager
