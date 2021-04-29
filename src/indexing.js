function buildIndex(docs) {
    let index = new Map();
    for (let i = 0; i < docs.length; ++i) {
        addDocToIndex(index, docs[i], i);
    }
    return index;
}

function addDocToIndex(index, doc, docId) {
    let tokens = tokenize(doc.text);
    for (let i = 0; i < tokens.length; ++i) {
        let token = tokens[i];
        let docToPositionsMap = null;
        if (index.has(token)) {
            docToPositionsMap = index.get(token);
        }
        else {
            docToPositionsMap = new Map();
            index.set(token, docToPositionsMap);
        }
        if (docToPositionsMap.has(docId)) {
            docToPositionsMap.get(docId).push(i);
        }
        else {
            docToPositionsMap.set(docId, [i]);
        }
    }
}

function tokenize(doc) {
    doc = doc.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    doc = doc.toLowerCase();
    return doc.split(/\s+/);
}

export {tokenize, buildIndex};