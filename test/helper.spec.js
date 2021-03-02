const expect = require('chai').expect;
const { md5sum, cleanString, readJSONFile, getURL, writeURL, incrementCounter, readCounter } = require('../helpers.js')

describe('the md5sum function', function() {

    it('should calculate md5sum', function() {
        const googleHash = md5sum('http://google.com');
        expect(googleHash).to.equal('c7b920f57e553df2bb68272f61570210');

        const yahooHash = md5sum('http://yahoo.com');
        expect(yahooHash).to.equal('873c87c71f8bf1d15a53ce0c0676971f');

        const superLongURLHash = md5sum('http://foobarbazfoobarbazfoobarbazfoobarbazfoobarbaz.net?q=xyz&y=pqr');
        expect(superLongURLHash).to.equal('2eabd3d672470dbe434c709545471f0c');
    });
});

describe('the cleanString function', function() {

    it('should handle empty/null/undefined strings', function() {
        const emptyResult = cleanString('');
        expect(emptyResult).to.be.undefined;

        const nullResult = cleanString(null);
        expect(nullResult).to.be.undefined;

        const undefinedResult = cleanString(undefined);
        expect(undefinedResult).to.be.undefined;
    });

    it('should trim whitespaces from strings', function() {
        const googleHash = cleanString('   http://google.com          ');
        expect(googleHash).to.equal('http://google.com');

        const yahooHash = cleanString('http://yahoo.com      ');
        expect(yahooHash).to.equal('http://yahoo.com');

        const superLongURLHash = cleanString('        http://foobarbazfoobarbazfoobarbazfoobarbazfoobarbaz.net?q=xyz&y=pqr');
        expect(superLongURLHash).to.equal('http://foobarbazfoobarbazfoobarbazfoobarbazfoobarbaz.net?q=xyz&y=pqr');
    });

    it('should handle objects other than strings', function() {
        const numberResult = cleanString(777);
        expect(numberResult).to.be.undefined;

        const nullResult = cleanString(null);
        expect(nullResult).to.be.undefined;

        const boolTrueResult = cleanString(true);
        expect(boolTrueResult).to.be.undefined;

        const boolFalseResult = cleanString(false);
        expect(boolFalseResult).to.be.undefined;

        const jsonResult = cleanString({'name': 'Foo', 'x': [1, 2, 3]});
        expect(jsonResult).to.be.undefined;
    });
});

// TODO
// describe('the readJSONFile function', function() {
//     it('should open a valid file', function() {

//     });

//     it('should handle invalid file path', function() {

//     });

//     it('should handle non-JSON files', function() {

//     });

//     // should recursively remove ../
//     it('should handle directory traversal', function() {

//     });
// });

describe('the getURL function', function() {

    it('should return a object given a valid hash', async function() {
        const googleHash = await getURL('c7b920f57e553df2bb68272f61570210');
        expect(googleHash).to.have.property('url');
    });

    it('should return error given an invalid hash', async function() {
        const nullHash = await getURL(null);
        expect(nullHash).to.have.property('error');

        const undefinedHash = await getURL(undefined);
        expect(undefinedHash).to.have.property('error');

        const emptyHash = await getURL('');
        expect(emptyHash).to.have.property('error');

        const emptySpacesHash = await getURL('          ');
        expect(emptySpacesHash).to.have.property('error');
    });
});

describe('the writeURL function', function() {

    it('should return undefined given undefined/null/empty (hash, url)', async function() {
        let result;

        result = await writeURL('', 'https://foo.bar');
        expect(result).to.be.undefined;

        result = await writeURL(123, 'https://foo.bar');
        expect(result).to.be.undefined;

        result = await writeURL([1, 2, 3], 'https://foo.bar');
        expect(result).to.be.undefined;

        result = await writeURL(null, 'https://foo.bar');
        expect(result).to.be.undefined;

        result = await writeURL(undefined, 'https://foo.bar');
        expect(result).to.be.undefined;

        result = await writeURL('somevalidhash', '');
        expect(result).to.be.undefined;

        result = await writeURL('somevalidhash', 123);
        expect(result).to.be.undefined;

        result = await writeURL('somevalidhash', [1, 2, 3]);
        expect(result).to.be.undefined;

        result = await writeURL('somevalidhash', null);
        expect(result).to.be.undefined;

        result = await writeURL('somevalidhash', undefined);
        expect(result).to.be.undefined;

        result = await writeURL('somevalidhash');
        expect(result).to.be.undefined;
    });
});

// returns {md5HashHere: counter} if hash valid.
// returns {'error': 'invalid hash.'} on if hash not valid.
describe('the incrementCounter function', function () {
    it('should increment the counter given a valid hash', async function () {

        let countBeforeIncrement, countAfterIncrement;

        const googleHash = 'c7b920f57e553df2bb68272f61570210';
        countBeforeIncrement = await readCounter(googleHash);
        await incrementCounter(googleHash);
        countAfterIncrement = await readCounter(googleHash);
        expect(countAfterIncrement - countBeforeIncrement).to.be.equal(1);


        const bingHash = '  960976b20dfa5a06f9d1390be46e1858   ';
        countBeforeIncrement = await readCounter(bingHash);
        await incrementCounter(bingHash);
        countAfterIncrement = await readCounter(bingHash);
        expect(countAfterIncrement - countBeforeIncrement).to.be.equal(1);


        const yahooHash = '      873c87c71f8bf1d15a53ce0c0676971f';
        countBeforeIncrement = await readCounter(yahooHash);
        await incrementCounter(yahooHash);
        countAfterIncrement = await readCounter(yahooHash);
        expect(countAfterIncrement - countBeforeIncrement).to.be.equal(1);
    });

    it('should return error if hash not valid', async function () {
        const doesnotexistCounter = await incrementCounter('thishashdoesnotexist');
        expect(doesnotexistCounter).to.have.property('error');

        const invalidTypeCounter1 = await incrementCounter(666);
        expect(invalidTypeCounter1).to.have.property('error');

        const invalidTypeCounter2 = await incrementCounter(null);
        expect(invalidTypeCounter2).to.have.property('error');

        const invalidTypeCounter3 = await incrementCounter(undefined);
        expect(invalidTypeCounter3).to.have.property('error');

        const invalidTypeCounter4 = await incrementCounter([1, 2, 3]);
        expect(invalidTypeCounter4).to.have.property('error');

        const invalidTypeCounter5 = await incrementCounter({'name': 'xyz', 'x': [4, 5, 6]});
        expect(invalidTypeCounter5).to.have.property('error');

        const invalidTypeCounter6 = await incrementCounter();
        expect(invalidTypeCounter6).to.have.property('error');
    });
});
