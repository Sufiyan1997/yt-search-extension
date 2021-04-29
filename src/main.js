import axios from 'axios';
import {buildIndex} from './indexing';
import {search} from './search';

async function readDocsFromURL(url) {
    const resp = await axios.get(url, {responseType: 'document'});
    const textElements = resp.data.querySelectorAll('text');
    let docs = [];
    for (let textElement of textElements) {
        docs.push({
            text: textElement.textContent,
            start: textElement.getAttribute("start"),
            dur: textElement.getAttribute("dur"),
        });
    }
    return docs;
}

(async () => {
    const docs = await readDocsFromURL("https://video.google.com/timedtext?lang=en&v=AJ38l6DX4f8");
    let index = buildIndex(docs);
    let query = "hearing mother";
    const searchResults = search(query, index);

    console.log(docs[searchResults[0]]);
    console.log(docs);

})();