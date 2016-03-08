import fs from 'fs';
import _ from 'lodash';
import { expect } from 'chai';
import parse from '../src/parse';
import utilsFactory from '../src/utils';
import testArrayItems from './testArrayItems';

const {
  createFromPatterns,
  fromPatternArray,
  wrotePatternArray,
  regexifyWhitespace,
  createForwardPatterns,
  forwardPatternArray,
  concatRegex,
} = utilsFactory({ _ });

describe('utils', () => {
  describe('#createFromPatterns()', () => {
    const
      result = createFromPatterns('test', 'regex'),
      expected = [
        '^test:.*regex.*$',
        '^>\\s*test:.*regex.*$'
      ];

    testArrayItems(result, expected);
  });

  describe('#fromPatternArray()', () => {
    const
      result = fromPatternArray(['test1', 'test2'], 'regex'),
      expected = [
        '^test1:.*regex.*$',
        '^>\\s*test1:.*regex.*$',
        '^test2:.*regex.*$',
        '^>\\s*test2:.*regex.*$'
      ];

    testArrayItems(result, expected);
  });

  describe('#wrotePatternArray()', () => {
    const
      result = wrotePatternArray(['wrote1', 'wrote2'], ['on1', 'on2']),
      expected = [
        '^on1[\\s\\S]*wrote1.*:$',
        '^on2[\\s\\S]*wrote2.*:$',
      ];

    testArrayItems(result, expected);
  });

  describe('#regexifyWhitespace()', () => {
    const
      result = regexifyWhitespace('Hey man do pushups');

    it('should return the expected expression', () => {
      expect(result).to.equal('Hey\\s+man do pushups');
    });
  });

  describe('#createForwardPatterns()', () => {
    const
      result = createForwardPatterns('test'),
      expected = [
        '^.*test:$',
        '^-+\\s+test\\s+-+$',
      ];

    testArrayItems(result, expected);
  });

  describe('#forwardPatternArray()', () => {
    const
      result = forwardPatternArray(['test1', 'test2']),
      expected = [
        '^.*test1:$',
        '^-+\\s+test1\\s+-+$',
        '^.*test2:$',
        '^-+\\s+test2\\s+-+$',
      ];

    testArrayItems(result, expected);
  });

  describe('#concatRegex()', () => {
    const
      result = concatRegex(['^.*test1:$', '^.*test2:$']),
      expected = new RegExp(('(^.*test1:$|^.*test2:$)'), 'im')

    it('should return the correct expression', () => {
      expect(result).to.deep.equal(expected);
    });
  });
});

describe('Parse Reply', () => {
  const files = fs.readdirSync(__dirname + '/files');

  files.forEach(ff => {
    if (!ff.match(/^.*.input.txt$/)) return;

    const output = ff.replace('input.txt', 'output.txt');

    it(`should parse ${ff} and produce ${output}`, () => {

      const input = fs
        .readFileSync(__dirname + '/files/' + ff)
        .toString()
        .trim();

      const expected = fs
        .readFileSync(__dirname + '/files/' + output)
        .toString()
        .trim();

      const produced = parse(input).trim();

      expect(produced).to.equal(expected);
    });
  });
});
