const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {

  it('should return the homepage', (done) => {
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        response.res.text.should.include('AmazonBay');
        done();
      });
  });

  it('should return a 404 for route that does not exist', (done) => {
    chai.request(server)
      .get('/shenanigans')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
  });
});
