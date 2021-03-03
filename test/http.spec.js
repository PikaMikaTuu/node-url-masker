const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../app.js');

const { md5sum } = require('../helpers.js');

chai.use(chaiHttp);

// our parent block
describe('URL Masker App', function () {

    describe('/GET mask', function () {
        it('should return a masked URL', function (done) {
            let url = '   http://wikipedia.com     ';
            let hash = 'd5b1cb4a2fe7a7b9d7f438b3223db2db';

            chai.request(app)
                .get(`/mask?url=${url}`)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('md5');
                    expect(res.body['md5']).to.be.equal(hash);
                    done();
                });
        });

        it('should return error when URL is empty', function (done) {
            let url = '';

            chai.request(app)
                .get(`/mask?url=${url}`)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('error');
                    done();
                });
        });

        it('should return error when URL is only whitespaces', function (done) {
            let url = '            ';

            chai.request(app)
                .get(`/mask?url=${url}`)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('error');
                    done();
                });
        });
    });

    describe('/GET unmask', function () {

        it('should return success if URL exist', function (done) {
            let hash = 'd5b1cb4a2fe7a7b9d7f438b3223db2db';
            chai.request(app)
                .get(`/unmask?hash=${hash}`)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res.body).to.have.property('success');
                    done();
                });
        });

        it('should return error if URL does not exist', function (done) {
            let hash = 'thisdoesnotexist';
            chai.request(app)
                .get(`/unmask?hash=${hash}`)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res.body).to.have.property('error');
                    done();
                });
        });
    });

});

