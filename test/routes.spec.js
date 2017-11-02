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

describe('API Routes', () => {

  before((done) => {
    database.migrate.latest()
      .then(() => done())
      .catch((error) => console.log(error));
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch((error) => console.log(error));
  });

  describe('GET /api/v1/inventory', () => {
    it('should retrieve all items in inventory', (done) => {
      chai.request(server)
        .get('/api/v1/inventory')
        .end( (error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(6);
          response.body.forEach(elem => {
            elem.should.have.property('id');
            elem.should.have.property('item_name');
            elem.should.have.property('item_description');
            elem.should.have.property('item_image');
            elem.should.have.property('item_price');
            elem.should.have.property('created_at');
            elem.should.have.property('updated_at');
          });
          done();
        });
    });
  });

  describe('GET /api/v1/order_history', () => {
    it('should retrieve all purchases in order history', (done) => {
      chai.request(server)
        .get('/api/v1/order_history')
        .end( (error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          response.body.forEach(elem => {
            elem.should.have.property('id');
            elem.should.have.property('order_total');
            elem.should.have.property('created_at');
            elem.should.have.property('updated_at');
          });
          done();
        });
    });
  });

  describe('POST /api/v1/order_history', () => {
    it('should add another order to the order history', (done) => {
      chai.request(server)
        .post('/api/v1/order_history')
        .send({ order_total: 999.99 })
        .end( (error, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('order_total');
          response.body[0].should.have.property('created_at');
          response.body[0].should.have.property('updated_at');

          chai.request(server)
            .get('/api/v1/order_history')
            .end( (error, response) => {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('array');
              response.body.length.should.equal(4);
              done();
            });
        });
    });

    it('should not add an order if incorrect parameter passed in', (done) => {
      chai.request(server)
        .post('/api/v1/order_history')
        .send({ order: 555.55 })
        .end( (error, response) => {
          response.should.have.status(422);
          response.should.be.json;
          response.body.error.should.equal('Expected format: { order_total: <Decimal> } You\'re missing a the order_total property.');

          chai.request(server)
            .get('/api/v1/order_history')
            .end( (error, response) => {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('array');
              response.body.length.should.equal(3);
              done();
            });
        });
    });
  });


});
