const Game = require('./Game')
const GameStages = require('./GameStages')

class GameManager {
  constructor (io, client) {
    this.io = io
    this.client= client
    this.games = new Map()
  }

  getGame (voiceChannel) {
    return voiceChannel && this.games.get(voiceChannel.id)
  }

  getGameBySyncId (id) {
    return id && Array.from(this.games.values()).find(g => g.syncId === id)
  }

  newGame (voiceChannel, textChannel) {
    console.log(`Starting new game im ${voiceChannel.guild.name} (${voiceChannel.guild.id}) / ${voiceChannel.name} (${voiceChannel.id})`)
    this.games.set(voiceChannel.id, new Game(voiceChannel, textChannel, this))
    return this.games.get(voiceChannel.id)
  }

  endGame (voiceChannel) {
    const game = this.getGame(voiceChannel)
    console.log(`Ending game ${game.syncId} in ${voiceChannel.guild.name} (${voiceChannel.guild.id}) / ${voiceChannel.name} (${voiceChannel.id})`)
    game.setStage(GameStages.LOBBY)
    this.io.to(game.syncId).emit('gameEnded')
    return this.games.delete(voiceChannel.id)
  }

  hasGameBySyncId (id) {
    return id && !!this.getGameBySyncId(id)
  }

  hasGame (voiceChannel) {
    return voiceChannel && this.games.has(voiceChannel.id)
  }
}

module.exports = GameManager
