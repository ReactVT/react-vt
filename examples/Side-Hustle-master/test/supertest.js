const request = require('supertest');
const app = require('../server/server');
const expect = require('chai').expect;
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const HOST = `http://localhost:${PORT}`;
const formController = require('../controller/formController');
const Form = require('../model/formModel');

describe('Routing and Integration Tests', () => {
  describe('/', () => {
    describe('GET', () => {
      it('responds with 200 status', (done) => {
        request(HOST)
          .get('/api')
          .then( response => {
            // console.log(response.body)
            done();
          });
      });
    });
  });
  describe('Controller Tests', () => {
    describe('formController', () => {
      before((done) => {
        mongoose.connection.db.dropDatabase(() => {
        console.log('Cleaning - test database dropped');
        });
      return done();
      });
      it ('should reject invalid data with 400 status', (done) => {
        const badReq = {
          notAJob: 'not real data',
        };
        request(HOST)
          .post('/post')
          .send(badReq)
          .expect(400, done);
      });
      it ('should accept valid data and return 200 status with saved object', (done) => {
        const goodReq = {
          title: 'new job',
          description: '100k per year, must have 20 yrs experience',
          address: '5300 Beethoven St',
          pay: 10000,
        };
        request(HOST)
          .post('/post')
          .send(goodReq)
          .expect((res) => {
            expect(res.body).to.include(goodReq);
          })
          .expect(200, done);
      });
      it('should respond to API request with all listings', (done) => {
        const anotherReq = {
          title: 'new job2',
          description: '100k per year, must have 20 yrs experience',
          address: '5300 Beethoven St',
          pay: 12000,
        };
        request(HOST)
          .post('/post')
          .send(anotherReq)
          .then(() => {
            request(HOST)
              .get('/api')
              .expect((res) => {
                expect(res.body.length).to.eq(2);
              })
              .expect(200, done);
          });
      });
      
      after(() => {
        mongoose.connection.close(() => {
          console.log('Test database connection closed');
        });
      });
    });
  });
});
