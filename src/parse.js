import { email as emailPattern, simpleEmail as simpleEmailPattern, } from './regex';
import compile from './compilePatterns';

export const emailRE = emailPattern;
export const simpleEmailRE = simpleEmailPattern;

/**
 * Strip email boilerplate text from a string
 *
 * @param  {String} text incoming email string
 * @return {String}      stripped email string
 */
export default function parseReplyPlainText(text) {
  if (!text) return '';

  const
    froms = ['from'],
    on = ['on'],
    wrote = ['wrote'],
    forwards = ['forwarded message', 'original message'];

  const
    regex = compile({ froms, on, wrote, forwards }),
    match = text.match(regex);

  return match ? text.slice(0, match.index) : text;
}
