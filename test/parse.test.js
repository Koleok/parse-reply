import fs from 'fs';
import assert from 'assert';
import parse from '../src/parse';

describe('Parse Reply', () => {
  const files = fs.readdirSync(__dirname + '/files');

  files.forEach(ff => {
    if (!ff.match(/^.*.input.txt$/)) return;

    const output = ff.replace('input.txt', 'output.txt');

    it(`should parse ${ff} and produce ${output}`, () => {

      const input = fs
        .readFileSync(__dirname + '/files/' + ff)
        .toString();

      const expected = fs
        .readFileSync(__dirname + '/files/' + output)
        .toString();

      const produced = parse(input);
      assert.equal(produced.trim(), expected.trim());
    });
  });
});
