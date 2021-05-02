import axios from 'axios';
import {buildIndex} from './indexing';
import {search} from './search';

let index = null;
let docs = null;

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

function displayResults(results) {
    let resultListElem = document.getElementById("resultList");
    resultListElem.innerHTML = "";
    for (let result of results) {
        let li = document.createElement("li");
        li.innerHTML = docs[result].text;
        resultListElem.appendChild(li);
    }
}

(async () => {
    docs = await readDocsFromURL("https://video.google.com/timedtext?lang=en&v=AJ38l6DX4f8");
    index = buildIndex(docs);
})();

document.addEventListener("DOMContentLoaded", function(){
    let searchBtn = document.getElementById("searchBtn");
    let searchBox = document.getElementById("searchBox");

    searchBtn.addEventListener("click", function () {

        // TODO: Display proper error
        if (!index) return;

        let results = search(searchBox.value, index);
        displayResults(results);
    });
});
