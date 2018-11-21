process.env.NODE_ENV = 'test';
const xml2js = require('xml2js');
const Book = require('../models/book');
const insertBook = require('../lib/insertBook');
const parseFile = require('../lib/parseFile');
const dataRutine = require('../lib/dataRutine');

const parser = new xml2js.Parser();

const chai = require('chai');

const testFile = `${__dirname}/testBook.rdf`;
const failTestFile = `${__dirname}/XXXXXXXX.rdf`;
const emptyTestFile = `${__dirname}/emptyBook.rdf`;
const malFormedTestFile = `${__dirname}/malFormedBook.rdf`;
const testBookNoLang = `${__dirname}/testBookNoLang.rdf`;
const expect = chai.expect;

const fakeBook = {
  ebookId: 2222,
  title: 'Human Genome Project, rough draft, Chromosome Number 22',
  rights: ['Public domain in the USA.'],
  publisher: 'Project Gutenberg',
  language: 'en',
  pubDate: '2000-06-01',
  authors: ['Human Genome Project'],
  subjects: [
    'Human genetics',
    'QP',
    'Nucleotide sequence',
    'Human gene mapping',
    'Human Genome Project',
    'QH',
  ],
};

const fakeBookNoLang = {
  ebookId: 2222,
  title: 'Human Genome Project, rough draft, Chromosome Number 22',
  rights: ['Public domain in the USA.'],
  publisher: 'Project Gutenberg',
  language: null,
  pubDate: '2000-06-01',
  authors: ['Human Genome Project'],
  subjects: [
    'Human genetics',
    'QP',
    'Nucleotide sequence',
    'Human gene mapping',
    'Human Genome Project',
    'QH',
  ],
};

const bookInsertResult = {
  ebookId: 2222,
  title: 'Human Genome Project, rough draft, Chromosome Number 22',
  rights: 'Public domain in the USA.',
  publisher: 'Project Gutenberg',
  language: 'en',
  pubDate: new Date('2000-06-01'),
  authors: 'Human Genome Project',
  subjects: 'Human genetics,QP,Nucleotide sequence,Human gene mapping,Human Genome Project,QH',
  id: 1,
  createdAt: '',
  updatedAt: '',
};

const bookInsertResultNoLang = {
  ebookId: 2222,
  title: 'Human Genome Project, rough draft, Chromosome Number 22',
  rights: 'Public domain in the USA.',
  publisher: 'Project Gutenberg',
  language: null,
  pubDate: new Date('2000-06-01'),
  authors: 'Human Genome Project',
  subjects: 'Human genetics,QP,Nucleotide sequence,Human gene mapping,Human Genome Project,QH',
  id: 2,
  createdAt: '',
  updatedAt: '',
};


describe('Book Model Tests', () => {

  before(done => {
    Book.sync({ force: true }).then(() => {
      done();
    });
  });

  after(done => {
    Book.drop().then(() => done());
  });

  it('should throw if file not found', done => {
    parseFile(failTestFile).catch(err => {
      expect(err.code).to.be.equal('ENOENT');
      done();
    });
  });

  it('should throw if empty file', done => {
    parseFile(emptyTestFile).catch(err => {
      const e = err.message.split('\n');

      expect(e[0]).to.be.equal('Non-whitespace before first tag.');
      done();
    });
  });

  it('should throw on mal formed file', done => {
    parseFile(malFormedTestFile).catch(err => {
      expect(err.message).to.be.equal('Cannot read property \'0\' of undefined');
      done();
    });
  });

  it('should ignore language field if not present', done => {
    parseFile(testBookNoLang).then(result => {
      expect(result).to.deep.equal(fakeBookNoLang);
      done();
    });
  });

  // assert that our data format function conforms to expectations
  it('should format book data from file', done => {
    parseFile(testFile).then(result => {
      expect(result).to.deep.equal(fakeBook);
      done();
    });
  });

  // assert that our schema conforms to expectations
  it('should insert a book', done => {
    insertBook(fakeBook).then(result => {
      const formatedResult = {
        ...result.dataValues,
        createdAt: '',
        updatedAt: '',
      };

      expect(formatedResult).to.deep.equal(bookInsertResult);
      done();
    });
  });

  // assert that null values are treated correctly

  // FIXME since omitNUll is set on the DB constructor
  // the null value should not be set
  it('should insert a book with a null value', done => {
    insertBook(fakeBookNoLang).then(result => {
      const formatedResult = {
        ...result.dataValues,
        createdAt: '',
        updatedAt: '',
      };

      expect(formatedResult).to.deep.equal(bookInsertResultNoLang);
      done();
    });
  });


});
