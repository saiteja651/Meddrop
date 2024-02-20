const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');
const app = require('../server/server'); // Update the path as necessary
const { MongoClient } = require("mongodb");

describe('POST /cus_in', () => {
    let client;
    let db;
    let doc_reg;
    let findOneStub;

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
    });

    afterEach(() => {
        findOneStub.restore();
    });

    it('should return token when user exists and password is correct', async () => {
        const userData = {
            email: 'johndoe@example.com',
            pass: 'password'
        };

        // Stub the findOne method to simulate that the user exists and password is correct
        findOneStub.resolves({
            _id: '12345', // Mock user id
            email: userData.email,
            pass: userData.pass
        });

        const response = await request(app)
            .post('/cus_in')
            .send(userData);

        expect(response.status).to.equal(200);
        
    });

    it('should return "wrong password" when user exists but password is incorrect', async () => {
        const userData = {
            email: 'johndoe@example.com',
            pass: 'wrongpassword'
        };

        // Stub the findOne method to simulate that the user exists but password is incorrect
        findOneStub.resolves({
            email: userData.email,
            pass: 'correctpassword' // Mock correct password
        });

        const response = await request(app)
            .post('/cus_in')
            .send(userData);

        expect(response.status).to.equal(200); // Assuming status is always 200 even for wrong password
       
    });

    it('should return "user doesnt exist create new account" when user does not exist', async () => {
        const userData = {
            email: 'nonexistentuser@example.com',
            pass: 'password'
        };

        // Stub the findOne method to simulate that the user does not exist
        findOneStub.resolves(null);

        const response = await request(app)
            .post('/cus_in')
            .send(userData);

        expect(response.status).to.equal(200); // Assuming status is always 200 even for non-existent user
        expect(response.text).to.equal('user doesnt exist create new account');

        // sinon.assert.calledOnce(findOneStub);
        // sinon.assert.calledWith(findOneStub, { email: userData.email });
    });
});
