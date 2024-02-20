const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);

const {app, doc_reg,jwt} = require('../server/server'); // Assuming your Express server is exported from this file

describe('POST /doc_signup', () => {
  let findOneStub, insertOneStub;

  beforeEach(() => {
    findOneStub = sinon.stub(doc_reg, 'findOne');
    insertOneStub = sinon.stub(doc_reg, 'insertOne');
  });

  afterEach(() => {
    findOneStub.restore();
    insertOneStub.restore();
  });


  it('should return "user exists" if user already exists', async () => {
    const existingUser = { name: 'Test User', email: 'test@example.com', pass: 'password', photo: 'photo.jpg', specialization: 'Test Specialization' };
    findOneStub.withArgs({ email: existingUser.email }).resolves(existingUser); // Stub to simulate user already exists

    const res = await chai.request(app)
      .post('/doc_signup')
      .send(existingUser);
    expect(res).to.have.status(409);
    expect(res.text).to.equal('user exists');
  });

  it('should add new user data if user does not exist', async () => {
    const newUser = { name: 'New User', email: 'newuser@example.com', pass: 'password', photo: 'photo.jpg', specialization: 'New Specialization' };
    findOneStub.withArgs({ email: newUser.email }).resolves(null); // Stub to simulate user does not exist
    insertOneStub.resolves({ insertedCount: 1 }); // Stub to simulate successful insertion

    const res = await chai.request(app)
      .post('/doc_signup')
      .send(newUser);

    expect(res).to.have.status(200);
    expect(res.text).to.equal('data added');
  });
});
describe('POST /doc_login', () => {
  let findOneStub, jwtSignStub;

  beforeEach(() => {
    findOneStub = sinon.stub(doc_reg, 'findOne');
    jwtSignStub = sinon.stub(jwt, 'sign');
  });

  afterEach(() => {
    findOneStub.restore();
    jwtSignStub.restore();
  });

  it('should return JWT token if email and password are correct', async () => {
    const existingUser = { _id: 'user_id', email: 'test@example.com', pass: 'password' };
    findOneStub.withArgs({ email: existingUser.email }).resolves(existingUser); // Stub to simulate user exists
    jwtSignStub.callsFake((payload, secret, callback) => {
      callback(null, 'mocked_token');
    }); // Stub to simulate jwt.sign

    const res = await chai.request(app)
      .post('/doc_login')
      .send({ email: existingUser.email, pass: existingUser.pass });

    expect(res).to.have.status(200);
    expect(res.body).to.equal('mocked_token');
  });

  it('should return "wrong password" if password is incorrect', async () => {
    const existingUser = { _id: 'user_id', email: 'test@example.com', pass: 'password' };
    findOneStub.withArgs({ email: existingUser.email }).resolves(existingUser); // Stub to simulate user exists

    const res = await chai.request(app)
      .post('/doc_login')
      .send({ email: existingUser.email, pass: 'incorrect_password' });

    expect(res).to.have.status(200);
    expect(res.text).to.equal('wrong password');
  });

  it('should return "user doesnt exist create new account" if user does not exist', async () => {
    findOneStub.withArgs({ email: 'nonexistent@example.com' }).resolves(null); // Stub to simulate user does not exist

    const res = await chai.request(app)
      .post('/doc_login')
      .send({ email: 'nonexistent@example.com', pass: 'password' });

    expect(res).to.have.status(200);
    expect(res.text).to.equal('user doesnt exist create new account');
  });
});
