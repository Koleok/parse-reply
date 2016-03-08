import _ from 'lodash';
import utilsFactory from './utils';
import { simpleEmail } from './regex';

/**
 * Build up a large regex pattern based on many smaller patterns that
 * accommodate a variety of detection cases
 *
 * @param  {Array} froms     strings that each mean 'from'
 * @param  {Array} on        strings that each mean 'on'
 * @param  {Array} wrote     strings that each mean 'wrote'
 * @param  {Array} forwards  strings that indicate a forwarded email
 * @return {Object}          Regex pattern
 */
const compilePatterns = ({ froms, on, wrote, forwards }) => {
  const {
    fromPatternArray,
    wrotePatternArray,
    forwardPatternArray,
    concatRegex,
  } = utilsFactory({ _ });

  const patterns = _.concat(

    // any line that starts with From: email
    fromPatternArray(froms, simpleEmail),

    // gmail style reply: date <email>
    `^[0-9]{4}/[0-9]{1,2}/[0-9]{1,2} .* <\\s*${simpleEmail}\\s*>$`,

    // some email clients just say email@domain.com wrote:
    `^${simpleEmail}\\s+wrote:\\s+$`,

    // others say On date X wrote:
    wrotePatternArray(wrote, on),

    // forwarded emails are a bit messier
    '^____+$',
    forwardPatternArray(forwards),
  );

  return concatRegex(patterns);
}

/**
 * Generate a memoized version of the compilation function
 * that will not re-compile if the arguments passed to it
 * are the same as the last time it ran
 */
export default _.memoize(compilePatterns);
