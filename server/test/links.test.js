const mongoose = require('mongoose');
const mocha = require('mocha');
const { Links } = require('../models/LinksSchema');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../server');
const { beforeEach, it } = require('mocha');

chai.use(chaiHttp);

describe('Links', () => {
  beforeEach((done) => {
    Links.remove({}, () => {
      done();
    });
  });

  describe('/POST shorten_url', () => {
    it('it should create shorten url', (done) => {
      let links = {
        long_url: 'google.com',
      };
      chai
        .request(server)
        .post('/shorten_url')
        .send(links)
        .end((_error, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('long_url').eql(links.long_url);
          done();
        });
    });

    it('handle empty long_url', (done) => {
      let links = {
        long_url: '',
      };

      chai
        .request(server)
        .post('/shorten_url')
        .send(links)
        .end((_error, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('error').eql('Input cannot be empty');
          done();
        });
    });
  });

  describe('/GET links', () => {
    it('it should get all links, qr, time, clicked times', (done) => {
      let links = new Links({
        _id: '5991531a-5173-4fa8-8d1f-448339bdb267',
        long_url: 'google.com',
        short_url: `${process.env.REACT_APP_API_HOST}/r/5991531a-5173-4fa8-8d1f-448339bdb267`,
        created_at: '1/15/2023, 8:26:23 AM',
        clicked: 1,
      });

      links.save((error, link) => {
        if (error) {
          throw error;
        }
        chai
          .request(server)
          .get('/links')
          .end((_error, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('result').with.lengthOf(1);
            response.body.result[0].should.have.property('id').eql(link.id);
            response.body.result[0].should.have.property('long_url').eql(link.long_url);
            response.body.result[0].should.have.property('short_url').eql(link.short_url);
            response.body.result[0].should.have.property('created_at').eql('2023-01-15 07:26:23');
            response.body.result[0].should.have.property('clicked').eql(0);
            done();
          });
      });
    });
  });

  describe('/DELETE links', () => {
    it('it should delete everything', (done) => {
      let links = new Links({
        id: '5991531a-5173-4fa8-8d1f-448339bdb267',
        long_url: 'google.com',
      });

      links.save((_error, _link) => {
        chai
          .request(server)
          .delete('/clear')
          .end((_error, response) => {
            response.should.have.status(200);
            response.body.should.be.a('string');
            done();
          });
      });
    });
  });
});
