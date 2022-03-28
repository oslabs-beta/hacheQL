import { jest } from '@jest/globals';
import sum from '../client/sum';
// const sum = require('../client/sum');

describe('Test the sum function', () => {
  it('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
});

describe('Test the mocked fetch function', () => {
  beforeAll(() => {
    global.fetch = jest.fn(() => 'Mocked fetch!');
  });

  it('Should use the mocked fetch function', () => {
    expect(fetch()).toBe('Mocked fetch!');
  });
});
