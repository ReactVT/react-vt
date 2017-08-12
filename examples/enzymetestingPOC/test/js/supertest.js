const request = require('supertest');
// Start server
const app = require('../../');
const fs = require('fs');
const expect = require('expect');
const PORT = process.env.PORT || 3000;
const HOST = `http://localhost:${PORT}`;
const db = require('../../server/db/games.js');
/**
* include an assertion library here so that you can make assertions other than those
* provided by supertest. Choose whichever assertion library suits you.
*/
// const expect = require('expect');
// const expect = require('chai').expect;
// const assert = require('chai').assert;

describe('Route integration', () => {
  describe('/', () => {
    describe('GET', () => {
      it('responds with 200 status and text/html content type', done => {
        request(HOST)
          .get('/')
          .expect('Content-Type', /text\/html/)
          .expect(200, done);
      });
    });
  });

  describe('/games', () => {
    describe('GET', () => {
      it('response with 200 status and application/json content type', done => {
        // request '/games'
        // expect status 200
        // expect content to equal app json
        request (HOST)
          .get('/games')
          .expect('Content-Type', /application\/json/)
          .expect(200, done);
     });

      it('games from appropriate json file in server/db/ are in body of response', done => {
        // You'll need to inspect the body of the response and ensure it contains the games list.
        // Might need to read the games json file in first to make sure the games in the response
        // match the games in the database.

        // Read gamelist from json
        // do a get request to games
        // Compare body of response to the our json
        db.create({winner: 'X'});
        db.create({winner: 'O'});
        db.create({winner: 'O'});
        const gamesList = db.find().slice();
        request (HOST)
          .get('/games')
          .then(response => {
            expect(response.body).toEqual(gamesList);
            done();
          });
      });
    });

    describe('POST', () => {
      it('responds to valid request with 200 status and application/json content type', done => {
        request (HOST)
          .post('/games')
          .send({ winner: 'X' })
          .expect('Content-Type', /application\/json/)
          .expect(200, done);
      });

      it('responds to a valid request with the item that was created in the DB', done => {
        // Hint: inspect the response body and make sure it contains the winner, createdAt, and
        // id fields.
        
        // post req
        request(HOST)
          .post('/games')
          .send({ winner: 'O' })
          .then( response => {
            // check body of response - verify that winner, created_at , and id fields are the same
            expect(response.body.winner).toEqual('O');
            expect(response.body.id).toEqual(4);
            expect(response.body.createdAt).toExist();
            done();
          });
      });

      it('responds to invalid request with 400 status and error message in body', done => {
        // This feature does not exist yet. Follow test-driven-development here! See description
        // in readme.
        // Hint: An invalid request is a POST request in which the POST body does not contain
        // a JSON object with a "winner" key, or if the body contains fields other than "winner"

        // 3 requests
        // 1. no winner field/empty req
        request(HOST)
          .post('/games')
          .send({}) 
          .then( res => {
            expect(res.status).toEqual(400);
            expect(res.body.error).toEqual('Must send winner.');
            // 2. with a winner field and extra key
            request(HOST)
              .post('/games')
              .send({ winner: 'X', extraKey: 'key' })
              .then( res => {
                console.log('status for winner and extra key ', res.status)
                expect(res.status).toEqual(400);
                expect(res.body.error).toEqual('Invalid request');
                // 3. with one field that is not winner
                request(HOST)
                  .post('/games')
                  .send({ notWinner: 'wiener' })
                  .then( res => {
                    expect(res.status).toEqual(400);
                    expect(res.body.error).toEqual('Must send winner.');
                    done();
                  });
              });
          });
      });
    });
  });
});
