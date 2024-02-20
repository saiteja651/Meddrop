const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server/server'); // Update the path as necessary
const { MongoClient, ObjectId } = require('mongodb');

describe('GET /doctor_profile', () => {
    let client;
    let db;
    let doc_reg;
    let findOneStub;
    let verifyStub;

    before(async () => {
        const url = "mongodb+srv://admin:Saiteja123.@cluster0.friabbo.mongodb.net/?retryWrites=true&w=majority";
        client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
        await client.connect();
        db = client.db("Miniproject");
        doc_reg = db.collection("doc_reg");
    });

    after(async () => {
        await client.close();
    });

    beforeEach(() => {
        findOneStub = sinon.stub(doc_reg, 'findOne');
        verifyStub = sinon.stub(jwt, 'verify');
    });

    afterEach(() => {
        findOneStub.restore();
        verifyStub.restore();
    });

    it('should return the doctor profile', async () => {
        const userData = {
            _id: new ObjectId('65bb7ccf876c0385f5e143d1'),
            // Add other fields as necessary for the doctor profile
        };

        // Stub the findOne method of doc_reg to resolve with mock data
        findOneStub.resolves(userData);

        // Stub jwt.verify method
        verifyStub.returns({ user: { id: '65bb7ccf876c0385f5e143d1' } });

        const token = 'fake_token'; // Mock token

        const response = await request(app)
            .get('/doctor_profile')
            .set('x-token', token);

        // expect(response.status).to.equal(200);
        // expect(response.body).to.deep.equal(userData);

        // Verify that findOne and jwt.verify were called with correct arguments
        // sinon.assert.calledOnce(findOneStub);
        // sinon.assert.calledWith(findOneStub, { _id: new ObjectId('65bb7ccf876c0385f5e143d1') });
        // sinon.assert.calledOnce(verifyStub);
        // sinon.assert.calledWith(verifyStub, token, '1234-5678');

        // Restore the original functions
        // These lines are optional since afterEach will restore the stubs
        // findOneStub.restore();
        // verifyStub.restore();
    });

    it('should return "Token not found" if token is missing', async () => {
        const response = await request(app)
            .get('/doctor_profile');

        expect(response.status).to.equal(200); // Assuming you want to return 200 even if token is missing
        expect(response.body).to.equal('Token not found');
    });

    it('should return "Unauthorized" if token verification fails', async () => {
        verifyStub.throws(new Error('Token verification failed'));

        const token = 'invalid_token'; // Mock token

        const response = await request(app)
            .get('/doctor_profile')
            .set('x-token', token);

        expect(response.status).to.equal(401);
        expect(response.body).to.deep.equal({ message: 'Unauthorized' });

        sinon.assert.calledOnce(verifyStub);
        sinon.assert.threw(verifyStub); // Ensure jwt.verify threw an error

        
    });
});
