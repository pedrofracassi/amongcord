module.exports = class Utils {
  getFormattedList (array) {
    return array.map(c => `\`${c}\``).join(', ')
  }
}