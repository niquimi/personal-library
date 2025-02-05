/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Test Book' })
          .end(function(err, res) {
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'title', 'Book should contain title');
            assert.property(res.body, '_id', 'Book should contain _id');
            done();
          });
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function(err, res) {
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });

    });

    suite('GET /api/books => array of books', function() {

      test('Test GET /api/books', function(done) {
        chai.request(server)
          .get('/api/books')
          .end(function(err, res) {
            assert.isArray(res.body, 'response should be an array');
            if (res.body.length > 0) {
              assert.property(res.body[0], '_id', 'Books should contain _id');
              assert.property(res.body[0], 'title', 'Books should contain title');
              assert.property(res.body[0], 'commentcount', 'Books should contain commentcount');
            }
            done();
          });
      });

    });

    suite('GET /api/books/[id] => book object with [id]', function() {

      test('Test GET /api/books/[id] with id not in db', function(done) {
        chai.request(server)
          .get('/api/books/invalidid123')
          .end(function(err, res) {
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Test Book for GET by ID' })
          .end(function(err, res) {
            const id = res.body._id;
            chai.request(server)
              .get(`/api/books/${id}`)
              .end(function(err, res) {
                assert.isObject(res.body, 'response should be an object');
                assert.property(res.body, '_id', 'Book should contain _id');
                assert.property(res.body, 'title', 'Book should contain title');
                assert.property(res.body, 'comments', 'Book should contain comments array');
                done();
              });
          });
      });

    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function() {

      test('Test POST /api/books/[id] with comment', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Test Book for Comments' })
          .end(function(err, res) {
            const id = res.body._id;
            chai.request(server)
              .post(`/api/books/${id}`)
              .send({ comment: 'Test comment' })
              .end(function(err, res) {
                assert.isObject(res.body, 'response should be an object');
                assert.property(res.body, '_id', 'Book should contain _id');
                assert.property(res.body, 'title', 'Book should contain title');
                assert.property(res.body, 'comments', 'Book should contain comments array');
                assert.include(res.body.comments, 'Test comment', 'Comments array should include the new comment');
                done();
              });
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Test Book for Missing Comment' })
          .end(function(err, res) {
            const id = res.body._id;
            chai.request(server)
              .post(`/api/books/${id}`)
              .send({})
              .end(function(err, res) {
                assert.equal(res.text, 'missing required field comment');
                done();
              });
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done) {
        chai.request(server)
          .post('/api/books/invalidid123')
          .send({ comment: 'Test comment' })
          .end(function(err, res) {
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Test Book for Deletion' })
          .end(function(err, res) {
            const id = res.body._id;
            chai.request(server)
              .delete(`/api/books/${id}`)
              .end(function(err, res) {
                assert.equal(res.text, 'delete successful');
                done();
              });
          });
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done) {
        chai.request(server)
          .delete('/api/books/invalidid123')
          .end(function(err, res) {
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

  });

});
