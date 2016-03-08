import { expect } from 'chai';

export default (arr, expected) => {
  arr.forEach((item, index) => {
    it(`array element ${index} should equal ${expected[index]}`, () => {
      expect(arr[index]).to.equal(expected[index]);
    });
  })
};
