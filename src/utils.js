export default ({
  _
}) => {
  const container = {

    /**
     * Create an array of regex patterns given an email pattern and text
     * that means 'from' for a specific email platform
     *
     * @param  {String} fromText    string that means 'from'
     * @param  {String} emailRegex  email regex pattern
     * @return {Array}              generated regex patterns
     */
    createFromPatterns(fromText, emailRegex) {
      return [
        `^${fromText}:.*${emailRegex}.*$`,
        `^>\\s*${fromText}:.*${emailRegex}.*$`
      ];
    },

    /**
     * Create an array of 'from' reckognizing regex patterns given a list
     * of strings that each mean 'from' for a specific email platform and an
     * email regex pattern
     *
     * @param  {Array}  fromList    strings that each mean 'from'
     * @param  {String} emailRegex  email regex pattern
     * @return {Array}              generated regex patterns
     */
    fromPatternArray(fromList, emailRegex) {
      return _.chain(fromList)
        .map(text => container.createFromPatterns(text, emailRegex))
        .flatten()
        .value();
    },

    /**
     * Create an array of 'On date X wrote' reckognizing regex patterns with a
     * list of 'wrote' strings matched against a list of 'on' strings
     *
     * @param  {Array} wroteList  strings that each mean 'wrote'
     * @param  {Array} onList     strings that each mean 'on'
     * @return {Array}            generated regex patterns
     */
    wrotePatternArray(wroteList, onList) {
      return _.chain(wroteList)
        .zip(onList)
        .map(([wrote, on]) => `^${on}[\\s\\S]*${wrote}.*:$`)
        .value();
    },

    /**
     * Replace whitespace in a string with regex pattern that reckognizes it
     *
     * @param  {String} text  string that contains whitespace
     * @return {String}       generated regex pattern
     */
    regexifyWhitespace(text) {
      return text.replace(' ', '\\s+');
    },

    /**
     * Creates a list of regex patterns that reckognize forwarded emails given
     * an string like 'forwarded message' or 'original message'
     *
     * @param  {String} forwardText text that indicates a forwarded email
     * @return {Array}              generated regex patterns
     */
    createForwardPatterns(text) {
      const subPattern = container.regexifyWhitespace(text);

      return [
        `^.*${subPattern}:$`,
        `^-+\\s+${subPattern}\\s+-+$`,
      ];
    },

    /**
     * Creates a list of regex patterns that reckognize forwarded emails given
     * an array of strings like 'forwarded message' or 'original message'
     *
     * @param  {Array} forwardList strings that indicate a forwarded email
     * @return {Array}             generated regex patterns
     */
    forwardPatternArray(forwardList) {
      return _.chain(forwardList)
        .map(container.createForwardPatterns)
        .flatten()
        .value();
    },

    /**
     * Join an array of regex pattern strings together and return RegExp object
     *
     * @param  {Array} patterns list of regex strings
     * @return {Object}         javascript RegExp object
     */
    concatRegex(patterns) {
      return new RegExp(`(${patterns.join('|')})`, 'im');
    },
  }

  return container;
}
