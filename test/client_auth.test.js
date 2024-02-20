const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);

const {app, doc_reg,jwt,cus_reg} = require('../server/server'); // Assuming your Express server is exported from this file
describe('POST /cus_up', () => {
    let findOneStub, insertOneStub;
  
    beforeEach(() => {
      findOneStub = sinon.stub(cus_reg, 'findOne');
      insertOneStub = sinon.stub(cus_reg, 'insertOne');
    });
  
    afterEach(() => {
      findOneStub.restore();
      insertOneStub.restore();
    });
  
    it('should return "user exists" if user already exists', async () => {
      const existingUser = { name: 'Test User', email: 'test@example.com', pass: 'password', photo: 'photo.jpg' };
      findOneStub.withArgs({ email: existingUser.email }).resolves(existingUser); // Stub to simulate user already exists
  
      const res = await chai.request(app)
        .post('/cus_up')
        .send(existingUser);
  
      expect(res).to.have.status(200);
      expect(res.text).to.equal('user exist');
    });
  
    it('should add new user data if user does not exist', async () => {
      const newUser = { name: 'New User', email: 'newuser@example.com', pass: 'password', photo: 'photo.jpg' };
      findOneStub.withArgs({ email: newUser.email }).resolves(null); // Stub to simulate user does not exist
      insertOneStub.resolves({ insertedCount: 1 }); // Stub to simulate successful insertion
  
      const res = await chai.request(app)
        .post('/cus_up')
        .send(newUser);
        console.log(res.text)
      expect(res).to.have.status(200);
      expect(res.text).to.equal('data added');
    });
  });
  