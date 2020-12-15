const GameStages = require('./GameStages')
const Player = require('./Player')
const PlayerColors = require('./PlayerColors')
const Utils = require('./Utils')
const PlayerVoiceStates = require('./PlayerVoiceStates')

const badgeConfig = require('./badge_config.json')

function getBadge (client, userId) {
  const member = client.guilds.cache.get(badgeConfig.guild).members.cache.get(userId)
  if (!member) return null
  const role = member.roles.hoist
  if (!role) return null
  return Object.keys(badgeConfig.badges).find(k => badgeConfig.badges[k] === role.id)
}
class Game {
  constructor (voiceChannel, textChannel, manager) {
    this.manager = manager
    this.syncId = Math.random().toString(36).substring(2, 8).toUpperCase()
    this.voiceChannel = voiceChannel
    this.textChannel = textChannel
    this.gameStage = GameStages.LOBBY
    this.players = []
  }

  toJSON () {
    return {
      sync_id: this.syncId,
      game_stage: this.gameStage,
      channel_name: this.voiceChannel.name,
      players: this.players.map(p => {
        return {
          name: p.member.displayName,
          color: p.color,
          alive: p.alive,
          host: p.host,
          badge: getBadge(this.manager.client, p.member.id)
        }
      })
    }
  }

  hasHost () {
    return this.players.some(p => p.host)
  }

  sendStateUpdate () {
    this.manager.io.to(this.syncId).emit('gameStateUpdate', this.toJSON())
  }

  refreshSyncId () {
    this.manager.io.to(this.syncId).emit('gameEnded')
    this.syncId = Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  async setStage (stage) {
    this.gameStage = stage
    
    if (stage.toLowerCase() === GameStages.LOBBY) this.setAliveAll(true)
    
    this.sendStateUpdate()
    
    const sortedPlayers = [...this.players].sort((a, b) => {
      if (stage === GameStages.DISCUSSION || stage === GameStages.LOBBY) return a.alive - b.alive
      if (stage === GameStages.TASKS) return b.alive - a.alive
    })

    for (const player of sortedPlayers) {
      await this.updatePlayerMute(player)
    }
  }

  setAliveAll (alive) {
    for (const player of this.players) {
      player.setAlive(alive)
    }
  }

  addPlayer (member, color) {
    const player = new Player(member, color)
    this.players.push(player)
    console.log(`${member.user.tag} (${member.user.id}) joined ${this.syncId} as ${color} in ${this.voiceChannel.guild.name} (${this.voiceChannel.guild.id}) / ${this.voiceChannel.name} (${this.voiceChannel.id})`)
    this.sendStateUpdate()
    this.updatePlayerMute(player)
    return player
  }

  removePlayer (member) {
    const player = this.getPlayer(member)
    this.players.splice(this.players.indexOf(player), 1)
    console.log(`${member.user.tag} (${member.user.id}) left ${this.syncId} in ${this.voiceChannel.guild.name} (${this.voiceChannel.guild.id}) / ${this.voiceChannel.name} (${this.voiceChannel.id})`)
    this.sendStateUpdate()
    this.updatePlayerMute(player)
    if (this.players.length === 0) {
      this.textChannel.send(`The game in **${this.voiceChannel.name}** has ended because there were no players left.`)
      this.manager.endGame(this.voiceChannel)
    }
  }

  getPlayer (member) {
    return this.players.find(p => p.member.user.id === member.user.id)
  }

  getPlayerByColor (color) {
    return this.players.find(p => p.color === color)
  }

  getPlayers() {
    return this.players
  }
  
  setPlayerAlive (member, alive) {
    const player = this.getPlayer(member)
    player.setAlive(alive)
    this.sendStateUpdate()
    this.updatePlayerMute(player)
  }

  setPlayerColor (member, color) {
    const player = this.getPlayer(member)
    player.setColor(color)
    this.sendStateUpdate()
  }

  isColorOccupied (color) {
    return !!this.getPlayerByColor(color.toLowerCase())
  }

  isColorAvailable (color) {
    return !this.getPlayerByColor(color.toLowerCase())
  }

  getAvailableColors () {
    return Object.keys(PlayerColors).map(k => PlayerColors[k]).filter(c => !this.getPlayerByColor(c))
  }

  getOccupiedColors () {
    return Object.keys(PlayerColors).map(k => PlayerColors[k]).filter(c => !!this.getPlayerByColor(c))
  }

  getDeadColors () {
    return this.players.filter(p => !p.alive).map(p => p.color)
  }

  getAliveColors () {
    return this.players.filter(p => !!p.alive).map(p => p.color)
  }

  updatePlayerMute (player) {
    if (player.member.user.bot) return
    const states = new PlayerVoiceStates(player.member.guild.me, this.voiceChannel, player, this)
    Utils.editMember(player.member, states.getVoiceState(this.gameStage))
  }
}

module.exports = Game