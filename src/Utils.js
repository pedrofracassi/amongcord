module.exports = class Utils {
  static getFormattedList (array) {
    return array.map(c => `\`${c}\``).join(', ')
  }
}