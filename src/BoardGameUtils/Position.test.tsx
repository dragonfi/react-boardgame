import {rankRange, fileRange, Position} from './Position';

it('position can be created', () => {
  const p = new Position('a1');
  expect(p.rank).toBe(1);
  expect(p.file).toBe('a');
});

it('position arithmetic works', () => {
  const p = new Position('c3');
  expect(p.rank).toBe(3);
  expect(p.file).toBe('c');

  expect(p.offsetFile(-1).file).toBe('b');
  expect(p.offsetRank(1).rank).toBe(4);

  const p2 = p.offsetRank(-2).offsetFile(3);
  expect(p2.rank).toBe(1);
  expect(p2.file).toBe('f');
});

it('setRank and setFile creates new Position', () => {
  const p = new Position('c3');
  expect(p.rank).toBe(3);
  expect(p.file).toBe('c');

  expect(p.setRank(6).rank).toBe(6);
  expect(p.setFile('f').file).toBe('f');

  expect(p.rank).toBe(3);
  expect(p.file).toBe('c');
});

it('rankRange properly returns reverse range for size of 8', () => {
  expect(rankRange(8)).toEqual([8, 7, 6, 5, 4, 3, 2, 1]);
});

it('fileRange properly returns letter range for size of 8', () => {
  expect(fileRange(8)).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
});
