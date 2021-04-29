import {tokenize} from './indexing';
function search(query, index) {
    let queryTokens = tokenize(query);

    // If there is a token in query that does not exist in index then no docs match
    const anyMissingToken = queryTokens.some((queryToken) => !index.has(queryToken));
    if (anyMissingToken) {
        return [];
    }
    
    let postingLists = queryTokens.map((queryToken) => index.get(queryToken));
    
    return intersectPostingLists(postingLists);
}

function intersectPostingLists(postingLists) {

    if (postingLists.length == 0) {
        return [];
    }
    
    let ans = postingLists[0];
    for (let i = 1; i < postingLists.length; i++) {
        ans = intersectTwoPostingLists(ans, postingLists[i]);
    }

    return Array.from(ans.keys());
}

function intersectTwoPostingLists(postingListForToken1, postingListForToken2) {
    let docsWithToken1 = Array.from(postingListForToken1.keys()), docsWithToken2 = Array.from(postingListForToken2.keys());
    let i = 0, j = 0;
    let ans = new Map();
    
    while(i < docsWithToken1.length && j < docsWithToken2.length) {
        if (docsWithToken1[i] == docsWithToken2[j]) { // Check a given doc contains both tokens

            // If a given doc contains both tokens then,
            // check that distance between occurance of token1 and token2 is less than thresold
            if (checkOccuranceDistanceIsCompatible(
                postingListForToken1.get(docsWithToken1[i]), 
                postingListForToken2.get(docsWithToken2[j])
                )) {
                ans.set(docsWithToken2[j], postingListForToken2.get(docsWithToken2[j]));
            }
            i++;
            j++;
        }
        else if (docsWithToken1[i] < docsWithToken2[j]) {
            i++;
        }
        else {
            j++;
        }
    }

    return ans;
}

// Is there a pair (p1, p2) such that p1 belongs to arr1 and p2 belongs to arr2,
// and distance between p1 and p2 is less than thresold
// Note: arr1 and arr2 are sorted
function checkOccuranceDistanceIsCompatible(arr1, arr2) {

    if (arr1.length == 0 || arr2.length == 0) return false;
    
    let i = 0, j = 0;

    while (i < arr1.length) {
        while (j < arr2.length && arr1[i] > arr2[j]) {
            j++;
        }

        if (j < arr2.length && (arr2[j] - arr1[i]) <= 3) {
            return true;
        }
        i++;
    }

    return false;
}

export {search};

