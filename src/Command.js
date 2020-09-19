class Command {
  constructor (settings) {
    this.name = settings.name
    this.aliases = settings.aliases || []
    this.usage = settings.usage || ''
    this.description = settings.description || ''
    this.hidden = settings.hidden || false
    this.new = settings.new || false

    this.voiceChannelOnly = settings.voiceChannelOnly || false
    this.gameExistenceRequirement = settings.gameExistenceRequirement || null
    this.gameParticipationRequirement = settings.gameParticipationRequirement || null
    this.voicePermissionRequirement = settings.voicePermissionRequirement || []
    this.colorRequirement = settings.colorRequirement || null
  }

  run ({ message }) {
    message.channel.send('Hello, world! This is an empty command.')
  }
}

module.exports = Command