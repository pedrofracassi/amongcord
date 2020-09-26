const voiceStates = {
  lobby: {
    dead: { deaf: false, mute: false },
    alive: { deaf: false, mute: false }
  },
  discussion: {
    dead: { deaf: false, mute: true },
    alive: { deaf: false, mute: false }
  },
  tasks: {
    dead: { deaf: false, mute: false },
    alive: { deaf: true, mute: true }
  }
}

const voiceStatesNoDeafen = {
  lobby: {
    dead: { mute: false },
    alive: { mute: false }
  },
  discussion: {
    dead: { mute: true },
    alive: { mute: false }
  },
  tasks: {
    dead: { mute: true },
    alive: { mute: true }
  }
}

module.exports = class PlayerVoiceStates {
  constructor (selfMember, voicechannel, player, game) {
    this.selfMember = selfMember
    this.voiceChannel = voicechannel
    this.player = player
    this.game = game
  }

  getVoiceState(gameStage) {
    const useDeafen = this.voiceChannel.permissionsFor(this.selfMember).has('DEAFEN_MEMBERS')
    if (!this.game.players.includes(this.player)) {
      return useDeafen ? { mute: false, deaf: false } : { mute: false }
    }
    const stateSet = useDeafen ? voiceStates : voiceStatesNoDeafen
    return stateSet[gameStage][this.player.alive ? 'alive' : 'dead']
  }
}