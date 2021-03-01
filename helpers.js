const crypto = require('crypto');
const fs = require('fs').promises;
const DATABASE = './urls.json';

function cleanString(inputString) {

    // returns undefined if
    // inputString is set to empty string / null / undefined / 0 / 00
    // OR
    // typeof inputString is not a string

    if (Boolean(inputString) != true || typeof inputString !== "string" ) {
        return undefined;
    }

    // Trim whitespaces
    inputString = inputString.trim();
    return inputString;
}

function md5sum(url) {
    url = cleanString(url);

    // if not a valid URL
    if (!url)
        return undefined;

    const hash = crypto.createHash('md5').update(`${url}`).digest("hex");
    return hash;
}

async function readJSONFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data.toString());
    }
    catch (err) {
        console.log('helpers.js: error in readJSONFile.', err);
    }
}

async function writeURL(hash, url) {
    url = cleanString(url);
    hash = cleanString(hash);

    // if not a valid URL or hash
    if (!url || !hash)
        return undefined;

    console.log(`Writing: ${hash}: ${url}`);

    let data = await readJSONFile(DATABASE);
    console.log(data);
    data[hash] = url;

    await fs.writeFile(DATABASE, JSON.stringify(data));
    return {md5: hash};
}

async function getURL(hash) {
    hash = cleanString(hash);

    // if not a valid hash
    if (!hash)
        return undefined;

    console.log(`Getting: ${hash}`);
    let data = await readJSONFile(DATABASE);
    const url = data[hash];
    return {url: url};
}

module.exports = {
    cleanString: cleanString,
    md5sum: md5sum,
    readJSONFile: readJSONFile,
    writeURL: writeURL,
    getURL: getURL
}
