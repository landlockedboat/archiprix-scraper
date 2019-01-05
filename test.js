import test from 'ava';
import archiprixScraper from '.';

test('title', t => {
	const err = t.throws(() => {
		archiprixScraper(123);
	}, TypeError);
	t.is(err.message, 'Expected a string, got number');

	t.is(archiprixScraper('unicorns'), 'unicorns & rainbows');
});
