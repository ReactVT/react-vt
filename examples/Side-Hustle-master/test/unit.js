const expect = require('chai').expect;
const mongoose = require('mongoose');
const Form = require('../model/formModel');
const formController = require('../controller/formController');
// const db = require('../server/server.js');

// test model validation
describe('Model', () => {
  describe('form', () => {
    // model validation
    it ('should be rejected if the title is empty', (done) => {
      const form = new Form();
      form.validate((err) => {
        expect(err.errors.title).to.exist;
        done();
      });
    });
    it ('should be rejected if the description is empty', (done) => {
      const form = new Form();
      form.validate((err) => {
        expect(err.errors.description).to.exist;
        done();
      });
    });
    it ('should be rejected if the address is empty', (done) => {
      const form = new Form();
      form.validate((err) => {
        expect(err.errors.address).to.exist;
        done();
      });
    });
    it ('should be rejected if the pay is empty', (done) => {
      const form = new Form();
      form.validate((err) => {
        expect(err.errors.pay).to.exist;
        done();
      });
    });
    it ('should be accepted if required fields were submitted', (done) => {
      const form = new Form({
        title: 'new job',
        description: '100k per year, must have 20 yrs experience',
        address: '5300 Beethoven St',
        pay: 10000,
      });
      form.validate((err) => {
        expect(err).to.not.exist;
        done();
      });
    });
  });
  // !model validation
  // Test model with mock mongoDB
  // *** Make sure to run mongod before running this subset of tests
  describe('mongoDB', () => {
    before((done) => {
      mongoose.connection.db.dropDatabase(() => {
        console.log('Cleaning - test database dropped');
      });
      return done();
    });
    it ('should reject invalid data', (done) => {
      const badData = new Form({ notTitle: 'not a title' });
      badData.save((err) => {
        // make sure that mongo returns a validation error
        expect(err).to.exist;
        expect(err._message).to.eq('Form validation failed');
        // make sure that mongo does not save any new records
        Form.find({}, (err, docs) => {
          expect(docs.length).to.eq(0);
          done();
        });
      });
    });
    it ('should accept valid data', (done) => {
      const goodData = new Form({ 
        title: 'real title',
        description: 'real description',
        address: 'real address',
        pay: 1,
      });
      goodData.save((err) => {
        expect(err).to.not.exist;
        done();
      });
    });
    it ('should retrieve data from db', (done) => {
      Form.find({}, (err, docs) => {
        expect(docs.length).to.eq(1);
        expect(docs[0]).to.include({
          title: 'real title',
          description: 'real description',
          address: 'real address',
          pay: 1,
        });
        done();
      });
    });
    // after(() => {
    //   mongoose.connection.close(() => {
    //     console.log('Test database connection closed');
    //   });
    // });
  });
  // !Test model with mock mongoDB
});

// Controller test should be part of super test
// describe('Controller', () => {
//   describe('formController', () => {
//     before((done) => {
//       mongoose.connect('mongodb://localhost/testDb');
//       const db = mongoose.connection;
//       db.on('error', console.error.bind(console, 'connection error'));
//       db.once('open', () => {
//         console.log('Connected to test database');
//         mongoose.connection.db.dropDatabase(() => {
//           console.log('Cleaning - test database dropped');
//         });
//         done();
//       });
//     });

//     it ('should reject invalid data with 400 status', async (done) => {
//       const badReq = {
//         body: { title: 'real title',
//           description: 'real description',
//           address: 'real address',
//           pay: 1},
//       };
//       await (formController.createForm(badReq))();
//       Form.find({}, (err, docs) => {
//         console.log(docs);
//         });
//       done();
//     });

//     after(() => {
//       mongoose.connection.close(() => {
//         console.log('Test database connection closed');
//       });
//     });

//   });
// });