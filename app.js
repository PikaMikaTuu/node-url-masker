const express = require('express');
const urlHelper = require('./helpers');

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/mask', async (req, res) => {
    const url = req.query.url;

    // calculate md5sum
    const hash = await urlHelper.md5sum(url);

    // write to JSON
    let response = await urlHelper.writeURL(hash, url);
    res.json(response);
});

app.get('/unmask', async (req, res) => {
    const hash = req.query.hash;

    // return matching url
    let response = await urlHelper.getURL(hash);
    res.json(response);
});

app.listen('8080', () => {
    console.log(`Listening on port ${PORT}`);
})
