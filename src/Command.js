class Command {
  constructor (settings) {
    this.name = settings.name
    this.aliases = settings.aliases || []
    this.usage = settings.usage || ''

    this.gameExistenceRequirement = settings.gameExistenceRequirement || null
    this.colorRequirement = settings.colorRequirement || null
  }

  run ({ message }) {
    message.channel.send('Hello, world! This is an empty command.')
  }
}

module.exports = Command