const expect = require('chai').expect;
const { md5sum, cleanURL, readJSONFile } = require('../helpers.js')

describe("the md5sum function", function() {

    it("should calculate md5sum", function() {
        const googleHash = md5sum('http://google.com');
        const yahooHash = md5sum('http://yahoo.com');
        const superLongURLHash = md5sum('http://foobarbazfoobarbazfoobarbazfoobarbazfoobarbaz.net?q=xyz&y=pqr');

        expect(googleHash).to.equal('c7b920f57e553df2bb68272f61570210');
        expect(yahooHash).to.equal('873c87c71f8bf1d15a53ce0c0676971f');
        expect(superLongURLHash).to.equal('2eabd3d672470dbe434c709545471f0c');
    });
});

describe("the cleanURL function", function() {

    it("should handle empty/null/undefined strings", function() {
        const emptyResult = cleanURL('');
        const nullResult = cleanURL(null);
        const undefinedResult = cleanURL(undefined);

        expect(emptyResult).to.equal(undefined);
        expect(nullResult).to.equal(undefined);
        expect(undefinedResult).to.equal(undefined);
    });

    it("should trim whitespaces from strings", function() {
        const googleHash = cleanURL('   http://google.com          ');
        const yahooHash = cleanURL('http://yahoo.com      ');
        const superLongURLHash = cleanURL('        http://foobarbazfoobarbazfoobarbazfoobarbazfoobarbaz.net?q=xyz&y=pqr');

        expect(googleHash).to.equal('http://google.com');
        expect(yahooHash).to.equal('http://yahoo.com');
        expect(superLongURLHash).to.equal('http://foobarbazfoobarbazfoobarbazfoobarbazfoobarbaz.net?q=xyz&y=pqr');
    });

    it("should handle objects other than strings", function() {
        const numberResult = cleanURL(777);
        const boolTrueResult = cleanURL(true);
        const boolFalseResult = cleanURL(false);
        const jsonResult = cleanURL({'name': 'Foo', 'x': [1, 2, 3]});

        expect(numberResult).to.equal(undefined);
        expect(boolTrueResult).to.equal(undefined);
        expect(boolFalseResult).to.equal(undefined);
        expect(jsonResult).to.equal(undefined);
    });
});

// TODO
describe("the readJSONFile function", function() {

    it("should open a valid file", async function() {
        const data = await readJSONFile('./urls.json');
    });
});
