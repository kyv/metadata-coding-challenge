function getAuthor(data) {
  return data['dcterms:creator'] &&
    data['dcterms:creator'][0]['pgterms:agent'] &&
    data['dcterms:creator'][0]['pgterms:agent'].map(o => (o['pgterms:name'][0])) || null;
}

function getSubjects(data) {
  return data['dcterms:subject'] &&
    data['dcterms:subject'].map(o => (o['rdf:Description'][0]['rdf:value'][0])) ||
    null;
}

function getLanguage(data) {
  return data['dcterms:language'] &&
    data['dcterms:language'][0]['rdf:Description'] &&
    data['dcterms:language'][0]['rdf:Description'][0]['rdf:value'][0]._ ||
    null;
}

module.exports = function formatData(epub) {
  const ebookId = +epub.$['rdf:about'].split('/')[1];
  const creators = getAuthor(epub);
  const subjects = getSubjects(epub);
  const language = getLanguage(epub);

  return {
    ebookId,
    title: epub['dcterms:title'] && epub['dcterms:title'][0],
    rights: epub['dcterms:rights'],
    publisher: epub['dcterms:publisher'] && epub['dcterms:publisher'][0],
    language,
    pubDate: epub['dcterms:issued'] && epub['dcterms:issued'][0]._,
    authors: creators,
    subjects,
  };
};
