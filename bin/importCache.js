#!/usr/bin/env node
const readGlob = require('read-glob');
const xml2js = require('xml2js');
const dataRutine = require('../lib/dataRutine');
const insertBook = require('../lib/insertBook');
const Book = require('../models/book');

const parser = new xml2js.Parser();

const cacheFolder = process.argv[2];

let count = 0;

// FIXME this code works but is very slow with intermittant errors
// but usefull for looping over many books as a manual test
// a real mass import script should probably use a more resiliant DB
// and batches

Book.sync({ force: true }).then(() => {
  readGlob(`${cacheFolder}/**/*.rdf`, 'utf8').subscribe({
    start() {
      console.log('Glob Glob.');
    },
    next(result) {

      // skip the DELETE files
      if (!/DELETE/.test(result.path)) {
        parser.parseString(result.contents, (err, result) => {
          if (err) {
            throw err;
          }
          const epub = result['rdf:RDF']['pgterms:ebook'][0];
          const data = dataRutine(epub);


          if (+data.ebookId > 0) {
            // document 0 is reserved for some wierdness
            insertBook(data).then(result => {
              console.log(result.dataValues)
              count += 1;
              process.stdout.write(`Glob Globbered ${count} books`);
            });
          }

        });
      }
    },
    complete() {
      process.stdout.write('\n');
    },
  });
});
