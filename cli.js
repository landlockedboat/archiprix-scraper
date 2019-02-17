#!/usr/bin/env node
'use strict';
const meow = require('meow');
const archiprixScraper = require('.');

const cli = meow(`

  Usage
    archiprix-scraper
		// Starts scraping archiprix.
		// Downloads the results
		// into a folder named
		// 'projects'
`);

archiprixScraper(cli.input[0]);
