const crypto = require('crypto');
const fs = require('fs').promises;
const DATABASE = './urls.json';

function md5sum(url) {
    const hash = crypto.createHash('md5').update(`${url}`).digest("hex");
    return hash;
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
    getURL: getURL,
    writeURL: writeURL,
    md5sum: md5sum
}
