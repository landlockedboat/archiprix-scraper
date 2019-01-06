#!/usr/bin/env node
'use strict';
const meow = require('meow');
const archiprixScraper = require('.');

const cli = meow(`
	Usage
	  $ archiprix-scraper [input]

	Options
	  --foo  Lorem ipsum [Default: false]

	Examples
	  $ archiprix-scraper
	  unicorns & rainbows
	  $ archiprix-scraper ponies
	  ponies & rainbows
`);

archiprixScraper(cli.input[0]);
