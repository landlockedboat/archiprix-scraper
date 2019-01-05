# archiprix-scraper [![Build Status](https://travis-ci.org/vikepic/archiprix-scraper.svg?branch=master)](https://travis-ci.org/vikepic/archiprix-scraper)

> Obtain the data from archiprix.org


## Install

```
$ npm install archiprix-scraper
```


## Usage

```js
const archiprixScraper = require('archiprix-scraper');

archiprixScraper('unicorns');
//=> 'unicorns & rainbows'
```


## API

### archiprixScraper(input, [options])

#### input

Type: `string`

Lorem ipsum.

#### options

Type: `Object`

##### foo

Type: `boolean`<br>
Default: `false`

Lorem ipsum.


## CLI

```
$ npm install --global archiprix-scraper
```

```
$ archiprix-scraper --help

  Usage
    archiprix-scraper [input]

  Options
    --foo  Lorem ipsum [Default: false]

  Examples
    $ archiprix-scraper
    unicorns & rainbows
    $ archiprix-scraper ponies
    ponies & rainbows
```


## License

MIT © [vikepic](https://vikepic.github.io)
