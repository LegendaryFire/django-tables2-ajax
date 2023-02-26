function replace_links(url, div_name, elements) {
    for (let x = 0; x < elements.length; x++) {
        const links = elements[x].getElementsByTagName('A');
        for (let y = 0; y < links.length; y++) {
            let new_querystring = links[y].getAttribute('href');
            links[y].onclick = function(e) {
                e.preventDefault();
                update(new_querystring, div_name, url);
            };
        }
    }
};

function update(querystring, div_name, url, search = '') {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE ) {
            if (xhr.status == 200) {
                var div = document.getElementById(div_name);
                div.innerHTML = xhr.responseText;

                replace_links(url, div_name, div.getElementsByTagName('TH'));
                replace_links(url, div_name, div.getElementsByClassName('pagination'));
            }
        }
    };

    if (search.value != "") {
        // Now we've established we need to append a parameter. We must determine if this is the first parameter or not.
        if (querystring == "") {
            // This is the first parameter.
            querystring += "?search=" + search;
        } else {
            // This is not the first parameter.
            querystring += "&search=" + search;
        }
    }

    const searchbar = document.getElementById(div_name + "_search");
    if (searchbar !== null) { // If the search bar exists, utilize it.
        const decoded = decodeParameters(querystring);
        decoded["search"] = searchbar.value;
        querystring = encodeParameters(decoded);
    }

    xhr.open('GET', url + querystring, true);
    xhr.send();
}

function encodeParameters(params) {
    let first = true;
    let result = '';
    for (const [key, value] of Object.entries(params)) {
        if (first == true) {
            first = false;
            result += "?" + key + "=" + value;
        } else {
            result += "&" + key + "=" + value;
        }
    }
    return result;
}

function decodeParameters(params) {
    const results = {};
    params = params.substring(1).split('&'); // Remove the first character, which should be '?'.
    for (let i = 0; i < params.length; i++) {
        let temp = params[i].split('=');
        results[temp[0]] = temp[1];
    }
    return results;
}