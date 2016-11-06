import test from 'ava';
import run, { UP, DOWN, ENTER } from 'inquirer-test';

const cliPath = __dirname + '/examples/after.js';

test('press enter', async t => {
  const result = await(run(cliPath, [ENTER]));
  t.regex(result, new RegExp('result-1', 'g'));
});

test('press down, press enter', async t => {
  const result = await(run(cliPath, [DOWN, ENTER]));
  t.regex(result, new RegExp('result-2', 'g'));
});

test('press up, press enter', async t => {
  const result = await(run(cliPath, [UP, ENTER]));
  t.regex(result, new RegExp('result-2', 'g'));
});
