const Book = require('../models/book');

module.exports = json => {
  const data = {
    ...json,
    rights: json.rights && json.rights.toString(),
    authors: json.authors && json.authors.toString(),
    subjects: json.subjects && json.subjects.toString(),
  };

  return Book.create(data);
};
