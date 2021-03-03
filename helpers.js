const crypto = require('crypto');
const fs = require('fs').promises;
const DATABASE = './urls.json';

function cleanString(inputString) {

    // returns undefined if
    // inputString is set to empty string / null / undefined / 0 / 00
    // OR
    // typeof inputString is not a string

    if (Boolean(inputString) != true || typeof inputString !== 'string' ) {
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

    const hash = crypto.createHash('md5').update(`${url}`).digest('hex');
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
        return { error: 'hash / url check failed in helpers/writeURL()' };

    // console.log(`Writing: ${hash}: ${url}`);

    let data = await readJSONFile(DATABASE);
    data[hash] = { url: url, counter: 0 };

    await fs.writeFile(DATABASE, JSON.stringify(data));
    return { md5: hash };
}

async function getURL(hash) {
    hash = cleanString(hash);

    if (!hash) {
        return await {error: 'Invalid hash'};
    }

    let data = await readJSONFile(DATABASE);
    const url = data[hash];

    if (!url) {
        return await {error: 'URL Does Not Exist'};
    }

    incrementCounter(hash);
    return { success: url };
}

async function readCounter(hash) {
    hash = cleanString(hash);

    if (!hash) {
        return await {error: 'Invalid hash'};
    }

    const data = await readJSONFile(DATABASE);
    return data[hash]['counter'];
}

async function incrementCounter(hash) {

    hash = await cleanString(hash);

    if (!hash) {
        return { error: 'Invalid hash.' };
    }

    let data = await readJSONFile(DATABASE);

    if (hash in data) {
        data[hash]['counter'] += 1;
        await fs.writeFile(DATABASE, JSON.stringify(data));
        return { hash: data[hash]['counter'] }
    } else {
        return { error: 'Invalid hash.' };
    }
}

module.exports = { cleanString, md5sum, readJSONFile, writeURL, getURL, readCounter, incrementCounter }
