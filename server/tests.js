let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

var US_IP = '99.77.111.132';
var COUNTRY = 'Argentina';

var FAIL_IP = '127.0.0.1';
var FAIL_COUNTRY = 'Asia';

chai.expect(true).to.equal(true);

// Success cases

describe('/get-country/:ip', () => {
  it('it should GET the origin country of a given ipv4 address', (done) => {
      chai.request(server)
      .get('/get-country/' + US_IP)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.be.eql("success");
        res.body.data.country_name.should.be.eql("United States");
        done();
      });
  });
});

describe('/local-result/:country', () => {
  it('it should GET the detailed big mac information about given country', (done) => {
    chai.request(server)
    .get('/local-result/' + COUNTRY)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.status.should.be.eql("success");
      res.body.payload.Country.should.be.eql(COUNTRY);
      done();
    });
  }); 
});

describe('/random-result/:country', () => {
  it('it should GET the detailed big mac information about a given country and a different random country', (done) => {
    chai.request(server)
    .get('/random-result/' + COUNTRY)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.status.should.be.eql("success");
      res.body.payload.country_result.Country.should.be.eql(COUNTRY);
      res.body.payload.random_result.Country.should.not.eql(COUNTRY);
      done();
    });
  });
});

// Fail cases

describe('FAIL CASE: /get-country/:ip', () => {
  it('it should fail with a 400, and error message "Second parameter is incorrect"', (done) => {
    chai.request(server)
    .get('/get-country/' + FAIL_IP)
    .end((err, res) => {
      res.should.have.status(400);
      res.body.status.should.be.eql("error");
      res.body.errors[0].message.should.be.eql("Second parameter is incorrect");
      done();
    });
  });
});

describe('FAIL CASE: /local-result/:country', () => {
  it('it should fail with a 404, and error message "Unable to find record for specified country"', (done) => {
    chai.request(server)
    .get('/local-result/' + FAIL_COUNTRY)
    .end((err, res) => {
      res.should.have.status(404);
      res.body.status.should.be.eql("error");
      res.body.message.should.be.eql("Unable to find record for specified country");
      done();
    });
  }); 
});

describe('FAIL CASE: /random-result/:country', () => {
  it('it should fail with a 404, and error message "Unable to find record for specified country"', (done) => {
    chai.request(server)
    .get('/random-result/' + FAIL_COUNTRY)
    .end((err, res) => {
      res.should.have.status(404);
      res.body.status.should.be.eql("error");
      res.body.message.should.be.eql("Unable to find record for specified country");
      done();
    });
  });
});
