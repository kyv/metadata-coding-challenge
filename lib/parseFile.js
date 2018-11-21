const fs = require('fs');
const xml2js = require('xml2js');
const formatData = require('./dataRutine');

const parser = new xml2js.Parser();

module.exports = function(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if (err) {
        return reject(err);
      }
      parser.parseString(data, (err, result) => {
        if (err) {
          return reject(err);
        }

        // catch if fundamental data block is missing
        try {
          const epub = result['rdf:RDF']['pgterms:ebook'][0];
          const formated = formatData(epub);

          return resolve(formated);
        }
        catch (e) {
          return reject(e);
        }

      });
    });
  });
};
