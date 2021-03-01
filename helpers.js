const crypto = require('crypto');
const fs = require('fs').promises;
const DATABASE = './urls.json';

function cleanURL(url) {

    // returns undefined if
    // url is set to empty string / null / undefined / 0 / 00
    // OR
    // typeof url is not a string

    if (Boolean(url) != true || typeof url !== "string" ) {
        return undefined;
    }

    // Trim whitespaces
    url = url.trim();
    return url;
}

function md5sum(url) {
    url = cleanURL(url);

    // if not a valid URL
    if (!url)
        return undefined;

    const hash = crypto.createHash('md5').update(`${url}`).digest("hex");
    return hash;
}

// TODO
function ifFileValidJSON(filePath) {
    if (fs.existsSync(filePath)) {
        return true;
    }
    return false;
}

async function readJSONFile(filePath) {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data.toString());
}

async function writeURL(hash, url) {
    console.log(`Writing: ${hash}: ${url}`);

    let data = await readJSONFile(DATABASE);
    console.log(data);
    data[hash] = url;

    await fs.writeFile(DATABASE, JSON.stringify(data));
    return {md5: hash};
}

async function getURL(hash) {
    console.log(`Getting: ${hash}`);
    let data = await readJSONFile(DATABASE);
    const url = data[hash];
    return {url: url};
}

module.exports = {
    cleanURL: cleanURL,
    md5sum: md5sum,
    readJSONFile: readJSONFile,
    writeURL: writeURL,
    getURL: getURL
}
