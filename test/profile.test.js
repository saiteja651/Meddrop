const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);
const { MongoClient, ObjectId } = require("mongodb");
const {app, doc_reg,jwt,cus_reg,customer_requests,client_appointments} = require('../server/server');


chai.use(chaiHttp);


// Function to generate a valid JWT token for testing
const generateValidToken = (userId) => {
  const payload = {
    user: {
      id: '65bc78f99881eb13651f3efe'
    }
  };
  return jwt.sign(payload, '1234-5678');
};

describe('GET /cus_profile', () => {
  let findOneStub;
  let token;

  beforeEach(() => {
    findOneStub = sinon.stub(cus_reg, 'findOne');
    token = generateValidToken('user_id'); // Generate a valid token for testing
  });

  afterEach(() => {
    findOneStub.restore();
  });

  it('should return customer profile if user exists', async () => {
    const existingUser = { _id: '65bc78f99881eb13651f3efe', name: 'Test User', email: 'test@example.com', pass: 'password' };
    findOneStub.withArgs({ _id: sinon.match.instanceOf(ObjectId) }).resolves(existingUser); // Stub to simulate user exists

    const res = await chai.request(app)
      .get('/cus_profile')
      .set('x-token', token);
    expect(res).to.have.status(200);
    expect(res.body).to.deep.equal(existingUser);
  });

  it('should return "User not found" if user does not exist', async () => {
    findOneStub.withArgs({ _id: sinon.match.instanceOf(ObjectId) }).resolves(null); // Stub to simulate user not found

    const res = await chai.request(app)
      .get('/cus_profile')
      .set('x-token', token);
    expect(res).to.have.status(404);
    expect(res.text).to.equal('User not found');
  });

  it('should return "Internal Server Error" if an error occurs', async () => {
    findOneStub.rejects(new Error('Mocked error')); // Stub to simulate an error

    const res = await chai.request(app)
      .get('/cus_profile')
      .set('x-token', token);

    expect(res).to.have.status(500);
    expect(res.text).to.equal('Internal Server Error');
  });
});
/////for searching doctors --------------------------------->
describe('POST /customer_requests', () => {
    let insertOneStub;
    let token;
    beforeEach(() => {
      insertOneStub = sinon.stub(customer_requests, 'insertOne');
      token = generateValidToken('user_id'); // Generate a valid token for testing
    });
  
    afterEach(() => {
      insertOneStub.restore();
    });
  
    it('should add customer request and return "request received"', async () => {
      const request = { specialization: 'Test Specialization', date: '2024-02-20', description: 'Test description' };
  
      insertOneStub.resolves({ insertedCount: 1 }); // Stub to simulate successful insertion
  
      const res = await chai.request(app)
        .post('/customer_requests')
        .set('x-token', token)
        .send(request);
  
      expect(res).to.have.status(200);
      expect(res.text).to.equal('request received');
    });

  });

